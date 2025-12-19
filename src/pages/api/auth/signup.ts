export const prerender = false;
import type { APIRoute } from 'astro';
import { supabase } from '../../../lib/supabase';

export const POST: APIRoute = async ({ request }) => {
    let body: { email?: string; password?: string; confirm_password?: string };

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
    const confirm_password = body.confirm_password;

    console.log('Signup API called', email, password, confirm_password);

    if (!email || !password) {
        return new Response(
            JSON.stringify({ error: 'Email and password are required' }),
            { status: 400, headers: { 'Content-Type': 'application/json' } },
        );
    }

    if (password !== confirm_password) {
        return new Response(
            JSON.stringify({ error: 'Passwords do not match' }),
            { status: 400, headers: { 'Content-Type': 'application/json' } },
        );
    }

    const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
            emailRedirectTo: `${import.meta.env.SITE_URL}/auth/confirmed`,
        },
    });

    if (error) {
        return new Response(JSON.stringify({ error: error.message }), {
            status: 400,
            headers: { 'Content-Type': 'application/json' },
        });
    }

    return new Response(
        JSON.stringify({
            success: true,
            user: data.user
                ? { id: data.user.id, email: data.user.email }
                : null,
            session: data.session ? true : false,
        }),
        { status: 200, headers: { 'Content-Type': 'application/json' } },
    );
};
