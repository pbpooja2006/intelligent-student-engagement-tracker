import pool from '../config/db.js';

const parseJson = (value, fallback) => {
  if (!value) return fallback;
  try {
    return typeof value === 'string' ? JSON.parse(value) : value;
  } catch {
    return fallback;
  }
};

const mapReport = (row) => ({
  id: String(row.id),
  title: row.title,
  period: row.period,
  summary: row.summary,
  metrics: parseJson(row.metrics, {}),
  generatedBy: row.generated_by ? String(row.generated_by) : null,
  generatedAt: row.generated_at
});

export const getReports = async () => {
  const [rows] = await pool.query('SELECT * FROM reports ORDER BY generated_at DESC');
  return rows.map(mapReport);
};

export const getReportById = async (id) => {
  const [rows] = await pool.query('SELECT * FROM reports WHERE id = ?', [id]);
  if (!rows[0]) return null;
  return mapReport(rows[0]);
};

export const createReport = async (payload) => {
  const [result] = await pool.query(
    `INSERT INTO reports (title, period, summary, metrics, generated_by, generated_at)
     VALUES (?, ?, ?, ?, ?, ?)`,
    [
      payload.title,
      payload.period || '',
      payload.summary || '',
      JSON.stringify(payload.metrics || {}),
      payload.generatedBy || null,
      payload.generatedAt || new Date()
    ]
  );
  return getReportById(result.insertId);
};

export const updateReport = async (id, payload) => {
  const fields = [];
  const params = [];
  const mapField = (column, value) => { fields.push(`${column} = ?`); params.push(value); };

  if (payload.title !== undefined) mapField('title', payload.title);
  if (payload.period !== undefined) mapField('period', payload.period);
  if (payload.summary !== undefined) mapField('summary', payload.summary);
  if (payload.metrics !== undefined) mapField('metrics', JSON.stringify(payload.metrics || {}));
  if (payload.generatedBy !== undefined) mapField('generated_by', payload.generatedBy);
  if (payload.generatedAt !== undefined) mapField('generated_at', payload.generatedAt);

  if (!fields.length) return getReportById(id);
  params.push(id);
  await pool.query(`UPDATE reports SET ${fields.join(', ')} WHERE id = ?`, params);
  return getReportById(id);
};

export const deleteReport = async (id) => {
  await pool.query('DELETE FROM reports WHERE id = ?', [id]);
};
