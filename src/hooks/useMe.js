import { useEffect, useState } from 'react';

export function useMe() {
    const [state, setState] = useState({
        loading: true,
        authenticated: false,
        user: null,
    });

    async function refresh() {
        try {
            const res = await fetch('/api/auth/me', {
                method: 'GET',
                headers: { Accept: 'application/json' },
            });
            const data = await res.json();
            setState({ loading: false, ...data });
        } catch {
            setState({ loading: false, authenticated: false, user: null });
        }
    }

    useEffect(() => {
        refresh();
    }, []);

    return { ...state, refresh };
}
