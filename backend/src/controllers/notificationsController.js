import * as Notification from '../models/notificationModel.js';

export const getNotifications = async (req, res) => {
  try {
    const notifications = await Notification.getNotifications();
    res.status(200).json({ data: notifications });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to fetch notifications' });
  }
};

export const createNotification = async (req, res) => {
  try {
    const payload = req.body || {};
    if (!payload.message) return res.status(400).json({ error: 'Message is required' });
    const notification = await Notification.createNotification(payload);
    res.status(201).json({ data: notification });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to create notification' });
  }
};

export const markRead = async (req, res) => {
  try {
    const notification = await Notification.markRead(req.params.id);
    if (!notification) return res.status(404).json({ error: 'Notification not found' });
    res.status(200).json({ data: notification });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to update notification' });
  }
};

export const markAllRead = async (req, res) => {
  try {
    await Notification.markAllRead();
    res.status(200).json({ data: 'Updated' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to update notifications' });
  }
};
