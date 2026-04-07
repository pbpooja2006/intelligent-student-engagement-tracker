import express from 'express';
import * as StudentCtrl from '../controllers/studentController.js';
import { requireAuth } from '../middleware/auth.js';

const router = express.Router();

router.get('/', StudentCtrl.getStudents);
router.get('/:id', StudentCtrl.getStudent);
router.post('/', requireAuth, StudentCtrl.createStudent);
router.put('/:id', requireAuth, StudentCtrl.updateStudent);
router.delete('/:id', requireAuth, StudentCtrl.deleteStudent);

export default router;
