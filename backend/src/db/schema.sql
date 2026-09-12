-- Build Your City: Life RPG Database Schema (PostgreSQL)

DROP TABLE IF EXISTS achievements CASCADE;
DROP TABLE IF EXISTS inventory_items CASCADE;
DROP TABLE IF EXISTS user_buildings CASCADE;
DROP TABLE IF EXISTS quests CASCADE;
DROP TABLE IF EXISTS campaign_bosses CASCADE;
DROP TABLE IF EXISTS campaigns CASCADE;
DROP TABLE IF EXISTS user_progression CASCADE;
DROP TABLE IF EXISTS users CASCADE;

-- 1. Users Table (Governor Profile & Auth)
CREATE TABLE users (
    id SERIAL PRIMARY KEY,
    username VARCHAR(50) UNIQUE NOT NULL,
    email VARCHAR(100) UNIQUE NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    governor_title VARCHAR(100) DEFAULT 'Novice Founder',
    city_name VARCHAR(100) DEFAULT 'Neo Haven',
    active_theme VARCHAR(50) DEFAULT 'theme-h', -- 'theme-h' (Stranger Things 2) or 'theme-g' (Haunted World)
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- 2. User RPG Progression & Department Attributes
CREATE TABLE user_progression (
    user_id INT PRIMARY KEY REFERENCES users(id) ON DELETE CASCADE,
    xp BIGINT DEFAULT 0,
    level INT DEFAULT 1,
    gold INT DEFAULT 150,
    current_streak INT DEFAULT 0,
    longest_streak INT DEFAULT 0,
    last_quest_completed_at DATE,
    population INT DEFAULT 120,
    tech_xp INT DEFAULT 0,
    knowledge_xp INT DEFAULT 0,
    strength_xp INT DEFAULT 0,
    wellness_xp INT DEFAULT 0,
    economy_xp INT DEFAULT 0,
    culture_xp INT DEFAULT 0,
    community_xp INT DEFAULT 0,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- 3. Campaigns (AI-Forged or Custom Goal Chains)
CREATE TABLE campaigns (
    id SERIAL PRIMARY KEY,
    user_id INT REFERENCES users(id) ON DELETE CASCADE,
    title VARCHAR(150) NOT NULL,
    description TEXT,
    real_life_goal TEXT NOT NULL,
    status VARCHAR(30) DEFAULT 'active', -- 'active', 'completed', 'abandoned'
    total_quests INT DEFAULT 0,
    completed_quests INT DEFAULT 0,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- 4. Campaign Bosses
CREATE TABLE campaign_bosses (
    id SERIAL PRIMARY KEY,
    campaign_id INT UNIQUE REFERENCES campaigns(id) ON DELETE CASCADE,
    user_id INT REFERENCES users(id) ON DELETE CASCADE,
    title VARCHAR(150) NOT NULL,
    boss_type VARCHAR(50) NOT NULL, -- 'mind_flayer', 'demogorgon', 'eldritch_lich', 'gargoyle_king', 'shadow_beast'
    description TEXT,
    max_hp INT NOT NULL DEFAULT 500,
    current_hp INT NOT NULL DEFAULT 500,
    is_defeated BOOLEAN DEFAULT FALSE,
    reward_gold INT DEFAULT 200,
    reward_xp INT DEFAULT 450,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- 5. Quests (Individual Tasks / Quests)
CREATE TABLE quests (
    id SERIAL PRIMARY KEY,
    user_id INT REFERENCES users(id) ON DELETE CASCADE,
    campaign_id INT REFERENCES campaigns(id) ON DELETE SET NULL,
    title VARCHAR(200) NOT NULL,
    description TEXT,
    category VARCHAR(50) NOT NULL, -- 'coding', 'study', 'fitness', 'wellness', 'finance', 'creative', 'social'
    difficulty VARCHAR(30) NOT NULL, -- 'easy', 'medium', 'hard', 'epic'
    xp_reward INT NOT NULL,
    gold_reward INT NOT NULL,
    attribute_type VARCHAR(50) NOT NULL,
    attribute_gain INT NOT NULL,
    boss_damage INT DEFAULT 50,
    is_completed BOOLEAN DEFAULT FALSE,
    completed_at TIMESTAMP WITH TIME ZONE,
    due_date DATE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- 6. City Districts & Buildings
CREATE TABLE user_buildings (
    id SERIAL PRIMARY KEY,
    user_id INT REFERENCES users(id) ON DELETE CASCADE,
    district VARCHAR(50) NOT NULL, -- 'technology', 'knowledge', 'strength', 'wellness', 'economy', 'culture', 'community'
    building_key VARCHAR(100) NOT NULL,
    name VARCHAR(100) NOT NULL,
    tier INT DEFAULT 1,
    unlocked_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- 7. City Treasury & Inventory
CREATE TABLE inventory_items (
    id SERIAL PRIMARY KEY,
    user_id INT REFERENCES users(id) ON DELETE CASCADE,
    item_key VARCHAR(100) NOT NULL,
    item_name VARCHAR(100) NOT NULL,
    item_type VARCHAR(50) NOT NULL, -- 'building', 'theme', 'badge', 'artifact'
    is_equipped BOOLEAN DEFAULT FALSE,
    purchased_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- 8. Landmarks & Achievements
CREATE TABLE achievements (
    id SERIAL PRIMARY KEY,
    user_id INT REFERENCES users(id) ON DELETE CASCADE,
    achievement_key VARCHAR(100) NOT NULL,
    title VARCHAR(100) NOT NULL,
    description TEXT,
    icon VARCHAR(50) DEFAULT 'trophy',
    unlocked_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT unique_user_achievement UNIQUE (user_id, achievement_key)
);

-- Indexes for lightning fast queries and isolation
CREATE INDEX idx_quests_user ON quests(user_id);
CREATE INDEX idx_quests_completed ON quests(user_id, is_completed);
CREATE INDEX idx_campaigns_user ON campaigns(user_id);
CREATE INDEX idx_bosses_campaign ON campaign_bosses(campaign_id);
CREATE INDEX idx_buildings_user ON user_buildings(user_id);
CREATE INDEX idx_inventory_user ON inventory_items(user_id);
