import * as Engagement from '../models/engagementModel.js';

export const getEngagements = async (req, res) => {
  try {
    const engagements = await Engagement.getEngagements(req.query || {});
    res.status(200).json({ data: engagements });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to fetch engagement data' });
  }
};

export const getEngagement = async (req, res) => {
  try {
    const engagement = await Engagement.getEngagementById(req.params.id);
    if (!engagement) return res.status(404).json({ error: 'Engagement not found' });
    res.status(200).json({ data: engagement });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to fetch engagement data' });
  }
};

export const createEngagement = async (req, res) => {
  try {
    const payload = req.body || {};
    if (!payload.student) return res.status(400).json({ error: 'Student is required' });
    const engagement = await Engagement.createEngagement(payload);
    res.status(201).json({ data: engagement });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to create engagement data' });
  }
};

export const updateEngagement = async (req, res) => {
  try {
    const engagement = await Engagement.getEngagementById(req.params.id);
    if (!engagement) return res.status(404).json({ error: 'Engagement not found' });
    const updated = await Engagement.updateEngagement(req.params.id, req.body || {});
    res.status(200).json({ data: updated });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to update engagement data' });
  }
};

export const deleteEngagement = async (req, res) => {
  try {
    const engagement = await Engagement.getEngagementById(req.params.id);
    if (!engagement) return res.status(404).json({ error: 'Engagement not found' });
    await Engagement.deleteEngagement(req.params.id);
    res.status(200).json({ data: 'Deleted' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to delete engagement data' });
  }
};
