import { z } from 'zod';
import { QUEST_DIFFICULTY_REWARDS } from './rpgEngine.js';

// Strict Zod schema for AI Quest Master output
const GeneratedQuestSchema = z.object({
  title: z.string().min(3).max(120),
  description: z.string().min(5).max(300),
  category: z.enum(['coding', 'study', 'fitness', 'wellness', 'finance', 'creative', 'social']),
  difficulty: z.enum(['easy', 'medium', 'hard', 'epic']),
  attribute_type: z.enum(['tech', 'knowledge', 'strength', 'wellness', 'economy', 'culture', 'community'])
});

const GeneratedCampaignSchema = z.object({
  campaign: z.object({
    title: z.string().min(3).max(100),
    description: z.string().min(10).max(400)
  }),
  boss: z.object({
    title: z.string().min(3).max(80),
    boss_type: z.enum(['mind_flayer', 'demogorgon', 'eldritch_lich', 'gargoyle_king', 'shadow_beast']),
    description: z.string().min(10).max(300),
    max_hp: z.number().int().min(200).max(1500)
  }),
  quests: z.array(GeneratedQuestSchema).min(3).max(6)
});

/**
 * Procedural Quest Forge: Generates deterministic, high-flavor RPG campaigns
 * when AI API is unavailable, unconfigured, or times out.
 */
export const generateProceduralCampaign = (goal) => {
  const cleanGoal = goal.trim();
  const lowerGoal = cleanGoal.toLowerCase();

  let category = 'study';
  let attributeType = 'knowledge';
  let bossType = 'mind_flayer';
  let bossTitle = 'The Shadow Procrastinator';
  let campaignTitle = `Operation: ${cleanGoal.slice(0, 40)}`;

  if (lowerGoal.includes('code') || lowerGoal.includes('dev') || lowerGoal.includes('program') || lowerGoal.includes('app') || lowerGoal.includes('bug') || lowerGoal.includes('sql') || lowerGoal.includes('dbms')) {
    category = 'coding';
    attributeType = 'tech';
    bossType = 'mind_flayer';
    bossTitle = 'The Null Pointer Leviathan';
    campaignTitle = `Conquer the Code Citadel: ${cleanGoal.slice(0, 35)}`;
  } else if (lowerGoal.includes('gym') || lowerGoal.includes('run') || lowerGoal.includes('workout') || lowerGoal.includes('diet') || lowerGoal.includes('health') || lowerGoal.includes('fitness')) {
    category = 'fitness';
    attributeType = 'strength';
    bossType = 'demogorgon';
    bossTitle = 'The Demogorgon of Lethargy';
    campaignTitle = `Trials of the Iron Crucible: ${cleanGoal.slice(0, 35)}`;
  } else if (lowerGoal.includes('money') || lowerGoal.includes('finance') || lowerGoal.includes('budget') || lowerGoal.includes('invest') || lowerGoal.includes('save')) {
    category = 'finance';
    attributeType = 'economy';
    bossType = 'gargoyle_king';
    bossTitle = 'The Usurer Gargoyle';
    campaignTitle = `Reclaiming the Treasury: ${cleanGoal.slice(0, 35)}`;
  } else if (lowerGoal.includes('write') || lowerGoal.includes('art') || lowerGoal.includes('design') || lowerGoal.includes('draw') || lowerGoal.includes('music')) {
    category = 'creative';
    attributeType = 'culture';
    bossType = 'eldritch_lich';
    bossTitle = 'The Creative Block Lich';
    campaignTitle = `Awakening the Muse: ${cleanGoal.slice(0, 35)}`;
  } else if (lowerGoal.includes('meditate') || lowerGoal.includes('sleep') || lowerGoal.includes('mental') || lowerGoal.includes('relax') || lowerGoal.includes('stress')) {
    category = 'wellness';
    attributeType = 'wellness';
    bossType = 'shadow_beast';
    bossTitle = 'The Nightmare Specter';
    campaignTitle = `Sanctuary of the Mind: ${cleanGoal.slice(0, 35)}`;
  } else {
    // General / Study
    category = 'study';
    attributeType = 'knowledge';
    bossType = 'eldritch_lich';
    bossTitle = 'The Arch-Specter of Inertia';
    campaignTitle = `The Grand Scholarly Quest: ${cleanGoal.slice(0, 35)}`;
  }

  const rawCampaign = {
    campaign: {
      title: campaignTitle,
      description: `A disciplined campaign forged to achieve "${cleanGoal}" and expand your city's dominion.`
    },
    boss: {
      title: bossTitle,
      boss_type: bossType,
      description: `A formidable manifestation of distraction standing between the Governor and "${cleanGoal}". Each completed quest delivers a crushing strike to its vitality.`,
      max_hp: 450
    },
    quests: [
      {
        title: `Phase 1: Foundation & Reconnaissance`,
        description: `Dedicate 25 minutes of deep focus to outline resources and establish milestones for: ${cleanGoal}.`,
        category: category,
        difficulty: 'easy',
        attribute_type: attributeType
      },
      {
        title: `Phase 2: Deep Work Incursion`,
        description: `Execute a 50-minute focused sprint solving core challenges of: ${cleanGoal}.`,
        category: category,
        difficulty: 'medium',
        attribute_type: attributeType
      },
      {
        title: `Phase 3: Tactical Execution & Review`,
        description: `Tackle the most demanding component of: ${cleanGoal} with zero distractions.`,
        category: category,
        difficulty: 'hard',
        attribute_type: attributeType
      },
      {
        title: `Phase 4: Recovery & Physical Defense`,
        description: `Engage in 20 minutes of physical conditioning or mental reset to recharge focus.`,
        category: 'fitness',
        difficulty: 'easy',
        attribute_type: 'strength'
      }
    ]
  };

  return rawCampaign;
};

