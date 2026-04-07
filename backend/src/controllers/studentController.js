import * as Student from '../models/studentModel.js';

const isValidEmail = (email) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);

export const getStudents = async (req, res) => {
  try {
    const students = await Student.getStudents(req.query || {});
    res.status(200).json({ data: students });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to fetch students' });
  }
};

export const getStudent = async (req, res) => {
  try {
    const student = await Student.getStudentById(req.params.id);
    if (!student) return res.status(404).json({ error: 'Student not found' });
    res.status(200).json({ data: student });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to fetch student' });
  }
};

export const createStudent = async (req, res) => {
  try {
    const payload = req.body || {};
    const required = ['name', 'department', 'year', 'email', 'rollNo'];
    const missing = required.filter((k) => !payload[k]);
    if (missing.length > 0) {
      return res.status(400).json({ error: `Missing required fields: ${missing.join(', ')}` });
    }
    if (!isValidEmail(payload.email)) {
      return res.status(400).json({ error: 'Invalid email format' });
    }
    const student = await Student.createStudent(payload);
    res.status(201).json({ data: student });
  } catch (err) {
    if (err && err.code === 'ER_DUP_ENTRY') {
      return res.status(409).json({ error: 'Student already exists' });
    }
    console.error(err);
    res.status(500).json({ error: 'Failed to create student' });
  }
};

export const updateStudent = async (req, res) => {
  try {
    const existing = await Student.getStudentById(req.params.id);
    if (!existing) return res.status(404).json({ error: 'Student not found' });
    const updated = await Student.updateStudent(req.params.id, req.body || {});
    res.status(200).json({ data: updated });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to update student' });
  }
};

export const deleteStudent = async (req, res) => {
  try {
    const existing = await Student.getStudentById(req.params.id);
    if (!existing) return res.status(404).json({ error: 'Student not found' });
    await Student.deleteStudent(req.params.id);
    res.status(200).json({ data: 'Deleted' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to delete student' });
  }
};
