import express from 'express';
import {
  getAllVehicles,
  getVehicleByPlate,
  parkVehicle,
  unparkVehicle,
  getVehicleHistory
} from '../controllers/vehiclesController.js';

const router = express.Router();

router.get('/', getAllVehicles);
router.get('/history', getVehicleHistory);
router.get('/:plate', getVehicleByPlate);
router.post('/park', parkVehicle);
router.post('/:plate/unpark', unparkVehicle);

export default router;
