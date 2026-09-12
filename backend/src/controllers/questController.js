import pool from '../config/db.js';
import {
  QUEST_DIFFICULTY_REWARDS,
  CATEGORY_TO_ATTRIBUTE,
  calculateLevelFromTotalXP,
  calculateStreakUpdate,
  calculatePopulation
} from '../services/rpgEngine.js';
import { applyBossDamage } from '../services/bossService.js';

export const getQuests = async (req, res) => {
  const userId = req.user.id;
  const { status, campaignId, category } = req.query;

  try {
    let sql = `SELECT * FROM quests WHERE user_id = $1`;
    const params = [userId];

    if (status === 'active') {
      sql += ` AND is_completed = false`;
    } else if (status === 'completed') {
      sql += ` AND is_completed = true`;
    }

    if (campaignId) {
      params.push(campaignId);
      sql += ` AND campaign_id = $${params.length}`;
    }

    if (category) {
      params.push(category);
      sql += ` AND category = $${params.length}`;
    }

    sql += ` ORDER BY is_completed ASC, created_at DESC`;

    const result = await pool.query(sql, params);
    return res.json({ success: true, quests: result.rows });
  } catch (err) {
    console.error('[GetQuests Error]', err);
    return res.status(500).json({ success: false, error: 'Failed to retrieve quests.' });
  }
};

export const createQuest = async (req, res) => {
  const userId = req.user.id;
  const { title, description, category, difficulty, campaignId, dueDate } = req.body;

  if (!title || !title.trim()) {
    return res.status(400).json({ success: false, error: 'Quest title cannot be empty.' });
  }

  const validCategories = ['coding', 'study', 'fitness', 'wellness', 'finance', 'creative', 'social'];
  const validDifficulties = ['easy', 'medium', 'hard', 'epic'];

  const questCategory = validCategories.includes(category) ? category : 'study';
  const questDifficulty = validDifficulties.includes(difficulty) ? difficulty : 'medium';

  // Authoritatively determine rewards from backend rules
  const rewards = QUEST_DIFFICULTY_REWARDS[questDifficulty];
  const attributeType = CATEGORY_TO_ATTRIBUTE[questCategory] || 'knowledge_xp';

  const client = await pool.connect();
  try {
    await client.query('BEGIN');

    // If campaign is specified, verify ownership
    let validCampaignId = null;
    if (campaignId) {
      const campCheck = await client.query(`SELECT id FROM campaigns WHERE id = $1 AND user_id = $2`, [campaignId, userId]);
      if (campCheck.rows.length > 0) {
        validCampaignId = campaignId;
        await client.query(`UPDATE campaigns SET total_quests = total_quests + 1 WHERE id = $1`, [validCampaignId]);
      }
    }

    const insertSql = `
      INSERT INTO quests (
        user_id, campaign_id, title, description, category, difficulty, 
        xp_reward, gold_reward, attribute_type, attribute_gain, boss_damage, due_date
      )
      VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12)
      RETURNING *
    `;

    const result = await client.query(insertSql, [
      userId,
      validCampaignId,
      title.trim(),
      description?.trim() || '',
      questCategory,
      questDifficulty,
      rewards.xp,
      rewards.gold,
      attributeType,
      rewards.attributeGain,
      rewards.bossDamage,
      dueDate || null
    ]);

    await client.query('COMMIT');
    return res.status(201).json({ success: true, quest: result.rows[0] });
  } catch (err) {
    await client.query('ROLLBACK');
    console.error('[CreateQuest Error]', err);
    return res.status(500).json({ success: false, error: 'Failed to create quest.' });
  } finally {
    client.release();
  }
};

