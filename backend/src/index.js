import dotenv from 'dotenv';
dotenv.config();
import app from './app.js';
import pool from './config/db.js';

const PORT = process.env.PORT || 4000;

const start = async () => {
  try {
    const conn = await pool.getConnection();
    await conn.ping();
    conn.release();
    console.log('Connected to MySQL');
    app.listen(PORT, () => console.log(`Server listening on ${PORT}`));
  } catch (err) {
    console.error('Failed to start server:', err);
    process.exit(1);
  }
};

start();
