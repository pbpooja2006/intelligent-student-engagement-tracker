import express from 'express';
import * as NotifyCtrl from '../controllers/notificationsController.js';

const router = express.Router();

router.get('/', NotifyCtrl.getNotifications);

export default router;
