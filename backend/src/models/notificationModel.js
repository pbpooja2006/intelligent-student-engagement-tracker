import pool from '../config/db.js';

const mapNotification = (row) => ({
  id: String(row.id),
  type: row.type,
  message: row.message,
  studentName: row.student_name,
  department: row.department,
  timestamp: row.timestamp,
  read: Boolean(row.is_read)
});

export const getNotifications = async () => {
  const [rows] = await pool.query('SELECT * FROM notifications ORDER BY timestamp DESC');
  return rows.map(mapNotification);
};

export const createNotification = async (payload) => {
  const [result] = await pool.query(
    `INSERT INTO notifications (type, message, student_name, department, timestamp, is_read, student_id)
     VALUES (?, ?, ?, ?, ?, ?, ?)`,
    [
      payload.type || 'info',
      payload.message,
      payload.studentName || '',
      payload.department || '',
      payload.timestamp || new Date(),
      payload.read ? 1 : 0,
      payload.student || null
    ]
  );
  const [rows] = await pool.query('SELECT * FROM notifications WHERE id = ?', [result.insertId]);
  return mapNotification(rows[0]);
};

export const markRead = async (id) => {
  await pool.query('UPDATE notifications SET is_read = 1 WHERE id = ?', [id]);
  const [rows] = await pool.query('SELECT * FROM notifications WHERE id = ?', [id]);
  return rows[0] ? mapNotification(rows[0]) : null;
};

export const markAllRead = async () => {
  await pool.query('UPDATE notifications SET is_read = 1 WHERE is_read = 0');
};
