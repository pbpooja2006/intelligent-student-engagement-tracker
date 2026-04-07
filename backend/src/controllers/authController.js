import jwt from 'jsonwebtoken';
import bcrypt from 'bcryptjs';
import { createUser, getUserAuthRow, getUserById } from '../models/userModel.js';

const signToken = (user) => {
  const payload = { userId: user.id, role: user.role };
  return jwt.sign(payload, process.env.JWT_SECRET || 'dev-secret', { expiresIn: '7d' });
};

const isValidEmail = (email) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);

export const register = async (req, res) => {
  try {
    const { name, email, password, department = '', designation = '', mentorId = '', role = 'teacher' } = req.body || {};
    if (!name || !email || !password) return res.status(400).json({ error: 'Name, email, and password are required' });
    if (!isValidEmail(email)) return res.status(400).json({ error: 'Invalid email format' });
    if (String(password).length < 6) return res.status(400).json({ error: 'Password must be at least 6 characters' });
    const existing = await getUserAuthRow(email.toLowerCase().trim());
    if (existing) return res.status(409).json({ error: 'Email already registered' });
    const passwordHash = await bcrypt.hash(password, 10);
    const user = await createUser({
      name: name.trim(),
      email: email.toLowerCase().trim(),
      passwordHash,
      role: role || 'teacher',
      department,
      designation,
      mentorId
    });
    const token = signToken(user);
    res.status(201).json({ data: { user, token } });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to register user' });
  }
};

export const login = async (req, res) => {
  try {
    const { email, password } = req.body || {};
    if (!email || !password) return res.status(400).json({ error: 'Email and password are required' });
    if (!isValidEmail(email)) return res.status(400).json({ error: 'Invalid email format' });
    const userRow = await getUserAuthRow(email.toLowerCase().trim());
    if (!userRow) return res.status(401).json({ error: 'Invalid credentials' });
    const valid = await bcrypt.compare(password, userRow.password_hash);
    if (!valid) return res.status(401).json({ error: 'Invalid credentials' });
    const user = await getUserById(userRow.id);
    const token = signToken(user);
    res.status(200).json({ data: { user, token } });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to login' });
  }
};

export const me = async (req, res) => {
  try {
    const user = await getUserById(req.user.userId);
    if (!user) return res.status(404).json({ error: 'User not found' });
    res.status(200).json({ data: user });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to fetch user' });
  }
};

export const profile = async (req, res) => {
  return me(req, res);
};
