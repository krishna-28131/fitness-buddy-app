import { supabase } from '../config/supabase.js';

export const getWorkouts = async (req, res) => {
    try {
        const { data, error } = await supabase.from('workouts').select('*').order('date', { ascending: false });
        if (error) throw error;
        res.status(200).json(data);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

export const getWorkoutById = async (req, res) => {
    try {
        const { id } = req.params;
        const { data, error } = await supabase.from('workouts').select('*').eq('id', id).single();
        if (error) throw error;
        res.status(200).json(data);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

export const createWorkout = async (req, res) => {
    try {
        const { title, date, notes, user_id } = req.body;
        const { data, error } = await supabase.from('workouts').insert([{ title, date, notes, user_id }]).select();
        if (error) throw error;
        res.status(201).json(data[0]);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

export const updateWorkout = async (req, res) => {
    try {
        const { id } = req.params;
        const { title, date, notes } = req.body;
        const { data, error } = await supabase.from('workouts').update({ title, date, notes }).eq('id', id).select();
        if (error) throw error;
        res.status(200).json(data[0]);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

export const deleteWorkout = async (req, res) => {
    try {
        const { id } = req.params;
        const { error } = await supabase.from('workouts').delete().eq('id', id);
        if (error) throw error;
        res.status(204).send();
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};
