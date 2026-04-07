import express from 'express';
import * as NotificationCtrl from '../controllers/notificationsController.js';
import { requireAuth } from '../middleware/auth.js';

const router = express.Router();

router.get('/', NotificationCtrl.getNotifications);
router.post('/', requireAuth, NotificationCtrl.createNotification);
router.patch('/:id/read', requireAuth, NotificationCtrl.markRead);
router.patch('/read-all', requireAuth, NotificationCtrl.markAllRead);

export default router;