export const updateQuest = async (req, res) => {
  const userId = req.user.id;
  const questId = req.params.id;
  const { title, description, category, difficulty, dueDate } = req.body;

  try {
    const existing = await pool.query(`SELECT * FROM quests WHERE id = $1 AND user_id = $2`, [questId, userId]);
    if (existing.rows.length === 0) {
      return res.status(404).json({ success: false, error: 'Quest not found or unauthorized.' });
    }

    const quest = existing.rows[0];
    if (quest.is_completed) {
      return res.status(400).json({ success: false, error: 'Completed quests cannot be modified.' });
    }

    const validCategories = ['coding', 'study', 'fitness', 'wellness', 'finance', 'creative', 'social'];
    const validDifficulties = ['easy', 'medium', 'hard', 'epic'];

    const newCategory = validCategories.includes(category) ? category : quest.category;
    const newDifficulty = validDifficulties.includes(difficulty) ? difficulty : quest.difficulty;
    const rewards = QUEST_DIFFICULTY_REWARDS[newDifficulty];
    const attributeType = CATEGORY_TO_ATTRIBUTE[newCategory] || 'knowledge_xp';

    const updateSql = `
      UPDATE quests
      SET title = $1, description = $2, category = $3, difficulty = $4,
          xp_reward = $5, gold_reward = $6, attribute_type = $7, attribute_gain = $8,
          boss_damage = $9, due_date = $10
      WHERE id = $11 AND user_id = $12
      RETURNING *
    `;

    const result = await pool.query(updateSql, [
      title ? title.trim() : quest.title,
      description !== undefined ? description.trim() : quest.description,
      newCategory,
      newDifficulty,
      rewards.xp,
      rewards.gold,
      attributeType,
      rewards.attributeGain,
      rewards.bossDamage,
      dueDate !== undefined ? dueDate : quest.due_date,
      questId,
      userId
    ]);

    return res.json({ success: true, quest: result.rows[0] });
  } catch (err) {
    console.error('[UpdateQuest Error]', err);
    return res.status(500).json({ success: false, error: 'Failed to update quest.' });
  }
};

export const deleteQuest = async (req, res) => {
  const userId = req.user.id;
  const questId = req.params.id;

  const client = await pool.connect();
  try {
    await client.query('BEGIN');

    const check = await client.query(`SELECT * FROM quests WHERE id = $1 AND user_id = $2`, [questId, userId]);
    if (check.rows.length === 0) {
      await client.query('ROLLBACK');
      return res.status(404).json({ success: false, error: 'Quest not found or unauthorized.' });
    }

    const quest = check.rows[0];
    if (quest.campaign_id) {
      await client.query(
        `UPDATE campaigns 
         SET total_quests = GREATEST(0, total_quests - 1),
             completed_quests = CASE WHEN $1 = true THEN GREATEST(0, completed_quests - 1) ELSE completed_quests END
         WHERE id = $2`,
        [quest.is_completed, quest.campaign_id]
      );
    }

    await client.query(`DELETE FROM quests WHERE id = $1 AND user_id = $2`, [questId, userId]);
    await client.query('COMMIT');

    return res.json({ success: true, message: 'Quest successfully deleted.' });
  } catch (err) {
    await client.query('ROLLBACK');
    console.error('[DeleteQuest Error]', err);
    return res.status(500).json({ success: false, error: 'Failed to delete quest.' });
  } finally {
    client.release();
  }
};

/**
 * Authoritative Quest Completion Handler
 * Manages XP, leveling, Gold, Streaks, Department Attributes, Boss Damage, and Population
 */
