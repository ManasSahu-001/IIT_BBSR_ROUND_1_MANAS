import express from 'express';
import { generateCampaign, getCampaigns, getCampaignDetails } from '../controllers/campaignController.js';
import { authenticateToken } from '../middleware/auth.js';

const router = express.Router();

router.use(authenticateToken);

router.post('/generate', generateCampaign);
router.get('/', getCampaigns);
router.get('/:id', getCampaignDetails);

export default router;
