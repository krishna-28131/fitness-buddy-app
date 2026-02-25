import React from 'react';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import { User, LogOut, ArrowLeft } from 'lucide-react';

export default function Profile() {
    const { user, supabase } = useAuth();
    const navigate = useNavigate();

    return (
        <div className="min-h-screen bg-zinc-950 text-zinc-100 p-4 sm:p-8">
            <div className="max-w-2xl mx-auto mt-10">
                <button
                    onClick={() => navigate('/dashboard')}
                    className="flex items-center space-x-2 text-zinc-400 hover:text-white mb-8 transition-colors group"
                >
                    <ArrowLeft className="w-5 h-5 group-hover:-translate-x-1 transition-transform" />
                    <span>Back to Dashboard</span>
                </button>

                <div className="bg-zinc-900 border border-zinc-800 rounded-3xl p-8 sm:p-12 text-center md:text-left shadow-2xl">
                    <div className="flex flex-col md:flex-row items-center md:space-x-8">
                        <div className="w-32 h-32 rounded-full bg-gradient-to-tr from-emerald-500 to-cyan-500 p-1 mb-6 md:mb-0">
                            <div className="w-full h-full bg-zinc-900 rounded-full flex items-center justify-center border-4 border-zinc-950">
                                <User className="w-12 h-12 text-zinc-400" />
                            </div>
                        </div>

                        <div className="flex-1">
                            <h1 className="text-3xl font-bold text-white mb-2">My Profile</h1>
                            <p className="text-zinc-400 font-medium">{user?.email}</p>
                            <div className="mt-6 inline-flex items-center space-x-2 px-4 py-2 bg-zinc-800/50 rounded-full text-sm font-medium text-emerald-400 border border-emerald-500/20">
                                <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
                                <span>Active User</span>
                            </div>
                        </div>
                    </div>

                    <div className="mt-12 pt-8 border-t border-zinc-800 flex justify-center md:justify-start">
                        <button
                            onClick={async () => { await supabase.auth.signOut(); navigate('/login'); }}
                            className="px-6 py-3 bg-red-500/10 hover:bg-red-500 text-red-500 hover:text-white border border-red-500/50 rounded-xl font-bold transition-all flex items-center space-x-2"
                        >
                            <LogOut className="w-5 h-5" />
                            <span>Log out of device</span>
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}
