import * as Mentor from '../models/mentorModel.js';
import * as Student from '../models/studentModel.js';

export const getMentors = async (req, res) => {
  try {
    const rows = await Mentor.getAllMentors();
    res.status(200).json({ data: rows });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to fetch mentors' });
  }
};

export const getMentorStudents = async (req, res) => {
  try {
    const mentorId = req.params.id;
    const mentor = await Mentor.getMentorById(mentorId);
    if (!mentor) return res.status(404).json({ error: 'Mentor not found' });
    const students = await Student.getStudentsByMentor(mentorId);
    res.status(200).json({ data: { mentor, students } });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to fetch mentor students' });
  }
};
