import express from 'express';
import * as MentorCtrl from '../controllers/mentorController.js';

const router = express.Router();

router.get('/', MentorCtrl.getMentors);
router.get('/:id/students', MentorCtrl.getMentorStudents);

export default router;
