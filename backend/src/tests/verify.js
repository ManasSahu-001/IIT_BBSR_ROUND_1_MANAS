/**
 * Verification test suite for Life RPG Authoritative Backend
 */
import pool from '../config/db.js';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { calculateLevelFromTotalXP, QUEST_DIFFICULTY_REWARDS } from '../services/rpgEngine.js';
import { generateProceduralCampaign } from '../services/aiService.js';
import { applyBossDamage } from '../services/bossService.js';

async function runTests() {
  console.log('🧪 Starting Life RPG Backend Verification Suite...\n');
  let passed = 0;
  let total = 0;

  function assert(condition, testName) {
    total++;
    if (condition) {
      console.log(`  ✅ PASS: ${testName}`);
      passed++;
    } else {
      console.error(`  ❌ FAIL: ${testName}`);
    }
  }

  try {
    // Test 1: Leveling Formula
    console.log('--- Test Suite 1: RPG Leveling Formulas ---');
    const lvl1 = calculateLevelFromTotalXP(0);
    assert(lvl1.level === 1 && lvl1.cityTier === 'Small Settlement', 'Level 1 with 0 XP is Small Settlement');

    const lvl5 = calculateLevelFromTotalXP(2000);
    assert(lvl5.level >= 5 && lvl5.cityTier === 'Village', 'Level 5+ transitions to Village');

    // Test 2: AI Campaign Procedural Generator
    console.log('\n--- Test Suite 2: AI Quest Master Procedural Forge ---');
    const gen = generateProceduralCampaign('Prepare for DBMS semester exam');
    assert(gen.campaign && gen.campaign.title.length > 0, 'Procedural campaign title generated');
    assert(gen.boss && gen.boss.title.length > 0 && gen.boss.max_hp > 0, 'Campaign boss forged with HP');
    assert(Array.isArray(gen.quests) && gen.quests.length >= 3, 'Quest chain generated with >= 3 quests');

    // Test 3: Database Isolation & Transactions
    console.log('\n--- Test Suite 3: Database Operations & Boss Damage ---');
    const client = await pool.connect();
    try {
      await client.query('BEGIN');

      // Create test governor
      const testEmail = `test_${Date.now()}@liferpg.io`;
      const pHash = await bcrypt.hash('secretpass', 10);
      const userRes = await client.query(
        `INSERT INTO users (username, email, password_hash, active_theme) 
         VALUES ($1, $2, $3, 'theme-h') RETURNING id`,
        [`testgov_${Date.now()}`, testEmail, pHash]
      );
      const testUserId = userRes.rows[0].id;
      assert(testUserId > 0, 'Test Governor inserted with isolated user ID');

      // Create campaign and boss
      const campRes = await client.query(
        `INSERT INTO campaigns (user_id, title, real_life_goal, total_quests)
         VALUES ($1, 'Test Campaign', 'Test Goal', 3) RETURNING id`,
        [testUserId]
      );
      const campId = campRes.rows[0].id;

      const bossRes = await client.query(
        `INSERT INTO campaign_bosses (campaign_id, user_id, title, boss_type, max_hp, current_hp)
         VALUES ($1, $2, 'Test Shadow Boss', 'mind_flayer', 300, 300) RETURNING id`,
        [campId, testUserId]
      );
      assert(bossRes.rows.length > 0, 'Campaign Boss spawned with 300 HP');

      // Inflict boss damage
      const dmgResult = await applyBossDamage(client, campId, testUserId, 125);
      assert(dmgResult.currentHp === 175, 'Boss HP correctly reduced from 300 to 175 after 125 damage');
      assert(!dmgResult.isDefeated, 'Boss is still alive at 175 HP');

      // Defeat boss
      const defeatResult = await applyBossDamage(client, campId, testUserId, 200);
      assert(defeatResult.currentHp === 0, 'Boss HP reduced to 0');
      assert(defeatResult.isDefeated === true, 'Boss marked as defeated');
      assert(defeatResult.bonusGold > 0, 'Victory bonus gold awarded upon boss defeat');

      await client.query('ROLLBACK'); // Clean rollback for test
      console.log('  🧹 Test transaction successfully rolled back.');
    } finally {
      client.release();
    }

    console.log(`\n========================================`);
    console.log(`Results: ${passed} / ${total} tests passed.`);
    console.log(`========================================\n`);

    if (passed === total) {
      console.log('🎉 ALL BACKEND CHECKS VERIFIED SUCCESSFULLY!');
      process.exit(0);
    } else {
      process.exit(1);
    }
  } catch (err) {
    console.error('Test execution crashed:', err);
    process.exit(1);
  }
}

runTests();
