import { useAuth } from './AuthProvider';
import { useState, useEffect } from 'react';

export function useIsAuthenticated() {
    const { token } = useAuth();
    return !!token;
}

export function useRefresh() {
    const { refreshToken } = useAuth();
    return refreshToken;
}

export function useSignIn() {
    const { setToken } = useAuth();
    return (newToken: string) => {
        setToken(newToken);
    };
}

export function useSignOut() {
    const { setToken } = useAuth();
    return () => {
        setToken(null);
    };
}

export function useUser(fetchUser: () => Promise<any>) {
    const { token } = useAuth();
    const [user, setUser] = useState<any>(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        if (!token) {
            setUser(null);
            return;
        }

        setLoading(true);
        fetchUser()
            .then((data) => setUser(data))
            .catch(() => {
                setError('Failed to fetch user');
                setUser(null);
            })
            .finally(() => setLoading(false));
    }, [token, fetchUser]);

    return { user, loading, error };
}
