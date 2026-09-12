import express from 'express';
import { getQuests, createQuest, updateQuest, deleteQuest, completeQuest } from '../controllers/questController.js';
import { authenticateToken } from '../middleware/auth.js';

const router = express.Router();

router.use(authenticateToken);

router.get('/', getQuests);
router.post('/', createQuest);
router.patch('/:id', updateQuest);
router.delete('/:id', deleteQuest);
router.post('/:id/complete', completeQuest);

export default router;
