import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { useNavigate, Link } from 'react-router-dom';

export default function Register() {
    const { supabase } = useAuth();
    const navigate = useNavigate();
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);

    const handleRegister = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError('');
        const { error } = await supabase.auth.signUp({ email, password });
        if (error) {
            setError(error.message);
        } else {
            navigate('/dashboard');
        }
        setLoading(false);
    };

    return (
        <div className="flex min-h-screen items-center justify-center relative overflow-hidden bg-zinc-950">
            <div className="absolute inset-0 z-0">
                <div className="absolute top-0 -left-4 w-72 h-72 bg-cyan-500 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob"></div>
                <div className="absolute top-0 -right-4 w-72 h-72 bg-emerald-500 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob animation-delay-2000"></div>
                <div className="absolute -bottom-8 left-20 w-72 h-72 bg-cyan-700 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob animation-delay-4000"></div>
            </div>

            <div className="relative z-10 w-full max-w-md p-8 bg-zinc-900/80 backdrop-blur-xl border border-zinc-800 rounded-3xl shadow-2xl">
                <div className="mb-8 text-center">
                    <h1 className="text-4xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-emerald-400 tracking-tight">Join the Club</h1>
                    <p className="text-zinc-400 mt-2 text-sm font-medium">Start tracking your workouts today</p>
                </div>

                <form onSubmit={handleRegister} className="space-y-6">
                    {error && <div className="p-3 text-sm text-red-200 bg-red-900/50 border border-red-800 rounded-lg">{error}</div>}

                    <div className="space-y-2">
                        <label className="text-sm font-semibold text-zinc-300">Email Address</label>
                        <input
                            type="email"
                            required
                            className="w-full px-4 py-3 bg-zinc-950/50 border border-zinc-800 rounded-xl focus:ring-2 focus:ring-cyan-500/50 focus:border-cyan-500 text-zinc-100 transition-all font-medium placeholder:text-zinc-600 outline-none"
                            placeholder="you@example.com"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                        />
                    </div>

                    <div className="space-y-2">
                        <label className="text-sm font-semibold text-zinc-300">Password</label>
                        <input
                            type="password"
                            required
                            className="w-full px-4 py-3 bg-zinc-950/50 border border-zinc-800 rounded-xl focus:ring-2 focus:ring-cyan-500/50 focus:border-cyan-500 text-zinc-100 transition-all font-medium placeholder:text-zinc-600 outline-none"
                            placeholder="••••••••"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                        />
                    </div>

                    <button
                        type="submit"
                        disabled={loading}
                        className="w-full py-3.5 px-4 bg-gradient-to-r from-cyan-500 to-cyan-600 hover:from-cyan-400 hover:to-cyan-500 text-white rounded-xl font-bold shadow-lg shadow-cyan-500/25 transition-all active:scale-[0.98] flex items-center justify-center"
                    >
                        {loading ? 'Creating...' : 'Sign Up'}
                    </button>
                </form>

                <p className="mt-8 text-center text-zinc-400 text-sm">
                    Already have an account? <Link to="/login" className="text-cyan-400 hover:text-cyan-300 font-semibold underline-offset-4 hover:underline transition-colors">Sign in</Link>
                </p>
            </div>
        </div>
    );
}
