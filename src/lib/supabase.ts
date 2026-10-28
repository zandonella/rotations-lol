import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseKey = import.meta.env.VITE_SUPABASE_PUBLISHABLE_DEFAULT_KEY;

const previewReadOnly =
    import.meta.env.DEV && import.meta.env.VITE_PREVIEW_READ_ONLY === 'true';
const supabase = createClient(supabaseUrl, supabaseKey, {
    global: {
        fetch: (input, init) => {
            const method = (
                init?.method ||
                (input instanceof Request ? input.method : 'GET')
            ).toUpperCase();
            const url = new URL(
                input instanceof Request ? input.url : String(input),
            );
            const readOnlyRpc =
                method === 'POST' &&
                url.pathname === '/rest/v1/rpc/get_top_wishlisted_items';
            if (
                previewReadOnly &&
                method !== 'GET' &&
                method !== 'HEAD' &&
                !readOnlyRpc
            ) {
                return Promise.resolve(
                    new Response(
                        JSON.stringify({
                            message: 'This preview is read-only.',
                        }),
                        { status: 403 },
                    ),
                );
            }
            return fetch(input, init);
        },
    },
});

export default supabase;
