import jwt from 'jsonwebtoken';

export const requireAuth = (req, res, next) => {
  try {
    if (String(process.env.AUTH_DISABLED || '').toLowerCase() === 'true') {
      return next();
    }
    const header = req.headers.authorization || '';
    const token = header.startsWith('Bearer ') ? header.slice(7) : null;
    if (!token) return res.status(401).json({ error: 'Unauthorized' });
    const decoded = jwt.verify(token, process.env.JWT_SECRET || 'dev-secret');
    req.user = decoded;
    return next();
  } catch (err) {
    return res.status(401).json({ error: 'Unauthorized' });
  }
};
