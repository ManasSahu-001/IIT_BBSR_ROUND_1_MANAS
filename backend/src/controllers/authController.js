import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import pool from '../config/db.js';
import { calculateLevelFromTotalXP, calculatePopulation } from '../services/rpgEngine.js';

const JWT_SECRET = process.env.JWT_SECRET || 'super_secret_life_rpg_governor_jwt_key_2026_secure';

export const register = async (req, res) => {
  const { username, email, password, cityName, governorTitle, activeTheme } = req.body;

  if (!username || !email || !password) {
    return res.status(400).json({ success: false, error: 'Username, email, and password are required.' });
  }

  if (password.length < 6) {
    return res.status(400).json({ success: false, error: 'Password must be at least 6 characters long.' });
  }

  const client = await pool.connect();
  try {
    await client.query('BEGIN');

    // Check duplicate
    const existing = await client.query('SELECT id FROM users WHERE email = $1 OR username = $2', [email, username]);
    if (existing.rows.length > 0) {
      await client.query('ROLLBACK');
      return res.status(409).json({ success: false, error: 'User with this email or username already exists.' });
    }

    const passwordHash = await bcrypt.hash(password, 10);
    const chosenTheme = activeTheme === 'theme-g' ? 'theme-g' : 'theme-h'; // Default to Theme H (Stranger Things 2)

    const userRes = await client.query(
      `INSERT INTO users (username, email, password_hash, governor_title, city_name, active_theme)
       VALUES ($1, $2, $3, $4, $5, $6)
       RETURNING id, username, email, governor_title, city_name, active_theme, created_at`,
      [
        username.trim(),
        email.toLowerCase().trim(),
        passwordHash,
        governorTitle?.trim() || 'Novice Founder',
        cityName?.trim() || 'Hawkins Township',
        chosenTheme
      ]
    );
    const user = userRes.rows[0];

    // Create user progression
    const progRes = await client.query(
      `INSERT INTO user_progression 
       (user_id, xp, level, gold, current_streak, longest_streak, population)
       VALUES ($1, 0, 1, 150, 0, 0, 100)
       RETURNING *`,
      [user.id]
    );
    const progression = progRes.rows[0];

    // Seed starter buildings
    await client.query(
      `INSERT INTO user_buildings (user_id, district, building_key, name, tier)
       VALUES 
       ($1, 'technology', 'tech_radio_tower', 'AV Club Radio Post', 1),
       ($1, 'knowledge', 'study_library', 'Hawkins Archives', 1),
       ($1, 'strength', 'strength_gym', 'Training Outpost', 1)`,
      [user.id]
    );

    // Seed starter inventory
    await client.query(
      `INSERT INTO inventory_items (user_id, item_key, item_name, item_type, is_equipped)
       VALUES 
       ($1, 'badge_founder', 'Charter Founder Sigil', 'badge', true),
       ($1, 'theme_upside_down', 'The Upside Down Theme', 'theme', true)`,
      [user.id]
    );

    await client.query('COMMIT');

    const token = jwt.sign(
      { id: user.id, username: user.username, email: user.email },
      JWT_SECRET,
      { expiresIn: '7d' }
    );

    const levelDetails = calculateLevelFromTotalXP(progression.xp);

    return res.status(201).json({
      success: true,
      token,
      user,
      progression: {
        ...progression,
        ...levelDetails
      }
    });
  } catch (err) {
    await client.query('ROLLBACK');
    console.error('[Register Error]', err);
    return res.status(500).json({ success: false, error: 'Registration failed due to server error.' });
  } finally {
    client.release();
  }
};

export const login = async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({ success: false, error: 'Email and password are required.' });
  }

  try {
    const userRes = await pool.query(
      `SELECT * FROM users WHERE email = $1 OR username = $1`,
      [email.toLowerCase().trim()]
    );

    if (userRes.rows.length === 0) {
      return res.status(401).json({ success: false, error: 'Invalid email or password.' });
    }

    const user = userRes.rows[0];
    const passwordValid = await bcrypt.compare(password, user.password_hash);
    if (!passwordValid) {
      return res.status(401).json({ success: false, error: 'Invalid email or password.' });
    }

    const progRes = await pool.query(`SELECT * FROM user_progression WHERE user_id = $1`, [user.id]);
    const progression = progRes.rows[0] || {
      xp: 0,
      level: 1,
      gold: 100,
      current_streak: 0,
      longest_streak: 0
    };

    const token = jwt.sign(
      { id: user.id, username: user.username, email: user.email },
      JWT_SECRET,
      { expiresIn: '7d' }
    );

    const levelDetails = calculateLevelFromTotalXP(progression.xp);

    delete user.password_hash;

    return res.json({
      success: true,
      token,
      user,
      progression: {
        ...progression,
        ...levelDetails
      }
    });
  } catch (err) {
    console.error('[Login Error]', err);
    return res.status(500).json({ success: false, error: 'Login failed due to server error.' });
  }
};

export const getMe = async (req, res) => {
  try {
    const userRes = await pool.query(
      `SELECT id, username, email, governor_title, city_name, active_theme, created_at 
       FROM users WHERE id = $1`,
      [req.user.id]
    );

    if (userRes.rows.length === 0) {
      return res.status(404).json({ success: false, error: 'Governor not found.' });
    }

    const user = userRes.rows[0];
    const progRes = await pool.query(`SELECT * FROM user_progression WHERE user_id = $1`, [user.id]);
    const progression = progRes.rows[0];
    const levelDetails = calculateLevelFromTotalXP(progression ? progression.xp : 0);

    return res.json({
      success: true,
      user,
      progression: {
        ...progression,
        ...levelDetails
      }
    });
  } catch (err) {
    console.error('[GetMe Error]', err);
    return res.status(500).json({ success: false, error: 'Failed to fetch user profile.' });
  }
};

export const updateTheme = async (req, res) => {
  const { theme } = req.body;
  if (!theme || !['theme-g', 'theme-h', 'theme-standard'].includes(theme)) {
    return res.status(400).json({ success: false, error: 'Invalid theme selected.' });
  }

  try {
    await pool.query(`UPDATE users SET active_theme = $1 WHERE id = $2`, [theme, req.user.id]);
    return res.json({ success: true, activeTheme: theme });
  } catch (err) {
    console.error('[UpdateTheme Error]', err);
    return res.status(500).json({ success: false, error: 'Failed to update active theme.' });
  }
};
