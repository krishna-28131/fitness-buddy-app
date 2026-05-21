import React, { createContext, useContext, useState, useEffect } from 'react';
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL && import.meta.env.VITE_SUPABASE_URL.startsWith('http') ? import.meta.env.VITE_SUPABASE_URL : 'https://placeholder.supabase.co';
const supabaseKey = import.meta.env.VITE_SUPABASE_ANON_KEY || 'placeholder';
export const supabase = createClient(supabaseUrl, supabaseKey);

const AuthContext = createContext({});

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchSession = async () => {
            try {
                const { data: { session }, error } = await supabase.auth.getSession();
                if (error || !session) {
                    console.log("Using Mock Session");
                    setUser({ id: 'mock-user-123', email: 'demo@example.com' });
                    localStorage.setItem('supabaseAuthToken', 'mock-token-123');
                } else {
                    setUser(session?.user || null);
                    if (session?.access_token) {
                        localStorage.setItem('supabaseAuthToken', session.access_token);
                    }
                }
            } catch (err) {
                console.log("Supabase fetch failed, using Mock Session");
                setUser({ id: 'mock-user-123', email: 'demo@example.com' });
                localStorage.setItem('supabaseAuthToken', 'mock-token-123');
            }
            setLoading(false);
        };

        fetchSession();

        const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
            setUser(session?.user || null);
            if (session?.access_token) {
                localStorage.setItem('supabaseAuthToken', session.access_token);
            } else {
                localStorage.removeItem('supabaseAuthToken');
            }
        });

        return () => subscription.unsubscribe();
    }, []);

    const value = {
        supabase,
        user,
        loading
    };

    return (
        <AuthContext.Provider value={value}>
            {!loading && children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => useContext(AuthContext);
