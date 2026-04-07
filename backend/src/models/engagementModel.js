import pool from '../config/db.js';

const parseJson = (value, fallback) => {
  if (!value) return fallback;
  try {
    return typeof value === 'string' ? JSON.parse(value) : value;
  } catch {
    return fallback;
  }
};

const mapEngagement = (row) => ({
  id: String(row.id),
  student: String(row.student_id),
  attendance: parseJson(row.attendance, {}),
  participationScore: Number(row.participation_score || 0),
  assignmentScore: Number(row.assignment_score || 0),
  quizScore: Number(row.quiz_score || 0),
  recordedAt: row.recorded_at
});

export const getEngagements = async (filters = {}) => {
  const conditions = [];
  const params = [];
  if (filters.student) { conditions.push('student_id = ?'); params.push(filters.student); }
  const where = conditions.length ? `WHERE ${conditions.join(' AND ')}` : '';
  const [rows] = await pool.query(`SELECT * FROM engagements ${where} ORDER BY recorded_at DESC`, params);
  return rows.map(mapEngagement);
};

export const getEngagementById = async (id) => {
  const [rows] = await pool.query('SELECT * FROM engagements WHERE id = ?', [id]);
  if (!rows[0]) return null;
  return mapEngagement(rows[0]);
};

export const createEngagement = async (payload) => {
  const attendance = JSON.stringify(payload.attendance || {});
  const [result] = await pool.query(
    `INSERT INTO engagements (student_id, attendance, participation_score, assignment_score, quiz_score, recorded_at)
     VALUES (?, ?, ?, ?, ?, ?)`,
    [
      payload.student,
      attendance,
      payload.participationScore || 0,
      payload.assignmentScore || 0,
      payload.quizScore || 0,
      payload.recordedAt || new Date()
    ]
  );
  return getEngagementById(result.insertId);
};

export const updateEngagement = async (id, payload) => {
  const fields = [];
  const params = [];
  const mapField = (column, value) => { fields.push(`${column} = ?`); params.push(value); };

  if (payload.student !== undefined) mapField('student_id', payload.student);
  if (payload.attendance !== undefined) mapField('attendance', JSON.stringify(payload.attendance || {}));
  if (payload.participationScore !== undefined) mapField('participation_score', payload.participationScore);
  if (payload.assignmentScore !== undefined) mapField('assignment_score', payload.assignmentScore);
  if (payload.quizScore !== undefined) mapField('quiz_score', payload.quizScore);
  if (payload.recordedAt !== undefined) mapField('recorded_at', payload.recordedAt);

  if (!fields.length) return getEngagementById(id);
  params.push(id);
  await pool.query(`UPDATE engagements SET ${fields.join(', ')} WHERE id = ?`, params);
  return getEngagementById(id);
};

export const deleteEngagement = async (id) => {
  await pool.query('DELETE FROM engagements WHERE id = ?', [id]);
};
