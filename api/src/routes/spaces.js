import express from 'express';
import {
  getAllSpaces,
  getSpaceById,
  getFreeSpaces,
  getOccupiedSpaces
} from '../controllers/spacesController.js';

const router = express.Router();

router.get('/', getAllSpaces);
router.get('/free', getFreeSpaces);
router.get('/occupied', getOccupiedSpaces);
router.get('/:id', getSpaceById);

export default router;
