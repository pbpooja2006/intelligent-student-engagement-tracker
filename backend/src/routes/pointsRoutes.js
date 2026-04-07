import express from 'express';
import * as PointsCtrl from '../controllers/pointsController.js';

const router = express.Router();

router.post('/', PointsCtrl.upsertPoints);

export default router;
