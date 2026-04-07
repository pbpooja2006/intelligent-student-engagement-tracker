import * as Report from '../models/reportModel.js';

export const getReports = async (req, res) => {
  try {
    const reports = await Report.getReports();
    res.status(200).json({ data: reports });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to fetch reports' });
  }
};

export const getReport = async (req, res) => {
  try {
    const report = await Report.getReportById(req.params.id);
    if (!report) return res.status(404).json({ error: 'Report not found' });
    res.status(200).json({ data: report });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to fetch report' });
  }
};

export const createReport = async (req, res) => {
  try {
    const payload = req.body || {};
    if (!payload.title) return res.status(400).json({ error: 'Title is required' });
    const report = await Report.createReport(payload);
    res.status(201).json({ data: report });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to create report' });
  }
};

export const updateReport = async (req, res) => {
  try {
    const existing = await Report.getReportById(req.params.id);
    if (!existing) return res.status(404).json({ error: 'Report not found' });
    const updated = await Report.updateReport(req.params.id, req.body || {});
    res.status(200).json({ data: updated });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to update report' });
  }
};

export const deleteReport = async (req, res) => {
  try {
    const existing = await Report.getReportById(req.params.id);
    if (!existing) return res.status(404).json({ error: 'Report not found' });
    await Report.deleteReport(req.params.id);
    res.status(200).json({ data: 'Deleted' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to delete report' });
  }
};
