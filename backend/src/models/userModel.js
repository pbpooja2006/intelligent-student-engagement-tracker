import pool from '../config/db.js';

const mapUser = (row) => ({
  id: String(row.id),
  name: row.name,
  email: row.email,
  role: row.role,
  department: row.department,
  designation: row.designation,
  mentorId: row.mentor_id
});

export const getUserByEmail = async (email) => {
  const [rows] = await pool.query('SELECT * FROM users WHERE email = ?', [email]);
  return rows[0] || null;
};

export const getUserById = async (id) => {
  const [rows] = await pool.query('SELECT * FROM users WHERE id = ?', [id]);
  return rows[0] ? mapUser(rows[0]) : null;
};

export const createUser = async (payload) => {
  const [result] = await pool.query(
    `INSERT INTO users (name, email, password_hash, role, department, designation, mentor_id)
     VALUES (?, ?, ?, ?, ?, ?, ?)`,
    [
      payload.name,
      payload.email,
      payload.passwordHash,
      payload.role || 'teacher',
      payload.department || '',
      payload.designation || '',
      payload.mentorId || ''
    ]
  );
  return getUserById(result.insertId);
};

export const getUserAuthRow = async (email) => {
  const [rows] = await pool.query('SELECT * FROM users WHERE email = ?', [email]);
  return rows[0] || null;
};
