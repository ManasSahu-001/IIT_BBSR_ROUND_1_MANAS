import pool from '../config/db.js';
import { generateAIQuestCampaign } from '../services/aiService.js';
import { QUEST_DIFFICULTY_REWARDS, CATEGORY_TO_ATTRIBUTE } from '../services/rpgEngine.js';

export const generateCampaign = async (req, res) => {
  const userId = req.user.id;
  const { goal } = req.body;

  if (!goal || !goal.trim()) {
    return res.status(400).json({ success: false, error: 'Real-life goal cannot be empty.' });
  }

  const client = await pool.connect();
  try {
    // 1. Generate structured campaign content via AI Quest Master (with procedural fallback)
    const generated = await generateAIQuestCampaign(goal);

    await client.query('BEGIN');

    // 2. Insert Campaign
    const campRes = await client.query(
      `INSERT INTO campaigns (user_id, title, description, real_life_goal, total_quests, completed_quests)
       VALUES ($1, $2, $3, $4, $5, 0)
       RETURNING *`,
      [
        userId,
        generated.campaign.title,
        generated.campaign.description,
        goal.trim(),
        generated.quests.length
      ]
    );
    const campaign = campRes.rows[0];

    // 3. Insert Boss
    const bossRes = await client.query(
      `INSERT INTO campaign_bosses (campaign_id, user_id, title, boss_type, description, max_hp, current_hp, reward_gold, reward_xp)
       VALUES ($1, $2, $3, $4, $5, $6, $6, $7, $8)
       RETURNING *`,
      [
        campaign.id,
        userId,
        generated.boss.title,
        generated.boss.boss_type,
        generated.boss.description,
        generated.boss.max_hp,
        250, // reward gold
        500  // reward xp
      ]
    );
    const boss = bossRes.rows[0];

    // 4. Insert linked Quests
    const createdQuests = [];
    for (const q of generated.quests) {
      const rewards = QUEST_DIFFICULTY_REWARDS[q.difficulty] || QUEST_DIFFICULTY_REWARDS.medium;
      const attrType = CATEGORY_TO_ATTRIBUTE[q.category] || 'knowledge_xp';

      const qRes = await client.query(
        `INSERT INTO quests (
          user_id, campaign_id, title, description, category, difficulty,
          xp_reward, gold_reward, attribute_type, attribute_gain, boss_damage
        )
        VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11)
        RETURNING *`,
        [
          userId,
          campaign.id,
          q.title,
          q.description,
          q.category,
          q.difficulty,
          rewards.xp,
          rewards.gold,
          attrType,
          rewards.attributeGain,
          rewards.bossDamage
        ]
      );
      createdQuests.push(qRes.rows[0]);
    }

    await client.query('COMMIT');

    return res.status(201).json({
      success: true,
      campaign,
      boss,
      quests: createdQuests
    });
  } catch (err) {
    await client.query('ROLLBACK');
    console.error('[GenerateCampaign Error]', err);
    return res.status(500).json({ success: false, error: 'Failed to generate and forge campaign.' });
  } finally {
    client.release();
  }
};

export const getCampaigns = async (req, res) => {
  const userId = req.user.id;

  try {
    const campaignsRes = await pool.query(
      `SELECT * FROM campaigns WHERE user_id = $1 ORDER BY created_at DESC`,
      [userId]
    );

    const fullCampaigns = [];
    for (const camp of campaignsRes.rows) {
      const bossRes = await pool.query(
        `SELECT * FROM campaign_bosses WHERE campaign_id = $1`,
        [camp.id]
      );
      const questsRes = await pool.query(
        `SELECT * FROM quests WHERE campaign_id = $1 ORDER BY is_completed ASC, id ASC`,
        [camp.id]
      );

      fullCampaigns.push({
        ...camp,
        boss: bossRes.rows[0] || null,
        quests: questsRes.rows
      });
    }

    return res.json({ success: true, campaigns: fullCampaigns });
  } catch (err) {
    console.error('[GetCampaigns Error]', err);
    return res.status(500).json({ success: false, error: 'Failed to retrieve campaigns.' });
  }
};

export const getCampaignDetails = async (req, res) => {
  const userId = req.user.id;
  const campaignId = req.params.id;

  try {
    const campRes = await pool.query(
      `SELECT * FROM campaigns WHERE id = $1 AND user_id = $2`,
      [campaignId, userId]
    );

    if (campRes.rows.length === 0) {
      return res.status(404).json({ success: false, error: 'Campaign not found or unauthorized.' });
    }

    const bossRes = await pool.query(
      `SELECT * FROM campaign_bosses WHERE campaign_id = $1`,
      [campaignId]
    );

    const questsRes = await pool.query(
      `SELECT * FROM quests WHERE campaign_id = $1 ORDER BY is_completed ASC, id ASC`,
      [campaignId]
    );

    return res.json({
      success: true,
      campaign: campRes.rows[0],
      boss: bossRes.rows[0] || null,
      quests: questsRes.rows
    });
  } catch (err) {
    console.error('[GetCampaignDetails Error]', err);
    return res.status(500).json({ success: false, error: 'Failed to retrieve campaign details.' });
  }
};
