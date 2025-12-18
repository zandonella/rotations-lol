export const prerender = false;
import type { APIRoute } from 'astro';
import { supabase } from '../../../lib/supabase';

export const POST: APIRoute = async ({ request, cookies }) => {
    let body: { email?: string; password?: string };

    try {
        body = await request.json();
    } catch {
        return new Response(JSON.stringify({ error: 'Invalid JSON body' }), {
            status: 400,
            headers: { 'Content-Type': 'application/json' },
        });
    }

    const email = body.email?.trim();
    const password = body.password;

    console.log('Signin API called', email);

    if (!email || !password) {
        return new Response(
            JSON.stringify({ error: 'Email and password are required' }),
            { status: 400, headers: { 'Content-Type': 'application/json' } },
        );
    }

    const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
    });

    if (error || !data.session) {
        return new Response(
            JSON.stringify({
                error: error?.message ?? 'Authentication failed',
            }),
            { status: 401, headers: { 'Content-Type': 'application/json' } },
        );
    }

    const { access_token, refresh_token, user } = data.session;
    console.log(data.session);

    cookies.set('sb-access-token', access_token, {
        path: '/',
        httpOnly: true,
        sameSite: 'lax',
        secure: import.meta.env.PROD,
    });
    cookies.set('sb-refresh-token', refresh_token, {
        path: '/',
        httpOnly: true,
        sameSite: 'lax',
        secure: import.meta.env.PROD,
    });

    return new Response(
        JSON.stringify({
            success: true,
            user: user ? { id: user.id, email: user.email } : null,
            session: true,
        }),
        { status: 200, headers: { 'Content-Type': 'application/json' } },
    );
};
