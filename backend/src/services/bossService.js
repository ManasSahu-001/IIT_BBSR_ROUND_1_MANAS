import pool from '../config/db.js';

/**
 * Applies authoritative damage to a campaign boss when a linked quest is completed.
 * Must run within an active DB client / transaction.
 */
export const applyBossDamage = async (client, campaignId, userId, damageAmount) => {
  if (!campaignId) return null;

  // Fetch active boss for this campaign
  const bossQuery = await client.query(
    `SELECT * FROM campaign_bosses WHERE campaign_id = $1 AND user_id = $2 FOR UPDATE`,
    [campaignId, userId]
  );

  if (bossQuery.rows.length === 0) return null;

  const boss = bossQuery.rows[0];
  if (boss.is_defeated) {
    return {
      boss,
      damageDealt: 0,
      alreadyDefeated: true
    };
  }

  const previousHp = boss.current_hp;
  const newHp = Math.max(0, previousHp - damageAmount);
  const isDefeated = newHp === 0;

  await client.query(
    `UPDATE campaign_bosses 
     SET current_hp = $1, is_defeated = $2 
     WHERE id = $3`,
    [newHp, isDefeated, boss.id]
  );

  // If defeated, mark campaign completed if all quests completed, or award extra victory spoils
  let bonusGold = 0;
  let bonusXp = 0;
  if (isDefeated) {
    bonusGold = boss.reward_gold || 200;
    bonusXp = boss.reward_xp || 400;

    // Check achievement unlock
    await client.query(
      `INSERT INTO achievements (user_id, achievement_key, title, description, icon)
       VALUES ($1, 'boss_vanquisher', 'Slayer of the Shadow', 'Defeated a Campaign Boss and liberated the district.', 'trophy')
       ON CONFLICT (user_id, achievement_key) DO NOTHING`,
      [userId]
    );
  }

  return {
    bossId: boss.id,
    title: boss.title,
    bossType: boss.boss_type,
    maxHp: boss.max_hp,
    previousHp,
    currentHp: newHp,
    damageDealt: damageAmount,
    isDefeated,
    bonusGold,
    bonusXp
  };
};
