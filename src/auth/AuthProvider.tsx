import React from 'react';
import {
    createContext,
    useContext,
    useEffect,
    useLayoutEffect,
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
}: AuthProviderProps) {
    const [token, setToken] = useState<Token>(null);

    /** Initialize session on mount */
    useEffect(() => {
        refreshToken();
    }, []);

    async function refreshToken() {
        const newToken = await refreshTokenFn();
        setToken(newToken);
    }

    /** Attach token to requests */
    useLayoutEffect(() => {
        const interceptor = api.interceptors.request.use((config) => {
            if (token) config.headers.Authorization = `Bearer ${token}`;
            return config;
        });
        return () => api.interceptors.request.eject(interceptor);
    }, [api, token]);

    /** Retry failed requests on 401 */
    useLayoutEffect(() => {
        const interceptor = api.interceptors.response.use(
            (res) => res,
            async (err) => {
                const originalRequest = err.config;
                if (err.response?.status === 401 && !originalRequest._retry) {
                    originalRequest._retry = true;
                    const newToken = await refreshTokenFn();
                    setToken(newToken);
                    if (newToken) {
                        originalRequest.headers.Authorization = `Bearer ${newToken}`;
                        return api(originalRequest);
                    }
                }
                return Promise.reject(err);
            },
        );
        return () => api.interceptors.response.eject(interceptor);
    }, [api, refreshTokenFn]);

    return (
        <AuthContext.Provider value={{ token, setToken, refreshToken }}>
            {children}
        </AuthContext.Provider>
    );
}
