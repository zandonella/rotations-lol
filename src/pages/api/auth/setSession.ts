export const prerender = false;
import type { APIRoute } from 'astro';

export const POST: APIRoute = async ({ request, cookies }) => {
    let body = await request.json();

    const accessToken = body?.access_token;
    const refreshToken = body?.refresh_token;

    if (!accessToken || !refreshToken) {
        return new Response(
            JSON.stringify({
                error: 'Access token and refresh token are required',
            }),
            { status: 400, headers: { 'Content-Type': 'application/json' } },
        );
    }

    cookies.set('sb-access-token', accessToken, {
        path: '/',
        httpOnly: true,
        sameSite: 'lax',
        secure: import.meta.env.PROD,
    });

    cookies.set('sb-refresh-token', refreshToken, {
        path: '/',
        httpOnly: true,
        sameSite: 'lax',
        secure: import.meta.env.PROD,
    });

    return new Response(JSON.stringify({ success: true }), {
        status: 200,
        headers: { 'Content-Type': 'application/json' },
    });
};
