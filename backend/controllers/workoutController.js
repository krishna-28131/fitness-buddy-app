import { supabase } from '../config/supabase.js';
import { logActivity } from '../utils/activityStore.js';

let mockWorkouts = [
    { id: 1, title: 'Morning Run', date: '2026-02-27', notes: 'Felt great', user_id: 'mock-user-123', created_at: new Date().toISOString() },
    { id: 2, title: 'Upper Body Strength', date: '2026-02-26', notes: 'Increased bench press by 5kg', user_id: 'mock-user-123', created_at: new Date(Date.now() - 86400000).toISOString() },
    { id: 3, title: 'Leg Day Blast', date: '2026-02-25', notes: 'Squat PR: 100kg!', user_id: 'mock-user-456', created_at: new Date(Date.now() - 172800000).toISOString() }
];

export const getWorkouts = async (req, res) => {
    try {
        const userRole = req.user.role || req.user.user_metadata?.role || 'user';
        
        if (userRole === 'admin') {
            // Admins can view all workouts created by all users
            console.log("Admin getWorkouts: returning all workouts");
            return res.status(200).json(mockWorkouts);
        } else {
            // Users can only view their own workouts
            console.log(`User getWorkouts: returning workouts for ${req.user.id}`);
            const userWorkouts = mockWorkouts.filter(w => w.user_id === req.user.id);
            return res.status(200).json(userWorkouts);
        }
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

export const getWorkoutById = async (req, res) => {
    try {
        const { id } = req.params;
        const workout = mockWorkouts.find(w => w.id == id);
        if (!workout) return res.status(404).json({ error: 'Workout not found' });

        const userRole = req.user.role || req.user.user_metadata?.role || 'user';
        if (userRole !== 'admin' && workout.user_id !== req.user.id) {
            return res.status(403).json({ error: 'Forbidden: Access denied to this workout' });
        }

        res.status(200).json(workout);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

export const createWorkout = async (req, res) => {
    try {
        const { title, date, notes } = req.body;
        const newWorkout = {
            id: Date.now(),
            title,
            date,
            notes,
            user_id: req.user.id,
            created_at: new Date().toISOString()
        };
        mockWorkouts.unshift(newWorkout);

        // Track and store activity log
        logActivity(
            req.user.id, 
            req.user.email, 
            'TASK_CREATE', 
            `Created workout "${title}"`
        );

        res.status(201).json(newWorkout);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

export const updateWorkout = async (req, res) => {
    try {
        const { id } = req.params;
        const { title, date, notes } = req.body;
        const index = mockWorkouts.findIndex(w => w.id == id);
        if (index === -1) return res.status(404).json({ error: 'Workout not found' });

        const workout = mockWorkouts[index];
        const userRole = req.user.role || req.user.user_metadata?.role || 'user';
        if (userRole !== 'admin' && workout.user_id !== req.user.id) {
            return res.status(403).json({ error: 'Forbidden: Access denied to update this workout' });
        }

        mockWorkouts[index] = { ...workout, title, date, notes };

        // Track and store activity log
        logActivity(
            req.user.id, 
            req.user.email, 
            'TASK_UPDATE', 
            `Updated workout "${title}"`
        );

        res.status(200).json(mockWorkouts[index]);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

export const deleteWorkout = async (req, res) => {
    try {
        const { id } = req.params;
        const workout = mockWorkouts.find(w => w.id == id);
        if (!workout) return res.status(404).json({ error: 'Workout not found' });

        const userRole = req.user.role || req.user.user_metadata?.role || 'user';
        if (userRole !== 'admin' && workout.user_id !== req.user.id) {
            return res.status(403).json({ error: 'Forbidden: Access denied to delete this workout' });
        }

        mockWorkouts = mockWorkouts.filter(w => w.id != id);

        // Track and store activity log
        logActivity(
            req.user.id, 
            req.user.email, 
            'TASK_DELETE', 
            `Deleted workout "${workout.title}"`
        );

        res.status(204).send();
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};
