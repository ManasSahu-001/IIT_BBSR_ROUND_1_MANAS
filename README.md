# Build Your City — Gamified Productivity RPG

> **Turn real-life tasks and goals into RPG quests. Completing quests earns authoritative XP, gold currency, streaks, department attributes, and city progression. Your real-life productivity builds your virtual metropolis.**

---

## 🌟 Overview & Concept

**Build Your City** is a competition-grade full-stack productivity RPG designed to obliterate procrastination. Rather than feeling like a generic todo list or corporate SaaS CRUD dashboard, Build Your City delivers a dark, atmospheric, immersive game experience powered by a persistent **PostgreSQL 18** backend and an intelligent **AI Quest Master**.

Every accomplishment in your real life—whether revising database normalization, crushing a 5k sprint, or launching a software feature—directly damages campaign bosses, expands your city borders, unlocks urban blueprints, and levels up your Governor charter.

---

## 🏰 Game Progression & Mechanics

### 1. Authoritative Non-Linear XP & Leveling
Progression becomes progressively more demanding to mirror real skill acquisition:
$$\text{requiredXP}(\text{level}) = \lfloor 100 \times \text{level}^{1.5} \rfloor$$

* **Level 1–4**: Pioneer Outpost (Small Settlement)
* **Level 5–9**: Budding Township (Village)
* **Level 10–19**: Fortified Citadel (Town)
* **Level 20–39**: Thriving Capital (City)
* **Level 40–59**: Grand Metropolis (Metropolis)
* **Level 60+**: Omni-Dominion Megacity

### 2. The AI Quest Master & Boss Battle Engine
Input any real-world ambition (e.g., *"Prepare for my DBMS semester exam in 2 weeks"*).
* The **AI Quest Master** synthesizes a structured RPG campaign.
* Generates an actionable, phased quest chain.
* Spawns a towering **Nemesis Boss** (e.g. *The Mind Flayer* or *The Eldritch Lich*).
* **Authoritative Boss Strikes**: Completing campaign quests inflicts calculated damage directly to the boss's HP in PostgreSQL, complete with floating damage numbers, particle sparks, and celebratory victory spoils!

### 3. Department Attributes & Living City Districts
* **Technology** $\to$ AV Club Radio Tower, Cyber Core, Energy Mainframe
* **Knowledge** $\to$ Public Archives, Governor Science Academy
* **Strength & Defense** $\to$ Iron Crucible Gym, Heroic Arena
* **Sanctuary of Wellness** $\to$ Botanical Gardens, Silent Monastery
* **Treasury & Commerce** $\to$ Founder's Vault & Bazaar
* **Cultural Arts** $\to$ The Palace Arcade & Cinema

---

## 🎨 Bespoke Themes (Tech Member 3)

The application features presentation layers switchable via the live Theme Engine:

### 🔴 Theme H: The Upside Down (Stranger Things 2 / Hawkins 1984)
* **Visual Language**: 1984 vintage CRT monitor scanlines, neon crimson glow (`#ff0f3f`), dark void navy/black surfaces, and Benguiat-styled typography.
* **Special FX**: Floating interdimensional red and cyan spore particles drifting across the screen via optimized canvas.
* **Quest Nodes**: Rendered as flickering multi-colored incandescent Christmas string lights.
* **Nemesis Boss**: **The Mind Flayer / Shadow Entity** with tentacle silhouettes and electric red lightning.

### 🟢 Theme G: Cursed Necropolis (Gothic Horror & Haunted World)
* **Visual Language**: Deep obsidian midnight, spectral ectoplasm green (`#10b981`), dried blood crimson, and stone gargoyle borders.
* **Special FX**: Ethereal graveyard mist and fog wisps creeping across the lower viewport.
* **Quest Nodes**: Flickering grave candles that extinguish with a smoke trail upon completion.
* **Nemesis Boss**: **The Eldritch Lich / Arch-Specter of Inertia** casting hexes from a cursed crypt.

---

## 🎧 Procedural Web Audio Engine

* **Zero Asset Weight**: Synthesizes 80s retro synth chimes, electric boss zap frequencies, and heroic victory brass fanfares dynamically using the browser's native **Web Audio API**.
* **Zero Lag**: No audio files to download over the network; instantaneous, smooth 60fps response.
* **Persistent Mute Control**: Remembers user audio preferences across sessions.

---

## 🔒 Security & Backend Authority

* **Authoritative State**: The backend computes all XP, leveling transitions, streaks, gold transactions, and boss damage. Frontend requests are strictly validated.
* **Data Isolation**: Multi-tenant isolation ensuring governors can only access and modify their own quests, campaigns, inventory, and city progression.
* **PostgreSQL Relational Persistence**: Survives hard page refreshes, logouts, reboots, and cross-device sessions.

---

## 🛠 Tech Stack

* **Frontend**: React 18, Vite, Tailwind CSS, Lucide Icons, Canvas Confetti
* **Backend**: Node.js, Express, PostgreSQL 18 (`pg` pool), Bcrypt.js, JsonWebToken, Zod
* **Persistence**: PostgreSQL relational schema with foreign key constraints, cascade triggers, and performance indexes
* **Audio**: Procedural Web Audio API Synthesizer

---

## 🚀 Quickstart & Local Installation

### Prerequisites
* Node.js (v18+)
* PostgreSQL 18 (listening on port 5432)

### 1. Database Setup
```bash
# In PostgreSQL, create the database:
CREATE DATABASE liferpg;
```

### 2. Backend Installation & Migration
```bash
cd backend
npm install
npm run migrate
npm run seed
npm start
```
The backend server will start on `http://localhost:5000`.

### 3. Frontend Installation & Launch
```bash
cd ../frontend
npm install
npm run dev
```
The frontend application will start on `http://localhost:3000`.

### 4. Demo Login Credentials
For rapid evaluation and judging:
* **Email**: `governor@liferpg.io`
* **Password**: `rpg12345`

*(Or click "Load Competition Demo Account" directly on the login modal!)*

---

## 🧪 Verification & Automated Tests

To run the automated verification suite:
```bash
cd backend
npm test
```
Verifies non-linear leveling math, procedural AI forge fallback, boss strike damage calculations, and transactional database integrity.

---

## 🌐 Public SEO & Semantic Structure
* Semantic HTML5 (`<header>`, `<nav>`, `<main>`, `<section>`, `<article>`, `<footer>`)
* Unique `<title>` and `<meta name="description">` across public pages (`/`, `/features`, `/how-it-works`, `/faq`, `/about`)
* Open Graph & Twitter Card social previews
* `sitemap.xml` & `robots.txt`
* Schema.org `SoftwareApplication` JSON-LD structured data
