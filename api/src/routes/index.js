import express from 'express';
import authRoutes from './auth.js';
import spacesRoutes from './spaces.js';
import vehiclesRoutes from './vehicles.js';
import statsRoutes from './stats.js';
import parkingRoutes from './parking.js';
import { authenticate } from '../middleware/auth.js';

const router = express.Router();

// Rotas públicas
router.use('/auth', authRoutes);

// Rotas protegidas (requer autenticação)
router.use('/spaces', spacesRoutes);
router.use('/vehicles', authenticate, vehiclesRoutes);
router.use('/parking', statsRoutes);
router.use('/sessions', parkingRoutes);

export default router;
