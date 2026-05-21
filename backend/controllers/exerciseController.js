import { supabase } from '../config/supabase.js';

let mockExercises = [
    { id: 1, workout_id: 1, name: 'Treadmill', sets: 1, reps: 30, weight: 0, created_at: new Date().toISOString() },
    { id: 2, workout_id: 2, name: 'Bench Press', sets: 3, reps: 10, weight: 60, created_at: new Date(Date.now() - 86400000).toISOString() },
    { id: 3, workout_id: 2, name: 'Incline Dumbbell Press', sets: 3, reps: 12, weight: 20, created_at: new Date(Date.now() - 86000000).toISOString() }
];

export const getExercises = async (req, res) => {
    try {
        console.log("Using mock getExercises");
        const { workout_id } = req.query;
        let data = [...mockExercises];
        if (workout_id) {
            data = data.filter(e => e.workout_id == workout_id);
        }
        res.status(200).json(data);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

export const createExercise = async (req, res) => {
    try {
        console.log("Using mock createExercise");
        const { workout_id, name, sets, reps, weight } = req.body;
        const newExercise = {
            id: Date.now(),
            workout_id, name, sets, reps, weight,
            created_at: new Date().toISOString()
        };
        mockExercises.push(newExercise);
        res.status(201).json(newExercise);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

export const updateExercise = async (req, res) => {
    try {
        console.log("Using mock updateExercise");
        const { id } = req.params;
        const { name, sets, reps, weight } = req.body;
        const index = mockExercises.findIndex(e => e.id == id);
        if (index === -1) return res.status(404).json({ error: 'Exercise not found' });

        mockExercises[index] = { ...mockExercises[index], name, sets, reps, weight };
        res.status(200).json(mockExercises[index]);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

export const deleteExercise = async (req, res) => {
    try {
        console.log("Using mock deleteExercise");
        const { id } = req.params;
        mockExercises = mockExercises.filter(e => e.id != id);
        res.status(204).send();
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};
