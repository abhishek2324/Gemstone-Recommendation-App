import express from 'express';
import {
  generateRecommendations,
  saveRecommendation,
  getStats,
} from '../controllers/recommendationController.js';
import { protect, adminOnly } from '../middleware/auth.js';

const router = express.Router();

router.post('/', protect, generateRecommendations);
router.post('/save', protect, saveRecommendation);
router.get('/stats', protect, adminOnly, getStats);

export default router;
