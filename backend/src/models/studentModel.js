import pool from '../config/db.js';

const parseJson = (value, fallback) => {
  if (!value) return fallback;
  try {
    return typeof value === 'string' ? JSON.parse(value) : value;
  } catch {
    return fallback;
  }
};

const stringifyJson = (value, fallback) => {
  if (value === undefined) return JSON.stringify(fallback);
  return JSON.stringify(value);
};

const mapStudent = (row) => ({
  id: String(row.id),
  name: row.name,
  department: row.department,
  year: row.year,
  classification: row.classification,
  mentor: row.mentor,
  warden: row.warden,
  residenceType: row.residence_type,
  attendance: {
    percentage: Number(row.attendance_percentage || 0),
    presentDays: Number(row.attendance_present_days || 0),
    totalDays: Number(row.attendance_total_days || 0),
    leaveCount: Number(row.attendance_leave_count || 0)
  },
  academics: {
    semesters: parseJson(row.academics_semesters, []),
    cgpa: Number(row.academics_cgpa || 0)
  },
  platforms: parseJson(row.platforms, {}),
  skills: parseJson(row.skills, []),
  trainings: parseJson(row.trainings, []),
  skillsToLearn: parseJson(row.skills_to_learn, []),
  rewardPoints: Number(row.reward_points || 0),
  activityPoints: Number(row.activity_points || 0),
  engagementLevel: row.engagement_level,
  email: row.email,
  phone: row.phone,
  rollNo: row.roll_no
});

export const getStudents = async (filters = {}) => {
  const conditions = [];
  const params = [];
  if (filters.department) { conditions.push('department = ?'); params.push(filters.department); }
  if (filters.year) { conditions.push('year = ?'); params.push(filters.year); }
  if (filters.classification && filters.classification !== 'all') { conditions.push('classification = ?'); params.push(filters.classification); }
  if (filters.mentor) { conditions.push('mentor = ?'); params.push(filters.mentor); }
  if (filters.search) {
    conditions.push('(name LIKE ? OR roll_no LIKE ?)');
    const term = `%${filters.search}%`;
    params.push(term, term);
  }
  const where = conditions.length ? `WHERE ${conditions.join(' AND ')}` : '';
  const [rows] = await pool.query(`SELECT * FROM students ${where} ORDER BY created_at DESC`, params);
  return rows.map(mapStudent);
};

export const getStudentById = async (id) => {
  const [rows] = await pool.query('SELECT * FROM students WHERE id = ?', [id]);
  if (!rows[0]) return null;
  return mapStudent(rows[0]);
};

export const createStudent = async (payload) => {
  const data = {
    name: payload.name,
    department: payload.department,
    year: payload.year,
    classification: payload.classification || 'intermediate',
    mentor: payload.mentor || '',
    warden: payload.warden || '',
    residence_type: payload.residenceType || 'Hosteller',
    attendance_percentage: payload.attendance?.percentage || 0,
    attendance_present_days: payload.attendance?.presentDays || 0,
    attendance_total_days: payload.attendance?.totalDays || 0,
    attendance_leave_count: payload.attendance?.leaveCount || 0,
    academics_semesters: stringifyJson(payload.academics?.semesters || [], []),
    academics_cgpa: payload.academics?.cgpa || 0,
    platforms: stringifyJson(payload.platforms || {}, {}),
    skills: stringifyJson(payload.skills || [], []),
    trainings: stringifyJson(payload.trainings || [], []),
    skills_to_learn: stringifyJson(payload.skillsToLearn || [], []),
    reward_points: payload.rewardPoints ?? 0,
    activity_points: payload.activityPoints ?? 0,
    engagement_level: payload.engagementLevel || 'Medium',
    email: payload.email,
    phone: payload.phone || '',
    roll_no: payload.rollNo
  };

  const [result] = await pool.query(
    `INSERT INTO students
      (name, department, year, classification, mentor, warden, residence_type,
       attendance_percentage, attendance_present_days, attendance_total_days, attendance_leave_count,
       academics_semesters, academics_cgpa, platforms, skills, trainings, skills_to_learn,
       reward_points, activity_points, engagement_level, email, phone, roll_no)
     VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
    [
      data.name, data.department, data.year, data.classification, data.mentor, data.warden, data.residence_type,
      data.attendance_percentage, data.attendance_present_days, data.attendance_total_days, data.attendance_leave_count,
      data.academics_semesters, data.academics_cgpa, data.platforms, data.skills, data.trainings, data.skills_to_learn,
      data.reward_points, data.activity_points, data.engagement_level, data.email, data.phone, data.roll_no
    ]
  );

  return getStudentById(result.insertId);
};

export const updateStudent = async (id, payload) => {
  const fields = [];
  const params = [];
  const mapField = (column, value) => {
    fields.push(`${column} = ?`);
    params.push(value);
  };

  if (payload.name !== undefined) mapField('name', payload.name);
  if (payload.department !== undefined) mapField('department', payload.department);
  if (payload.year !== undefined) mapField('year', payload.year);
  if (payload.classification !== undefined) mapField('classification', payload.classification);
  if (payload.mentor !== undefined) mapField('mentor', payload.mentor);
  if (payload.warden !== undefined) mapField('warden', payload.warden);
  if (payload.residenceType !== undefined) mapField('residence_type', payload.residenceType);

  if (payload.attendance !== undefined) {
    mapField('attendance_percentage', payload.attendance?.percentage || 0);
    mapField('attendance_present_days', payload.attendance?.presentDays || 0);
    mapField('attendance_total_days', payload.attendance?.totalDays || 0);
    mapField('attendance_leave_count', payload.attendance?.leaveCount || 0);
  }

  if (payload.academics !== undefined) {
    mapField('academics_semesters', stringifyJson(payload.academics?.semesters || [], []));
    mapField('academics_cgpa', payload.academics?.cgpa || 0);
  }

  if (payload.platforms !== undefined) mapField('platforms', stringifyJson(payload.platforms || {}, {}));
  if (payload.skills !== undefined) mapField('skills', stringifyJson(payload.skills || [], []));
  if (payload.trainings !== undefined) mapField('trainings', stringifyJson(payload.trainings || [], []));
  if (payload.skillsToLearn !== undefined) mapField('skills_to_learn', stringifyJson(payload.skillsToLearn || [], []));
  if (payload.rewardPoints !== undefined) mapField('reward_points', payload.rewardPoints);
  if (payload.activityPoints !== undefined) mapField('activity_points', payload.activityPoints);
  if (payload.engagementLevel !== undefined) mapField('engagement_level', payload.engagementLevel);
  if (payload.email !== undefined) mapField('email', payload.email);
  if (payload.phone !== undefined) mapField('phone', payload.phone);
  if (payload.rollNo !== undefined) mapField('roll_no', payload.rollNo);

  if (!fields.length) return getStudentById(id);
  params.push(id);
  await pool.query(`UPDATE students SET ${fields.join(', ')} WHERE id = ?`, params);
  return getStudentById(id);
};

export const deleteStudent = async (id) => {
  await pool.query('DELETE FROM engagements WHERE student_id = ?', [id]);
  await pool.query('DELETE FROM notifications WHERE student_id = ?', [id]);
  await pool.query('DELETE FROM students WHERE id = ?', [id]);
};
