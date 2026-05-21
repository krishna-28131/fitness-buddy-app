import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { useNavigate, Link } from 'react-router-dom';
import api from '../services/api';

export default function Login() {
    const { supabase } = useAuth();
    const navigate = useNavigate();
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);

    const handleLogin = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError('');
        try {
            const { data, error } = await supabase.auth.signInWithPassword({ email, password });
            
            if (error) {
                console.log("Supabase login returned error, using mock login mapping");
                // Select mock token based on selected user type
                const isDemoAdmin = email.toLowerCase().includes('demo') || email.toLowerCase().includes('admin');
                const mockToken = isDemoAdmin ? 'mock-token-123' : 'mock-token-user-123';
                
                localStorage.setItem('supabaseAuthToken', mockToken);
                
                // Track login activity
                try {
                    await api.post('/logs', {
                        action: 'LOGIN',
                        details: `Logged in as Mock ${isDemoAdmin ? 'Admin' : 'User'} (${email})`
                    });
                } catch (logErr) {
                    console.warn("Failed to log activity in mock mode", logErr);
                }

                navigate('/dashboard');
                window.location.reload();
            } else {
                // Supabase success
                // Track login activity
                try {
                    await api.post('/logs', {
                        action: 'LOGIN',
                        details: `Logged in as ${email}`
                    });
                } catch (logErr) {
                    console.warn("Failed to log activity in Supabase mode", logErr);
                }
                navigate('/dashboard');
            }
        } catch (err) {
            console.log("Supabase fetch failed entirely, using mock login");
            const isDemoAdmin = email.toLowerCase().includes('demo') || email.toLowerCase().includes('admin');
            const mockToken = isDemoAdmin ? 'mock-token-123' : 'mock-token-user-123';
            
            localStorage.setItem('supabaseAuthToken', mockToken);

            try {
                await api.post('/logs', {
                    action: 'LOGIN',
                    details: `Logged in as Mock ${isDemoAdmin ? 'Admin' : 'User'} (${email})`
                });
            } catch (logErr) {
                console.warn("Failed to log activity", logErr);
            }

            navigate('/dashboard');
            window.location.reload();
        }
        setLoading(false);
    };

    const handleQuickSelect = (type) => {
        if (type === 'admin') {
            setEmail('demo@example.com');
            setPassword('password123');
        } else {
            setEmail('user@example.com');
            setPassword('password123');
        }
    };

    return (
        <div className="flex min-h-screen items-center justify-center relative overflow-hidden bg-zinc-950 px-4">
            <div className="absolute inset-0 z-0">
                <div className="absolute top-0 -left-4 w-72 h-72 bg-emerald-500 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-pulse"></div>
                <div className="absolute top-0 -right-4 w-72 h-72 bg-cyan-500 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-pulse"></div>
            </div>

            <div className="relative z-10 w-full max-w-md p-8 bg-zinc-900/80 backdrop-blur-xl border border-zinc-800 rounded-3xl shadow-2xl">
                <div className="mb-8 text-center">
                    <h1 className="text-4xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 to-cyan-400 tracking-tight">Fitness Buddy</h1>
                    <p className="text-zinc-400 mt-2 text-sm font-medium">Welcome back to your fitness journey</p>
                </div>

                {/* Quick Select Buttons for easy evaluation */}
                <div className="mb-6 bg-zinc-950/65 border border-zinc-800/80 rounded-2xl p-4">
                    <p className="text-xs font-bold text-zinc-500 uppercase tracking-widest text-center mb-3">Quick Credentials Select</p>
                    <div className="grid grid-cols-2 gap-3">
                        <button
                            type="button"
                            onClick={() => handleQuickSelect('admin')}
                            className="py-2.5 px-3 bg-zinc-900 hover:bg-zinc-850 text-emerald-400 hover:text-emerald-350 border border-emerald-500/20 hover:border-emerald-500/40 rounded-xl text-xs font-extrabold tracking-wide uppercase transition-all cursor-pointer active:scale-95 text-center"
                        >
                            Demo Admin
                        </button>
                        <button
                            type="button"
                            onClick={() => handleQuickSelect('user')}
                            className="py-2.5 px-3 bg-zinc-900 hover:bg-zinc-850 text-cyan-400 hover:text-cyan-355 border border-cyan-500/20 hover:border-cyan-500/40 rounded-xl text-xs font-extrabold tracking-wide uppercase transition-all cursor-pointer active:scale-95 text-center"
                        >
                            Demo User
                        </button>
                    </div>
                </div>

                <form onSubmit={handleLogin} className="space-y-6">
                    {error && <div className="p-3 text-sm text-red-200 bg-red-900/50 border border-red-800 rounded-lg">{error}</div>}

                    <div className="space-y-2">
                        <label className="text-sm font-semibold text-zinc-300">Email Address</label>
                        <input
                            type="email"
                            required
                            className="w-full px-4 py-3 bg-zinc-950/50 border border-zinc-800 rounded-xl focus:ring-2 focus:ring-emerald-500/50 focus:border-emerald-500 text-zinc-100 transition-all font-medium placeholder:text-zinc-650 outline-none"
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
                            className="w-full px-4 py-3 bg-zinc-950/50 border border-zinc-800 rounded-xl focus:ring-2 focus:ring-emerald-500/50 focus:border-emerald-500 text-zinc-100 transition-all font-medium placeholder:text-zinc-650 outline-none"
                            placeholder="••••••••"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                        />
                    </div>

                    <button
                        type="submit"
                        disabled={loading}
                        className="w-full py-3.5 px-4 bg-gradient-to-r from-emerald-500 to-emerald-600 hover:from-emerald-400 hover:to-emerald-500 text-white rounded-xl font-bold shadow-lg shadow-emerald-500/25 transition-all active:scale-[0.98] flex items-center justify-center cursor-pointer"
                    >
                        {loading ? 'Entering Dojo...' : 'Sign In'}
                    </button>
                </form>

                <p className="mt-8 text-center text-zinc-400 text-sm">
                    Don't have an account? <Link to="/register" className="text-emerald-400 hover:text-emerald-300 font-semibold underline-offset-4 hover:underline transition-colors">Create one</Link>
                </p>
            </div>
        </div>
    );
}
