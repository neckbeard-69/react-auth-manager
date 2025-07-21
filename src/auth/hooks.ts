import { useAuth } from './AuthProvider';

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

export function useUser() {
    const { user, loadingUser, errorUser } = useAuth();
    return { user, loading: loadingUser, error: errorUser };
}
