import express from 'express';
import * as ReportCtrl from '../controllers/reportController.js';
import { requireAuth } from '../middleware/auth.js';

const router = express.Router();

router.get('/', ReportCtrl.getReports);
router.get('/:id', ReportCtrl.getReport);
router.post('/', requireAuth, ReportCtrl.createReport);
router.put('/:id', requireAuth, ReportCtrl.updateReport);
router.delete('/:id', requireAuth, ReportCtrl.deleteReport);

export default router;
