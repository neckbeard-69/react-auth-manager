import { ReactNode } from 'react';
import React from 'react';
import { useIsAuthenticated } from './hooks';

interface SignedInProps {
    children: ReactNode;
}

export function SignedIn({ children }: SignedInProps) {
    const isAuthenticated = useIsAuthenticated();
    return isAuthenticated ? <>{children}</> : null;
}

export function SignedOut({ children }: SignedInProps) {
    const isAuthenticated = useIsAuthenticated();
    return !isAuthenticated ? <>{children}</> : null;
}
interface AuthSwitchProps {
    signedIn: ReactNode;
    signedOut: ReactNode;
}

export function AuthSwitch({ signedIn, signedOut }: AuthSwitchProps) {
    const isAuthenticated = useIsAuthenticated();
    return <>{isAuthenticated ? signedIn : signedOut}</>;
}
