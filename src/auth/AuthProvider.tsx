import React, {
    createContext,
    useContext,
    useEffect,
    useState,
    type ReactNode,
} from 'react';
import type { AuthContextType, AuthProviderProps, Token } from './types';

export const AuthContext = createContext<AuthContextType | undefined>(
    undefined,
);

export function useAuth() {
    const ctx = useContext(AuthContext);
    if (!ctx) throw new Error('useAuth must be used within an AuthProvider');
    return ctx;
}

export function AuthProvider({
    children,
    api,
    refreshTokenFn,
    fetchUserFn, // <-- new prop: function to fetch user profile
}: AuthProviderProps & { fetchUserFn: () => Promise<any> }) {
    const [token, setToken] = useState<Token>(null);
    const [user, setUser] = useState<any>(null);
    const [loadingUser, setLoadingUser] = useState(false);
    const [errorUser, setErrorUser] = useState<string | null>(null);

    /** Initialize session on mount */
    useEffect(() => {
        refreshToken();
    }, []);

    async function refreshToken() {
        const newToken = await refreshTokenFn();
        setToken(newToken);
    }

    /** Fetch user whenever token changes */
    useEffect(() => {
        if (!token) {
            setUser(null);
            setErrorUser(null);
            return;
        }

        setLoadingUser(true);
        fetchUserFn()
            .then((data) => {
                setUser(data);
                setErrorUser(null);
            })
            .catch(() => {
                setUser(null);
                setErrorUser('Failed to fetch user');
            })
            .finally(() => setLoadingUser(false));
    }, [token, fetchUserFn]);

    /** Attach token to requests */
    useEffect(() => {
        const interceptor = api.interceptors.request.use((config) => {
            if (token) config.headers.Authorization = `Bearer ${token}`;
            return config;
        });
        return () => api.interceptors.request.eject(interceptor);
    }, [token]);

    /** Retry failed requests on 401 */
    useEffect(() => {
        const interceptor = api.interceptors.response.use(
            (res) => res,
            async (err) => {
                const originalRequest = err.config;
                if (err.response?.status === 401 && !originalRequest._retry) {
                    originalRequest._retry = true;

                    // refresh the token
                    const newToken = await refreshTokenFn();
                    setToken(newToken);

                    if (newToken) {
                        originalRequest.headers.Authorization = `Bearer ${newToken}`;
                        // Re-run the original request with the new token
                        return api(originalRequest);
                    }
                }
                return Promise.reject(err);
            },
        );

        return () => api.interceptors.response.eject(interceptor);
    }, []);

    return (
        <AuthContext.Provider
            value={{
                token,
                setToken,
                refreshToken,
                user,
                loadingUser,
                errorUser,
            }}
        >
            {children}
        </AuthContext.Provider>
    );
}
