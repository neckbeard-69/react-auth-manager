import React, { ReactNode, useState } from 'react';
import { AuthContext } from '../AuthProvider';
import { AuthContextType } from '../types';

interface TestAuthProviderProps {
    initialToken?: string | null;
    children: ReactNode;
}

export function TestAuthProvider({
    initialToken = null,
    children,
}: TestAuthProviderProps) {
    const [token, setToken] = useState<string | null>(initialToken);

    // mock refreshToken as a no-op
    const refreshToken = () => Promise.resolve();

    const value: AuthContextType = {
        token,
        setToken,
        refreshToken,
    };

    return (
        <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
    );
}
