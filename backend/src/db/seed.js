import pool from '../config/db.js';
import bcrypt from 'bcryptjs';

async function seed() {
  console.log('🌱 Seeding initial game data for Life RPG...');
  try {
    // Check if test user already exists
    const existing = await pool.query("SELECT id FROM users WHERE email = 'governor@liferpg.io'");
    if (existing.rows.length === 0) {
      const passwordHash = await bcrypt.hash('rpg12345', 10);
      
      const userRes = await pool.query(
        `INSERT INTO users (username, email, password_hash, governor_title, city_name, active_theme)
         VALUES ('GovernorMax', 'governor@liferpg.io', $1, 'Warden of Hawkins', 'Hawkins Township', 'theme-h')
         RETURNING id`,
        [passwordHash]
      );
      const userId = userRes.rows[0].id;

      // Seed progression
      await pool.query(
        `INSERT INTO user_progression 
         (user_id, xp, level, gold, current_streak, longest_streak, population, tech_xp, knowledge_xp, strength_xp, wellness_xp, economy_xp, culture_xp, community_xp)
         VALUES ($1, 240, 2, 350, 3, 3, 280, 80, 90, 40, 20, 10, 0, 0)`,
        [userId]
      );

      // Seed starter buildings
      await pool.query(
        `INSERT INTO user_buildings (user_id, district, building_key, name, tier)
         VALUES 
         ($1, 'technology', 'tech_radio_tower', 'AV Club Radio Tower', 1),
         ($1, 'knowledge', 'study_library', 'Hawkins Public Archives', 1),
         ($1, 'strength', 'strength_gym', 'Hawkins Middle Gym', 1)`,
        [userId]
      );

      // Seed starter inventory
      await pool.query(
        `INSERT INTO inventory_items (user_id, item_key, item_name, item_type, is_equipped)
         VALUES 
         ($1, 'badge_hellfire', 'Hellfire Club Pin', 'badge', true),
         ($1, 'theme_upside_down', 'The Upside Down Theme', 'theme', true)`,
        [userId]
      );

      // Seed initial campaign
      const campRes = await pool.query(
        `INSERT INTO campaigns (user_id, title, description, real_life_goal, total_quests, completed_quests)
         VALUES ($1, 'Survive the Mind Flayer Storm', 'A grueling trial to conquer DBMS exam prep and master database indexing.', 'Prepare for DBMS Exam', 3, 1)
         RETURNING id`,
        [userId]
      );
      const campaignId = campRes.rows[0].id;

      // Seed campaign boss
      await pool.query(
        `INSERT INTO campaign_bosses (campaign_id, user_id, title, boss_type, description, max_hp, current_hp, is_defeated, reward_gold, reward_xp)
         VALUES ($1, $2, 'The Shadow Mind Flayer', 'mind_flayer', 'A towering interdimensional monstrosity feeding on procrastination and unfinished goals.', 500, 375, false, 250, 500)`,
        [campaignId, userId]
      );

      // Seed quests
      await pool.query(
        `INSERT INTO quests (user_id, campaign_id, title, description, category, difficulty, xp_reward, gold_reward, attribute_type, attribute_gain, boss_damage, is_completed, completed_at)
         VALUES 
         ($1, $2, 'Normalize Database Schema to 3NF', 'Study 1NF through BCNF functional dependencies and solve 3 sample decomposition problems.', 'study', 'medium', 60, 25, 'knowledge', 12, 60, true, CURRENT_TIMESTAMP),
         ($1, $2, 'Implement B-Tree Index Query Optimization', 'Write EXPLAIN ANALYZE on complex multi-table joins to debug performance bottlenecks.', 'coding', 'hard', 125, 60, 'tech', 25, 125, false, NULL),
         ($1, $2, '30-Minute Cardio Sprint Session', 'Clear mental fatigue and recharge cognitive stamina for evening revision.', 'fitness', 'easy', 25, 10, 'strength', 5, 25, false, NULL)`,
        [userId, campaignId]
      );

      // Seed achievements
      await pool.query(
        `INSERT INTO achievements (user_id, achievement_key, title, description, icon)
         VALUES 
         ($1, 'first_quest', 'First Blood in the Fog', 'Successfully completed your first real-life quest.', 'sword'),
         ($1, 'flayer_damaged', 'Shadow Piercer', 'Inflicted direct damage to a campaign boss.', 'zap')`,
        [userId]
      );

      console.log('✅ Demo account seeded: governor@liferpg.io / rpg12345');
    } else {
      console.log('ℹ️ Demo account already exists.');
    }
    process.exit(0);
  } catch (error) {
    console.error('❌ Seeding failed:', error);
    process.exit(1);
  }
}

seed();
