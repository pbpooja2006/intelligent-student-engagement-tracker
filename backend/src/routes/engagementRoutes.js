import express from 'express';
import * as EngagementCtrl from '../controllers/engagementController.js';
import { requireAuth } from '../middleware/auth.js';

const router = express.Router();

router.get('/', EngagementCtrl.getEngagements);
router.get('/:id', EngagementCtrl.getEngagement);
router.post('/', requireAuth, EngagementCtrl.createEngagement);
router.put('/:id', requireAuth, EngagementCtrl.updateEngagement);
router.delete('/:id', requireAuth, EngagementCtrl.deleteEngagement);

export default router;
