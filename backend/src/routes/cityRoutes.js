import express from 'express';
import { getCity, constructBuilding } from '../controllers/cityController.js';
import { authenticateToken } from '../middleware/auth.js';

const router = express.Router();

router.use(authenticateToken);

router.get('/', getCity);
router.post('/construct', constructBuilding);

export default router;
