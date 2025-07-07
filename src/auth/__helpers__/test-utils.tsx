import React, { ReactNode, useState } from 'react';
import { AuthContext } from '../AuthProvider';
import { AuthContextType } from '../types';

interface TestAuthProviderProps {
    initialToken?: string | null;
    initialUser?: any;
    loadingUser?: boolean;
    errorUser?: string | null;
    children: ReactNode;
}

export function TestAuthProvider({
    initialToken = null,
    initialUser = null,
    loadingUser = false,
    errorUser = null,
    children,
}: TestAuthProviderProps) {
    const [token, setToken] = useState<string | null>(initialToken);

    const refreshToken = () => Promise.resolve();

    const value: AuthContextType = {
        token,
        setToken,
        refreshToken,
        user: initialUser,
        loadingUser,
        errorUser,
    };

    return (
        <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
    );
}
