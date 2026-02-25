import express from 'express';
import { getExercises, createExercise, updateExercise, deleteExercise } from '../controllers/exerciseController.js';

const router = express.Router();

router.get('/', getExercises);
router.post('/', createExercise);
router.put('/:id', updateExercise);
router.delete('/:id', deleteExercise);

export default router;
