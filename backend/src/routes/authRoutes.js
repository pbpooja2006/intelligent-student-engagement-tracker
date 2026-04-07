import express from 'express';
import * as AuthCtrl from '../controllers/authController.js';
import { requireAuth } from '../middleware/auth.js';

const router = express.Router();

router.post('/register', AuthCtrl.register);
router.post('/login', AuthCtrl.login);
router.get('/me', requireAuth, AuthCtrl.me);
router.get('/profile', requireAuth, AuthCtrl.profile);

export default router;