/**
 * Main AI Quest Master Generator
 * Queries LLM if API key configured, otherwise smoothly falls back to procedural forge.
 */
export const generateAIQuestCampaign = async (goal) => {
  const apiKey = process.env.GEMINI_API_KEY;

  if (!apiKey) {
    console.log('[AI Quest Master] No API key detected. Using procedural RPG forge.');
    return generateProceduralCampaign(goal);
  }

  const prompt = `You are the AI Quest Master for "Build Your City", an epic productivity RPG.
A user has set this real-life goal: "${goal}"

You must design an RPG campaign with 3 to 5 realistic quests and a formidable Boss.
The themes can lean into 80s Hawkins / Stranger Things ("The Upside Down") or Gothic Necropolis ("Horror").
Rules:
- Quests must represent realistic, actionable sub-tasks directly helping them achieve the goal.
- categories allowed: 'coding', 'study', 'fitness', 'wellness', 'finance', 'creative', 'social'
- difficulties allowed: 'easy', 'medium', 'hard', 'epic'
- attribute_type allowed: 'tech', 'knowledge', 'strength', 'wellness', 'economy', 'culture', 'community'
- boss_type allowed: 'mind_flayer', 'demogorgon', 'eldritch_lich', 'gargoyle_king', 'shadow_beast'
- boss max_hp should be between 300 and 600.

Return ONLY a JSON object strictly matching this schema:
{
  "campaign": {
    "title": "string (max 80 chars)",
    "description": "string (max 300 chars)"
  },
  "boss": {
    "title": "string (max 80 chars)",
    "boss_type": "mind_flayer | demogorgon | eldritch_lich | gargoyle_king | shadow_beast",
    "description": "string (max 250 chars)",
    "max_hp": 450
  },
  "quests": [
    {
      "title": "string (actionable quest title)",
      "description": "string (clear real-life action description)",
      "category": "coding | study | fitness | wellness | finance | creative | social",
      "difficulty": "easy | medium | hard | epic",
      "attribute_type": "tech | knowledge | strength | wellness | economy | culture | community"
    }
  ]
}`;

  try {
    const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${apiKey}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        contents: [{ parts: [{ text: prompt }] }],
        generationConfig: {
          response_mime_type: 'application/json',
          temperature: 0.7
        }
      })
    });

    if (!response.ok) {
      console.warn(`[AI Quest Master] LLM API responded with ${response.status}. Using procedural forge fallback.`);
      return generateProceduralCampaign(goal);
    }

    const data = await response.json();
    const candidateText = data.candidates?.[0]?.content?.parts?.[0]?.text;
    if (!candidateText) {
      return generateProceduralCampaign(goal);
    }

    const parsed = JSON.parse(candidateText);
    const validated = GeneratedCampaignSchema.safeParse(parsed);

    if (!validated.success) {
      console.warn('[AI Quest Master] Validation failed on LLM output. Using procedural forge fallback.', validated.error.issues);
      return generateProceduralCampaign(goal);
    }

    return validated.data;
  } catch (err) {
    console.warn('[AI Quest Master] Request error occurred. Using procedural forge fallback.', err.message);
    return generateProceduralCampaign(goal);
  }
};
