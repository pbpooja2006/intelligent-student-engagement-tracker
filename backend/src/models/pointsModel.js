import pool from '../config/db.js';

export const getPointsByStudent = async (studentId) => {
  const [rows] = await pool.query('SELECT * FROM points WHERE student_id = ?', [studentId]);
  return rows[0];
};

export const upsertPoints = async ({ student_id, cumulative_points = 0, redeemed_points = 0 }) => {
  // compute balance
  const balance = cumulative_points - redeemed_points;
  const existing = await getPointsByStudent(student_id);
  if (existing) {
    await pool.query('UPDATE points SET cumulative_points = ?, redeemed_points = ?, balance_points = ? WHERE student_id = ?', [cumulative_points, redeemed_points, balance, student_id]);
  } else {
    await pool.query('INSERT INTO points (student_id, cumulative_points, redeemed_points, balance_points) VALUES (?, ?, ?, ?)', [student_id, cumulative_points, redeemed_points, balance]);
  }
  return { student_id, cumulative_points, redeemed_points, balance_points: balance };
};

export const getAverageBalance = async () => {
  const [[{ avg_balance }]] = await pool.query('SELECT AVG(balance_points) AS avg_balance FROM points');
  return Number(avg_balance || 0);
};
