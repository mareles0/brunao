import express from 'express';
import {
  getStatistics,
  getRecentEntries,
  findNextFreeSpace
} from '../controllers/statsController.js';
import { authenticate } from '../middleware/auth.js';

const router = express.Router();

router.get('/statistics', authenticate, getStatistics);
router.get('/recent-entries', authenticate, getRecentEntries);
router.get('/next-free-space', authenticate, findNextFreeSpace);

export default router;
