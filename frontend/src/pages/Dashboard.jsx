import React, { useEffect, useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import api from '../services/api';
import { PlusCircle, LogOut, User, Activity, Dumbbell, CalendarDays, Loader2, Edit2, Trash2, ShieldAlert } from 'lucide-react';
import WorkoutDialog from '../components/WorkoutDialog';

export default function Dashboard() {
    const { user, supabase } = useAuth();
    const navigate = useNavigate();
    const [workouts, setWorkouts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [isDialogOpen, setIsDialogOpen] = useState(false);
    const [editingWorkout, setEditingWorkout] = useState(null);

    useEffect(() => {
        fetchWorkouts();
    }, []);

    const fetchWorkouts = async () => {
        try {
            const response = await api.get('/workouts');
            setWorkouts(response.data);
        } catch (error) {
            console.error("Error fetching workouts", error);
        } finally {
            setLoading(false);
        }
    };

    const handleLogout = async () => {
        await supabase.auth.signOut();
        navigate('/login');
    };

    const handleOpenDialog = (workout = null) => {
        setEditingWorkout(workout);
        setIsDialogOpen(true);
    };

    const handleCloseDialog = () => {
        setIsDialogOpen(false);
        setEditingWorkout(null);
    };

    const handleDialogSuccess = () => {
        handleCloseDialog();
        fetchWorkouts();
    };

    const handleDelete = async (e, id) => {
        e.stopPropagation();
        if (window.confirm('Are you sure you want to delete this workout?')) {
            try {
                await api.delete(`/workouts/${id}`);
                fetchWorkouts();
            } catch (err) {
                console.error("Failed to delete workout", err);
            }
        }
    };

    return (
        <div className="min-h-screen bg-zinc-950 text-zinc-100 selection:bg-emerald-500/30">
            {/* Navigation Bar */}
            <nav className="sticky top-0 z-50 bg-zinc-950/80 backdrop-blur-xl border-b border-zinc-800">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex items-center justify-between h-16">
                        <div className="flex items-center space-x-2">
                            <div className="w-8 h-8 rounded-lg bg-gradient-to-tr from-emerald-500 to-cyan-500 flex items-center justify-center">
                                <Dumbbell className="w-5 h-5 text-white" />
                            </div>
                            <span className="font-bold text-xl tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-emerald-400 to-cyan-400">FitnessBuddy</span>
                        </div>
                        <div className="flex items-center space-x-4">
                            {(() => {
                                const userRole = user?.role || user?.user_metadata?.role || 'user';
                                return userRole === 'admin' && (
                                    <button 
                                        onClick={() => navigate('/admin')} 
                                        className="flex items-center space-x-2 px-4 py-2 text-sm font-bold text-emerald-400 hover:text-white bg-emerald-500/10 hover:bg-emerald-500 border border-emerald-500/20 hover:border-transparent rounded-full transition-all cursor-pointer"
                                    >
                                        <ShieldAlert className="w-4 h-4" />
                                        <span>Admin Panel</span>
                                    </button>
                                );
                            })()}
                            <button onClick={() => navigate('/profile')} className="p-2 text-zinc-400 hover:text-zinc-100 hover:bg-zinc-800 rounded-full transition-colors hidden sm:block font-medium">
                                <User className="w-5 h-5" />
                            </button>
                            <button onClick={handleLogout} className="flex items-center space-x-2 px-4 py-2 text-sm font-semibold text-zinc-400 hover:text-white hover:bg-red-500/10 hover:border-red-500/50 border border-transparent rounded-full transition-all font-medium">
                                <LogOut className="w-4 h-4" />
                                <span className="hidden sm:inline">Logout</span>
                            </button>
                        </div>
                    </div>
                </div>
            </nav>

            {/* Main Content */}
            <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">

                {/* Header Section */}
                <div className="flex flex-col sm:flex-row sm:items-end justify-between mb-10 space-y-4 sm:space-y-0">
                    <div>
                        <h1 className="text-3xl font-bold tracking-tight text-white mb-2">Welcome Back.</h1>
                        <p className="text-zinc-400">Track your progress, beat your records.</p>
                    </div>
                    <button onClick={() => handleOpenDialog()} className="whitespace-nowrap flex items-center justify-center space-x-2 bg-white text-black hover:bg-zinc-200 px-5 py-2.5 rounded-full font-semibold transition-transform active:scale-95 shadow-xl shadow-white/5 cursor-pointer z-10">
                        <PlusCircle className="w-5 h-5" />
                        <span>New Workout</span>
                    </button>
                </div>

                {/* Stats Overview */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
                    <div className="bg-zinc-900 border border-zinc-800 rounded-2xl p-6 relative overflow-hidden group hover:border-emerald-500/30 transition-colors">
                        <div className="absolute top-0 right-0 p-6 opacity-20 group-hover:opacity-40 transition-opacity">
                            <Activity className="w-16 h-16 text-emerald-500" />
                        </div>
                        <p className="text-sm font-medium text-zinc-400 mb-1">Total Workouts</p>
                        <h3 className="text-4xl font-bold text-white">{workouts.length}</h3>
                    </div>
                    <div className="bg-zinc-900 border border-zinc-800 rounded-2xl p-6 relative overflow-hidden group hover:border-cyan-500/30 transition-colors">
                        <div className="absolute top-0 right-0 p-6 opacity-20 group-hover:opacity-40 transition-opacity">
                            <CalendarDays className="w-16 h-16 text-cyan-500" />
                        </div>
                        <p className="text-sm font-medium text-zinc-400 mb-1">This Week</p>
                        <h3 className="text-4xl font-bold text-white">
                            {workouts.filter(w => new Date(w.date) > new Date(Date.now() - 7 * 24 * 60 * 60 * 1000)).length}
                        </h3>
                    </div>
                </div>

                {/* Workout List */}
                <div className="space-y-6">
                    <h2 className="text-xl font-bold text-white flex items-center space-x-2">
                        <span>Recent Activity</span>
                    </h2>

                    {loading ? (
                        <div className="flex justify-center items-center py-20">
                            <Loader2 className="w-8 h-8 text-emerald-500 animate-spin" />
                        </div>
                    ) : workouts.length === 0 ? (
                        <div className="bg-zinc-900/50 border border-zinc-800/50 border-dashed rounded-3xl p-12 text-center">
                            <div className="mx-auto w-16 h-16 bg-zinc-800/50 rounded-2xl flex items-center justify-center mb-4">
                                <Dumbbell className="w-8 h-8 text-zinc-500" />
                            </div>
                            <h3 className="text-lg font-semibold text-white mb-2">No workouts yet</h3>
                            <p className="text-zinc-400 mb-6 max-w-sm mx-auto">You haven't logged any workouts. Click the "New Workout" button to get started.</p>
                        </div>
                    ) : (
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                            {workouts.map((workout) => (
                                <div key={workout.id} onClick={() => handleOpenDialog(workout)} className="bg-zinc-900 border border-zinc-800 rounded-2xl p-6 hover:bg-zinc-800/50 transition-colors cursor-pointer group relative">

                                    {/* Action Menu (Visible on Hover) */}
                                    <div className="absolute top-4 right-4 flex space-x-2 opacity-0 group-hover:opacity-100 transition-opacity">
                                        <button onClick={(e) => { e.stopPropagation(); handleOpenDialog(workout); }} className="p-1.5 bg-zinc-800 hover:bg-zinc-700 text-zinc-300 hover:text-white rounded-md transition-colors">
                                            <Edit2 className="w-4 h-4" />
                                        </button>
                                        <button onClick={(e) => handleDelete(e, workout.id)} className="p-1.5 bg-red-500/10 hover:bg-red-500 text-red-500 hover:text-white rounded-md transition-colors">
                                            <Trash2 className="w-4 h-4" />
                                        </button>
                                    </div>

                                    <div className="flex justify-between items-start mb-4 pr-16">
                                        <h3 className="font-bold text-lg text-white group-hover:text-emerald-400 transition-colors">{workout.title}</h3>
                                    </div>
                                    <span className="inline-block text-xs font-medium text-zinc-500 bg-zinc-950 px-2.5 py-1 rounded-full mb-3">{new Date(workout.date).toLocaleDateString()}</span>
                                    {workout.notes && <p className="text-sm text-zinc-400 line-clamp-2">{workout.notes}</p>}
                                </div>
                            ))}
                        </div>
                    )}
                </div>

            </main>

            <WorkoutDialog
                isOpen={isDialogOpen}
                onClose={handleCloseDialog}
                onSuccess={handleDialogSuccess}
                workout={editingWorkout}
            />
        </div>
    );
}
