import * as Points from '../models/pointsModel.js';
import * as Student from '../models/studentModel.js';

const determineCategory = (balance, avg) => {
  if (balance < 100) return 'Foundational';
  if (balance > avg) return 'Advanced';
  return 'Intermediate';
};

export const upsertPoints = async (req, res) => {
  try {
    const { student_id, cumulative_points, redeemed_points } = req.body;
    if (!student_id) return res.status(400).json({ error: 'student_id required' });
    // upsert points
    const result = await Points.upsertPoints({ student_id, cumulative_points, redeemed_points });
    // recompute category using average
    const avg = await Points.getAverageBalance();
    const category = determineCategory(result.balance_points, avg);
    await Student.updateCategoryForStudent(student_id, category);
    res.status(200).json({ data: result, category });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to upsert points' });
  }
};
