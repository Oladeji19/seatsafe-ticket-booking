import bcrypt from 'bcryptjs';
import { pool } from '../db/pool.js';
import { signToken } from '../utils/jwt.js';
import type { AuthUser } from '../types/express.js';

export async function registerUser(name: string, email: string, password: string) {
  const existing = await pool.query('SELECT id FROM users WHERE email = $1', [email]);
  if (existing.rowCount) {
    throw new Error('Email already registered');
  }

  const passwordHash = await bcrypt.hash(password, 10);
  const result = await pool.query(
    `INSERT INTO users (name, email, password_hash, role)
     VALUES ($1, $2, $3, 'user')
     RETURNING id, email, role`,
    [name, email, passwordHash]
  );

  const payload: AuthUser = {
    userId: result.rows[0].id,
    email: result.rows[0].email,
    role: result.rows[0].role
  };

  return { token: signToken(payload), user: payload };
}

export async function loginUser(email: string, password: string) {
  const result = await pool.query(
    'SELECT id, email, role, password_hash FROM users WHERE email = $1',
    [email]
  );

  if (!result.rowCount) {
    throw new Error('Invalid credentials');
  }

  const user = result.rows[0];
  const passwordMatches = await bcrypt.compare(password, user.password_hash);
  if (!passwordMatches) {
    throw new Error('Invalid credentials');
  }

  const payload: AuthUser = {
    userId: user.id,
    email: user.email,
    role: user.role
  };

  return { token: signToken(payload), user: payload };
}
