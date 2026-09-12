import express from 'express';
import pool from '../config/db.js';
import { calculateLevelFromTotalXP } from '../services/rpgEngine.js';
import { authenticateToken } from '../middleware/auth.js';

const router = express.Router();
router.use(authenticateToken);

router.get('/', async (req, res) => {
  const userId = req.user.id;

  try {
    const userRes = await pool.query(
      `SELECT id, username, email, governor_title, city_name, active_theme, created_at FROM users WHERE id = $1`,
      [userId]
    );
    const progRes = await pool.query(`SELECT * FROM user_progression WHERE user_id = $1`, [userId]);
    const achRes = await pool.query(`SELECT * FROM achievements WHERE user_id = $1 ORDER BY unlocked_at DESC`, [userId]);
    const questStats = await pool.query(
      `SELECT 
         COUNT(*) as total_quests,
         COUNT(CASE WHEN is_completed = true THEN 1 END) as completed_quests,
         COUNT(CASE WHEN is_completed = false THEN 1 END) as active_quests
       FROM quests WHERE user_id = $1`,
      [userId]
    );
    const bossStats = await pool.query(
      `SELECT 
         COUNT(*) as total_bosses,
         COUNT(CASE WHEN is_defeated = true THEN 1 END) as defeated_bosses
       FROM campaign_bosses WHERE user_id = $1`,
      [userId]
    );

    const user = userRes.rows[0];
    const progression = progRes.rows[0];
    const levelInfo = calculateLevelFromTotalXP(progression ? progression.xp : 0);

    return res.json({
      success: true,
      governor: {
        ...user,
        ...progression,
        ...levelInfo
      },
      attributes: {
        technology: progression?.tech_xp || 0,
        knowledge: progression?.knowledge_xp || 0,
        strength: progression?.strength_xp || 0,
        wellness: progression?.wellness_xp || 0,
        economy: progression?.economy_xp || 0,
        culture: progression?.culture_xp || 0,
        community: progression?.community_xp || 0
      },
      questStats: questStats.rows[0],
      bossStats: bossStats.rows[0],
      achievements: achRes.rows
    });
  } catch (err) {
    console.error('[GetStats Error]', err);
    return res.status(500).json({ success: false, error: 'Failed to retrieve stats.' });
  }
});

export default router;
