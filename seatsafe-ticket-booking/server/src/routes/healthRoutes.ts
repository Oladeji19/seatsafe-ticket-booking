import { Router } from 'express';
import { pool } from '../db/pool.js';

const router = Router();

router.get('/', async (_req, res) => {
  const startedAt = Date.now();
  try {
    await pool.query('SELECT 1');
    res.json({ status: 'ok', database: 'reachable', latencyMs: Date.now() - startedAt });
  } catch {
    res.status(500).json({ status: 'error', database: 'unreachable' });
  }
});

export default router;
