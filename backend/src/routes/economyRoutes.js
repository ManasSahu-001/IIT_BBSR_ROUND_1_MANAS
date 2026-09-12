import express from 'express';
import { getShop, purchaseItem, equipItem } from '../controllers/economyController.js';
import { authenticateToken } from '../middleware/auth.js';

const router = express.Router();

router.use(authenticateToken);

router.get('/shop', getShop);
router.post('/purchase', purchaseItem);
router.post('/equip', equipItem);

export default router;
