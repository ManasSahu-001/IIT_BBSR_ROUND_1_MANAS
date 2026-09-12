import pool from '../config/db.js';

export const SHOP_CATALOG = [
  // Themes
  { key: 'theme_upside_down', name: 'The Upside Down Theme', type: 'theme', cost: 150, description: 'Hawkins 1984 neon CRT scanlines, red thunderstorms, and floating spores.', themeId: 'theme-h' },
  { key: 'theme_haunted_world', name: 'Cursed Necropolis Theme', type: 'theme', cost: 150, description: 'Dark Victorian gothic mist, spectral green flames, and gargoyle borders.', themeId: 'theme-g' },
  
  // Profile Badges
  { key: 'badge_hellfire', name: 'Hellfire Club Master Pin', type: 'badge', cost: 100, description: 'Exclusive pin worn by the most fearless dungeon crawlers.', icon: 'flame' },
  { key: 'badge_necromancer', name: 'Grand Necromancer Sigil', type: 'badge', cost: 120, description: 'Emblem of mastery over dark deadlines and procrastination curses.', icon: 'skull' },
  { key: 'badge_flayer_slayer', name: 'Mind Flayer Slayer Medallion', type: 'badge', cost: 200, description: 'Bestowed upon governors who struck down towering bosses.', icon: 'shield' },
  { key: 'badge_architect', name: 'Master City Architect', type: 'badge', cost: 180, description: 'Symbolizing expansive urban planning and rapid construction.', icon: 'crown' }
];

export const getShop = async (req, res) => {
  const userId = req.user.id;

  try {
    const progRes = await pool.query(`SELECT gold FROM user_progression WHERE user_id = $1`, [userId]);
    const invRes = await pool.query(`SELECT * FROM inventory_items WHERE user_id = $1`, [userId]);

    const ownedKeys = new Set(invRes.rows.map(item => item.item_key));

    const catalogWithOwnership = SHOP_CATALOG.map(item => ({
      ...item,
      isOwned: ownedKeys.has(item.key),
      isEquipped: invRes.rows.some(r => r.item_key === item.key && r.is_equipped)
    }));

    return res.json({
      success: true,
      gold: progRes.rows[0]?.gold || 0,
      shop: catalogWithOwnership,
      inventory: invRes.rows
    });
  } catch (err) {
    console.error('[GetShop Error]', err);
    return res.status(500).json({ success: false, error: 'Failed to retrieve shop catalog.' });
  }
};

export const purchaseItem = async (req, res) => {
  const userId = req.user.id;
  const { itemKey } = req.body;

  const itemDef = SHOP_CATALOG.find(i => i.key === itemKey);
  if (!itemDef) {
    return res.status(404).json({ success: false, error: 'Item not found in treasury catalog.' });
  }

  const client = await pool.connect();
  try {
    await client.query('BEGIN');

    // Check if already owned
    const checkOwned = await client.query(
      `SELECT id FROM inventory_items WHERE user_id = $1 AND item_key = $2`,
      [userId, itemKey]
    );

    if (checkOwned.rows.length > 0) {
      await client.query('ROLLBACK');
      return res.status(400).json({ success: false, error: 'You already possess this treasure in your vault.' });
    }

    // Check user gold
    const progRes = await client.query(`SELECT gold FROM user_progression WHERE user_id = $1 FOR UPDATE`, [userId]);
    const currentGold = progRes.rows[0]?.gold || 0;

    if (currentGold < itemDef.cost) {
      await client.query('ROLLBACK');
      return res.status(400).json({ 
        success: false, 
        error: `Insufficient treasury gold. Required: ${itemDef.cost} Gold, Available: ${currentGold} Gold.` 
      });
    }

    // Deduct gold
    const remainingGold = currentGold - itemDef.cost;
    await client.query(`UPDATE user_progression SET gold = $1 WHERE user_id = $2`, [remainingGold, userId]);

    // Add to inventory
    const invRes = await client.query(
      `INSERT INTO inventory_items (user_id, item_key, item_name, item_type, is_equipped)
       VALUES ($1, $2, $3, $4, false)
       RETURNING *`,
      [userId, itemDef.key, itemDef.name, itemDef.type]
    );

    await client.query('COMMIT');

    return res.status(201).json({
      success: true,
      item: invRes.rows[0],
      newGold: remainingGold,
      message: `Successfully acquired ${itemDef.name}!`
    });
  } catch (err) {
    await client.query('ROLLBACK');
    console.error('[PurchaseItem Error]', err);
    return res.status(500).json({ success: false, error: 'Failed to complete treasury transaction.' });
  } finally {
    client.release();
  }
};

export const equipItem = async (req, res) => {
  const userId = req.user.id;
  const { itemKey } = req.body;

  const client = await pool.connect();
  try {
    await client.query('BEGIN');

    const invRes = await client.query(
      `SELECT * FROM inventory_items WHERE user_id = $1 AND item_key = $2`,
      [userId, itemKey]
    );

    if (invRes.rows.length === 0) {
      await client.query('ROLLBACK');
      return res.status(404).json({ success: false, error: 'Item not found in inventory.' });
    }

    const item = invRes.rows[0];

    // If equipping a theme or badge, unequip other items of that type
    await client.query(
      `UPDATE inventory_items SET is_equipped = false WHERE user_id = $1 AND item_type = $2`,
      [userId, item.item_type]
    );

    // Equip this item
    await client.query(
      `UPDATE inventory_items SET is_equipped = true WHERE id = $1`,
      [item.id]
    );

    // If theme item, update user active_theme
    const shopItem = SHOP_CATALOG.find(i => i.key === itemKey);
    if (shopItem && shopItem.themeId) {
      await client.query(`UPDATE users SET active_theme = $1 WHERE id = $2`, [shopItem.themeId, userId]);
    }

    await client.query('COMMIT');

    return res.json({
      success: true,
      equippedItem: itemKey,
      themeId: shopItem?.themeId || null,
      message: `Equipped ${item.item_name}.`
    });
  } catch (err) {
    await client.query('ROLLBACK');
    console.error('[EquipItem Error]', err);
    return res.status(500).json({ success: false, error: 'Failed to equip item.' });
  } finally {
    client.release();
  }
};
