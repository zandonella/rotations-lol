import { createContext, useContext, useState, useEffect } from 'react';
import supabase from '@/lib/supabase';
import type { Session } from '@supabase/supabase-js';
import { track } from '@/lib/umami.ts';

interface AuthContextType {
    session: Session | undefined;
    signUp: (
        email: string,
        password: string,
    ) => Promise<{ success: boolean; error?: any; data?: any }>;
    signOut: () => Promise<void>;
    signIn: (
        email: string,
        password: string,
    ) => Promise<{ success: boolean; error?: any; data?: any }>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

interface AuthContextProviderProps {
    children: React.ReactNode;
}

export function AuthContextProvider({ children }: AuthContextProviderProps) {
    const [session, setSession] = useState<Session | undefined>(undefined);

    useEffect(() => {
        supabase.auth.getSession().then(({ data: { session } }) => {
            if (session) {
                setSession(session);
            }
        });

        supabase.auth.onAuthStateChange((_event, session) => {
            setSession(session ?? undefined);
        });
    }, []);

    // Sign up
    async function signUp(email: string, password: string) {
        const { data, error } = await supabase.auth.signUp({ email, password });

        if (error) {
            track('signup_failure');
            console.error('Error signing up');
            return { success: false, error };
        }

        track('signup_success');

        return { success: true, data };
    }

    // Sign out
    async function signOut() {
        await supabase.auth.signOut();
        setSession(undefined);
        track('signout_success');
    }

    // Sign in
    async function signIn(email: string, password: string) {
        const { data, error } = await supabase.auth.signInWithPassword({
            email,
            password,
        });

        if (error) {
            track('signin_failure');
            console.error('Error signing in');
            return { success: false, error };
        }

        track('signin_success');
        return { success: true, data };
    }

    return (
        <AuthContext.Provider value={{ session, signUp, signOut, signIn }}>
            {children}
        </AuthContext.Provider>
    );
}

export function useAuth() {
    const ctx = useContext(AuthContext) as AuthContextType;
    if (!ctx)
        throw new Error('useAuth must be used within AuthContextProvider');
    return ctx;
}
