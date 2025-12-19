export const prerender = false;
import type { APIRoute } from 'astro';
import { supabase } from '../../../lib/supabase';

export const GET: APIRoute = async ({ cookies }) => {
    const accessToken = cookies.get('sb-access-token')?.value ?? null;

    if (!accessToken) {
        return new Response(
            JSON.stringify({ authenticated: false, user: null }),
            { status: 200, headers: { 'Content-Type': 'application/json' } },
        );
    }

    const { data, error } = await supabase.auth.getUser(accessToken);

    if (error || !data.user) {
        return new Response(
            JSON.stringify({ authenticated: false, user: null }),
            { status: 200, headers: { 'Content-Type': 'application/json' } },
        );
    }

    return new Response(
        JSON.stringify({
            authenticated: true,
            user: { id: data.user.id, email: data.user.email },
        }),
        { status: 200, headers: { 'Content-Type': 'application/json' } },
    );
};
