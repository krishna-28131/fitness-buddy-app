import { supabase } from '../config/supabase.js';

export const getExercises = async (req, res) => {
    try {
        const { workout_id } = req.query;
        let query = supabase.from('exercises').select('*');
        if (workout_id) {
            query = query.eq('workout_id', workout_id);
        }
        const { data, error } = await query.order('created_at', { ascending: true });
        if (error) throw error;
        res.status(200).json(data);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

export const createExercise = async (req, res) => {
    try {
        const { workout_id, name, sets, reps, weight } = req.body;
        const { data, error } = await supabase.from('exercises').insert([{ workout_id, name, sets, reps, weight }]).select();
        if (error) throw error;
        res.status(201).json(data[0]);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

export const updateExercise = async (req, res) => {
    try {
        const { id } = req.params;
        const { name, sets, reps, weight } = req.body;
        const { data, error } = await supabase.from('exercises').update({ name, sets, reps, weight }).eq('id', id).select();
        if (error) throw error;
        res.status(200).json(data[0]);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

export const deleteExercise = async (req, res) => {
    try {
        const { id } = req.params;
        const { error } = await supabase.from('exercises').delete().eq('id', id);
        if (error) throw error;
        res.status(204).send();
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};
