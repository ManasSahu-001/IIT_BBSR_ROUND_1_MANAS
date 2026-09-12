import pool from '../config/db.js';
import { calculateLevelFromTotalXP, calculatePopulation } from '../services/rpgEngine.js';

// Available buildings catalog with required city levels and gold cost
export const CITY_BUILDINGS_CATALOG = [
  // Technology
  { key: 'tech_radio_tower', name: 'AV Club Radio Tower', district: 'technology', cost: 100, minLevel: 1, icon: 'radio', description: 'Enhances communication and tech quest efficiency.' },
  { key: 'tech_lab', name: 'Hawkins Energy Lab', district: 'technology', cost: 250, minLevel: 5, icon: 'cpu', description: 'Advanced computational research facility.' },
  { key: 'tech_mainframe', name: 'Department Cyber Core', district: 'technology', cost: 600, minLevel: 15, icon: 'server', description: 'A massive neural mainframe for complex projects.' },
  
  // Knowledge
  { key: 'study_library', name: 'Hawkins Public Archives', district: 'knowledge', cost: 100, minLevel: 1, icon: 'book', description: 'Repository of arcane lore and scholarly research.' },
  { key: 'study_academy', name: 'Governor Academy of Science', district: 'knowledge', cost: 300, minLevel: 8, icon: 'graduation-cap', description: 'Higher institution for master level knowledge.' },
  
  // Physical Defense & Strength
  { key: 'strength_gym', name: 'Iron Crucible Gym', district: 'strength', cost: 100, minLevel: 1, icon: 'dumbbell', description: 'Trains physical resilience and conditioning.' },
  { key: 'strength_colosseum', name: 'Heroic Arena', district: 'strength', cost: 400, minLevel: 10, icon: 'swords', description: 'Colosseum where warriors prepare for epic trials.' },
  
  // Wellness
  { key: 'wellness_sanctuary', name: 'Botanical Sanctuary', district: 'wellness', cost: 150, minLevel: 2, icon: 'heart', description: 'Restful gardens that restore cognitive stamina.' },
  { key: 'wellness_monastery', name: 'Silent Peak Monastery', district: 'wellness', cost: 350, minLevel: 7, icon: 'sun', description: 'Temple of inner peace and mindfulness.' },

  // Economy & Culture
  { key: 'economy_bank', name: 'Founders Vault & Exchange', district: 'economy', cost: 200, minLevel: 3, icon: 'coins', description: 'Boosts gold generation and treasury commerce.' },
  { key: 'culture_theater', name: 'The Palace Arcade & Cinema', district: 'culture', cost: 200, minLevel: 4, icon: 'film', description: 'Cultural hub generating artistic inspiration.' }
];

export const getCity = async (req, res) => {
  const userId = req.user.id;

  try {
    const userRes = await pool.query(`SELECT city_name, governor_title, active_theme FROM users WHERE id = $1`, [userId]);
    const progRes = await pool.query(`SELECT * FROM user_progression WHERE user_id = $1`, [userId]);
    const buildingsRes = await pool.query(`SELECT * FROM user_buildings WHERE user_id = $1 ORDER BY unlocked_at ASC`, [userId]);

    const user = userRes.rows[0];
    const progression = progRes.rows[0];
    const levelInfo = calculateLevelFromTotalXP(progression.xp);
    const population = calculatePopulation(levelInfo.level, progression.current_streak, progression.gold, buildingsRes.rows.length);

    // Group user buildings by district
    const districts = {
      technology: [],
      knowledge: [],
      strength: [],
      wellness: [],
      economy: [],
      culture: [],
      community: []
    };

    const unlockedKeys = new Set();
    buildingsRes.rows.forEach(b => {
      if (districts[b.district]) {
        districts[b.district].push(b);
      }
      unlockedKeys.add(b.building_key);
    });

    // Mark catalog buildings as unlocked or available
    const catalogWithStatus = CITY_BUILDINGS_CATALOG.map(item => ({
      ...item,
      isUnlocked: unlockedKeys.has(item.key),
      canAfford: progression.gold >= item.cost,
      meetsLevel: levelInfo.level >= item.minLevel
    }));

    return res.json({
      success: true,
      cityName: user.city_name,
      governorTitle: user.governor_title,
      activeTheme: user.active_theme,
      levelInfo,
      population,
      gold: progression.gold,
      districts,
      userBuildings: buildingsRes.rows,
      catalog: catalogWithStatus
    });
  } catch (err) {
    console.error('[GetCity Error]', err);
    return res.status(500).json({ success: false, error: 'Failed to retrieve city data.' });
  }
};

export const constructBuilding = async (req, res) => {
  const userId = req.user.id;
  const { buildingKey } = req.body;

  const buildingDef = CITY_BUILDINGS_CATALOG.find(b => b.key === buildingKey);
  if (!buildingDef) {
    return res.status(404).json({ success: false, error: 'Building not found in city blueprints.' });
  }

  const client = await pool.connect();
  try {
    await client.query('BEGIN');

    // 1. Check if already constructed
    const existing = await client.query(
      `SELECT id FROM user_buildings WHERE user_id = $1 AND building_key = $2`,
      [userId, buildingKey]
    );

    if (existing.rows.length > 0) {
      await client.query('ROLLBACK');
      return res.status(400).json({ success: false, error: 'Building is already constructed in your city.' });
    }

    // 2. Check user gold and level
    const progRes = await client.query(`SELECT * FROM user_progression WHERE user_id = $1 FOR UPDATE`, [userId]);
    const progression = progRes.rows[0];
    const levelInfo = calculateLevelFromTotalXP(progression.xp);

    if (levelInfo.level < buildingDef.minLevel) {
      await client.query('ROLLBACK');
      return res.status(400).json({ 
        success: false, 
        error: `Requires City Level ${buildingDef.minLevel} to construct ${buildingDef.name}. Current level: ${levelInfo.level}.` 
      });
    }

    if (progression.gold < buildingDef.cost) {
      await client.query('ROLLBACK');
      return res.status(400).json({ 
        success: false, 
        error: `Insufficient gold in treasury. Required: ${buildingDef.cost} Gold, Available: ${progression.gold} Gold.` 
      });
    }

    // 3. Deduct gold
    const newGold = progression.gold - buildingDef.cost;
    await client.query(`UPDATE user_progression SET gold = $1 WHERE user_id = $2`, [newGold, userId]);

    // 4. Insert building
    const insertRes = await client.query(
      `INSERT INTO user_buildings (user_id, district, building_key, name, tier)
       VALUES ($1, $2, $3, $4, 1)
       RETURNING *`,
      [userId, buildingDef.district, buildingDef.key, buildingDef.name]
    );

    // 5. Also add to inventory as owned building artifact
    await client.query(
      `INSERT INTO inventory_items (user_id, item_key, item_name, item_type, is_equipped)
       VALUES ($1, $2, $3, 'building', true)`,
      [userId, buildingDef.key, buildingDef.name]
    );

    await client.query('COMMIT');

    return res.status(201).json({
      success: true,
      building: insertRes.rows[0],
      newGold,
      message: `Successfully erected ${buildingDef.name} in the ${buildingDef.district} district!`
    });
  } catch (err) {
    await client.query('ROLLBACK');
    console.error('[ConstructBuilding Error]', err);
    return res.status(500).json({ success: false, error: 'Failed to construct building.' });
  } finally {
    client.release();
  }
};
