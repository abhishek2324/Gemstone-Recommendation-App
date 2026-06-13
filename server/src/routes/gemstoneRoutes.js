import express from 'express';
import {
  getAllGemstones,
  getGemstoneById,
  createGemstone,
  updateGemstone,
  deleteGemstone,
} from '../controllers/gemstoneController.js';
import { protect, adminOnly } from '../middleware/auth.js';

const router = express.Router();

router.get('/', getAllGemstones);
router.get('/:id', getGemstoneById);
router.post('/', protect, adminOnly, createGemstone);
router.put('/:id', protect, adminOnly, updateGemstone);
router.delete('/:id', protect, adminOnly, deleteGemstone);

export default router;
