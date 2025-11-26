import express from 'express';
import * as parkingController from '../controllers/parkingController.js';
import { authenticate, requireAdmin } from '../middleware/auth.js';

const router = express.Router();

// Rotas do usuário
router.post('/park', authenticate, parkingController.parkVehicle);
router.post('/unpark/:plate', authenticate, parkingController.unparkVehicle);
router.get('/my-sessions', authenticate, parkingController.getUserActiveSessions);
router.get('/my-history', authenticate, parkingController.getUserHistory);

// Rotas admin
router.get('/all-sessions', authenticate, requireAdmin, parkingController.getAllActiveSessions);
router.get('/all-history', authenticate, requireAdmin, parkingController.getAllHistory);

export default router;
