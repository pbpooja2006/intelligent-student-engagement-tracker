import pool from '../config/db.js';

export const getAllMentors = async () => {
  const [rows] = await pool.query('SELECT * FROM mentors ORDER BY id');
  return rows;
};

export const getMentorById = async (id) => {
  const [rows] = await pool.query('SELECT * FROM mentors WHERE id = ?', [id]);
  return rows[0];
};