export const completeQuest = async (req, res) => {
  const userId = req.user.id;
  const questId = req.params.id;

  const client = await pool.connect();
  try {
    await client.query('BEGIN');

    // 1. Lock and fetch quest
    const questRes = await client.query(
      `SELECT * FROM quests WHERE id = $1 AND user_id = $2 FOR UPDATE`,
      [questId, userId]
    );

    if (questRes.rows.length === 0) {
      await client.query('ROLLBACK');
      return res.status(404).json({ success: false, error: 'Quest not found or unauthorized.' });
    }

    const quest = questRes.rows[0];
    if (quest.is_completed) {
      await client.query('ROLLBACK');
      return res.status(400).json({ success: false, error: 'Quest has already been completed.' });
    }

    // 2. Fetch user progression
    const progRes = await client.query(
      `SELECT * FROM user_progression WHERE user_id = $1 FOR UPDATE`,
      [userId]
    );
    const progression = progRes.rows[0];

    const currentXP = Number(progression.xp);
    const newXP = currentXP + Number(quest.xp_reward);
    const newGold = Number(progression.gold) + Number(quest.gold_reward);

    // Calculate level progression
    const prevLevelInfo = calculateLevelFromTotalXP(currentXP);
    const newLevelInfo = calculateLevelFromTotalXP(newXP);
    const didLevelUp = newLevelInfo.level > prevLevelInfo.level;

    // Calculate streak
    const streakResult = calculateStreakUpdate(
      progression.last_quest_completed_at,
      progression.current_streak,
      progression.longest_streak
    );

    // Calculate department attribute increment
    let attributeColumn = quest.attribute_type || 'knowledge_xp';
    if (!attributeColumn.endsWith('_xp')) {
      attributeColumn = `${attributeColumn}_xp`;
    }
    const validCols = ['tech_xp', 'knowledge_xp', 'strength_xp', 'wellness_xp', 'economy_xp', 'culture_xp', 'community_xp'];
    if (!validCols.includes(attributeColumn)) {
      attributeColumn = 'knowledge_xp';
    }
    const currentAttrVal = Number(progression[attributeColumn] || 0);
    const newAttrVal = currentAttrVal + Number(quest.attribute_gain);

    // Fetch user building count for population
    const buildingCountRes = await client.query(`SELECT COUNT(*) FROM user_buildings WHERE user_id = $1`, [userId]);
    const buildingsCount = parseInt(buildingCountRes.rows[0].count, 10);
    const newPopulation = calculatePopulation(newLevelInfo.level, streakResult.newStreak, newGold, buildingsCount);

    // 3. Mark quest completed
    const updatedQuestRes = await client.query(
      `UPDATE quests 
       SET is_completed = true, completed_at = CURRENT_TIMESTAMP 
       WHERE id = $1 RETURNING *`,
      [questId]
    );

    // 4. Update user progression in DB
    const updateProgSql = `
      UPDATE user_progression
      SET xp = $1,
          level = $2,
          gold = $3,
          current_streak = $4,
          longest_streak = $5,
          last_quest_completed_at = CURRENT_DATE,
          ${attributeColumn} = $6,
          population = $7,
          updated_at = CURRENT_TIMESTAMP
      WHERE user_id = $8
      RETURNING *
    `;

    const updatedProgRes = await client.query(updateProgSql, [
      newXP,
      newLevelInfo.level,
      newGold,
      streakResult.newStreak,
      streakResult.newLongest,
      newAttrVal,
      newPopulation,
      userId
    ]);

    // 5. If quest belongs to an active campaign, apply boss damage & update campaign counters
    let bossDamageResult = null;
    let campaignUpdate = null;

    if (quest.campaign_id) {
      bossDamageResult = await applyBossDamage(client, quest.campaign_id, userId, quest.boss_damage || quest.xp_reward);

      const campRes = await client.query(
        `UPDATE campaigns 
         SET completed_quests = completed_quests + 1,
             status = CASE WHEN completed_quests + 1 >= total_quests THEN 'completed' ELSE status END
         WHERE id = $1 AND user_id = $2
         RETURNING *`,
        [quest.campaign_id, userId]
      );
      campaignUpdate = campRes.rows[0];

      // If boss was defeated in this hit and awarded extra gold/xp
      if (bossDamageResult && bossDamageResult.isDefeated && (bossDamageResult.bonusGold > 0 || bossDamageResult.bonusXp > 0)) {
        await client.query(
          `UPDATE user_progression 
           SET gold = gold + $1, xp = xp + $2 
           WHERE user_id = $3`,
          [bossDamageResult.bonusGold, bossDamageResult.bonusXp, userId]
        );
      }
    }

    await client.query('COMMIT');

    return res.json({
      success: true,
      quest: updatedQuestRes.rows[0],
      progression: {
        ...updatedProgRes.rows[0],
        ...newLevelInfo
      },
      levelUp: didLevelUp,
      previousLevel: prevLevelInfo.level,
      newLevel: newLevelInfo.level,
      streak: streakResult,
      bossBattle: bossDamageResult,
      campaign: campaignUpdate,
      rewards: {
        xpGained: quest.xp_reward,
        goldGained: quest.gold_reward,
        attributeGained: {
          type: attributeColumn,
          amount: quest.attribute_gain
        }
      }
    });
  } catch (err) {
    await client.query('ROLLBACK');
    console.error('[CompleteQuest Error]', err);
    return res.status(500).json({ success: false, error: 'Failed to complete quest.' });
  } finally {
    client.release();
  }
};
