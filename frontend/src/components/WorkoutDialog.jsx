import React, { useState, useEffect } from 'react';
import { X, Loader2 } from 'lucide-react';
import api from '../services/api';
import { useAuth } from '../context/AuthContext';

export default function WorkoutDialog({ isOpen, onClose, onSuccess, workout = null }) {
    const { user } = useAuth();
    const [title, setTitle] = useState('');
    const [date, setDate] = useState('');
    const [notes, setNotes] = useState('');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    useEffect(() => {
        if (workout) {
            setTitle(workout.title);
            setDate(workout.date ? new Date(workout.date).toISOString().split('T')[0] : '');
            setNotes(workout.notes || '');
        } else {
            setTitle('');
            setDate(new Date().toISOString().split('T')[0]);
            setNotes('');
        }
    }, [workout, isOpen]);

    if (!isOpen) return null;

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError('');

        try {
            if (workout) {
                // Edit mode
                await api.put(`/workouts/${workout.id}`, { title, date, notes });
            } else {
                // Create mode
                await api.post('/workouts', { title, date, notes, user_id: user.id });
            }
            onSuccess();
        } catch (err) {
            setError(err.response?.data?.error || err.message);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-zinc-950/80 backdrop-blur-md">
            <div
                className="relative w-full max-w-lg bg-zinc-900 border border-zinc-800 rounded-3xl shadow-2xl overflow-hidden animate-in fade-in zoom-in-95 duration-200"
            >
                <button
                    onClick={onClose}
                    className="absolute top-4 right-4 p-2 text-zinc-400 hover:text-white bg-zinc-800/50 hover:bg-zinc-800 rounded-full transition-colors"
                >
                    <X className="w-5 h-5" />
                </button>

                <div className="p-8">
                    <h2 className="text-2xl font-bold text-white mb-2">
                        {workout ? 'Edit Workout' : 'Log Workout'}
                    </h2>
                    <p className="text-zinc-400 text-sm mb-6">
                        {workout ? 'Update your workout details below.' : 'Record your latest session and track your progress.'}
                    </p>

                    <form onSubmit={handleSubmit} className="space-y-5">
                        {error && <div className="p-3 text-sm text-red-200 bg-red-900/50 border border-red-800 rounded-lg">{error}</div>}

                        <div className="space-y-2">
                            <label className="text-sm font-semibold text-zinc-300">Workout Title</label>
                            <input
                                type="text"
                                required
                                className="w-full px-4 py-3 bg-zinc-950/50 border border-zinc-800 rounded-xl focus:ring-2 focus:ring-emerald-500/50 focus:border-emerald-500 text-zinc-100 transition-all font-medium placeholder:text-zinc-600 outline-none"
                                placeholder="e.g. Upper Body Power"
                                value={title}
                                onChange={(e) => setTitle(e.target.value)}
                            />
                        </div>

                        <div className="space-y-2">
                            <label className="text-sm font-semibold text-zinc-300">Date</label>
                            <input
                                type="date"
                                required
                                className="w-full px-4 py-3 bg-zinc-950/50 border border-zinc-800 rounded-xl focus:ring-2 border-emerald-500/50 focus:border-emerald-500 text-zinc-100 transition-all font-medium outline-none"
                                value={date}
                                onChange={(e) => setDate(e.target.value)}
                            />
                        </div>

                        <div className="space-y-2">
                            <label className="text-sm font-semibold text-zinc-300">Notes (Optional)</label>
                            <textarea
                                rows="3"
                                className="w-full px-4 py-3 bg-zinc-950/50 border border-zinc-800 rounded-xl focus:ring-2 focus:ring-emerald-500/50 focus:border-emerald-500 text-zinc-100 transition-all font-medium placeholder:text-zinc-600 outline-none resize-none"
                                placeholder="Felt strong today. Increased bench press by 5kg."
                                value={notes}
                                onChange={(e) => setNotes(e.target.value)}
                            />
                        </div>

                        <div className="pt-4 flex space-x-4">
                            <button
                                type="button"
                                onClick={onClose}
                                className="flex-1 py-3 px-4 bg-zinc-800 hover:bg-zinc-700 text-white rounded-xl font-bold transition-all active:scale-[0.98]"
                            >
                                Cancel
                            </button>
                            <button
                                type="submit"
                                disabled={loading}
                                className="flex-2 py-3 px-8 bg-gradient-to-r from-emerald-500 to-cyan-500 hover:from-emerald-400 hover:to-cyan-400 text-white rounded-xl font-bold shadow-lg shadow-emerald-500/25 transition-all active:scale-[0.98] flex items-center justify-center flex-grow"
                            >
                                {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : (workout ? 'Save Changes' : 'Log Workout')}
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
}
