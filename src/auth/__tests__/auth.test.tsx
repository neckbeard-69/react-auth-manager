import React from 'react';
import { render, screen } from '@testing-library/react';
import { renderHook } from '@testing-library/react';
import { useIsAuthenticated, useUser } from '../hooks';
import { SignedIn, SignedOut } from '../components';
import { TestAuthProvider } from '../__helpers__/test-utils';

describe('useIsAuthenticated', () => {
    it('returns false when no token', () => {
        const wrapper = ({ children }: { children: React.ReactNode }) => (
            <TestAuthProvider initialToken={null}>{children}</TestAuthProvider>
        );

        const { result } = renderHook(() => useIsAuthenticated(), { wrapper });
        expect(result.current).toBe(false);
    });

    it('returns true when token is set', () => {
        const wrapper = ({ children }: { children: React.ReactNode }) => (
            <TestAuthProvider initialToken="token123">
                {children}
            </TestAuthProvider>
        );

        const { result } = renderHook(() => useIsAuthenticated(), { wrapper });
        expect(result.current).toBe(true);
    });
});

describe('SignedIn and SignedOut components', () => {
    it('renders children when authenticated', () => {
        render(
            <TestAuthProvider initialToken="token123">
                <SignedIn>
                    <div data-testid="signed-in">Signed In Content</div>
                </SignedIn>
                <SignedOut>
                    <div data-testid="signed-out">Signed Out Content</div>
                </SignedOut>
            </TestAuthProvider>,
        );

        expect(screen.getByTestId('signed-in')).toBeInTheDocument();
        expect(screen.queryByTestId('signed-out')).toBeNull();
    });

    it('renders children when NOT authenticated', () => {
        render(
            <TestAuthProvider initialToken={null}>
                <SignedIn>
                    <div data-testid="signed-in">Signed In Content</div>
                </SignedIn>
                <SignedOut>
                    <div data-testid="signed-out">Signed Out Content</div>
                </SignedOut>
            </TestAuthProvider>,
        );

        expect(screen.queryByTestId('signed-in')).toBeNull();
        expect(screen.getByTestId('signed-out')).toBeInTheDocument();
    });
});

describe('useUser hook', () => {
    it('returns user data when provided in context', () => {
        const userData = {
            email: 'test@example.com',
            first_name: 'Test',
            last_name: 'User',
            role: 'admin',
        };

        const wrapper = ({ children }: { children: React.ReactNode }) => (
            <TestAuthProvider
                initialToken="token123"
                initialUser={userData}
                loadingUser={false}
            >
                {children}
            </TestAuthProvider>
        );

        const { result } = renderHook(() => useUser(), {
            wrapper,
        });

        expect(result.current.loading).toBe(false);
        expect(result.current.user).toEqual(userData);
        expect(result.current.error).toBeNull();
    });

    it('returns loading true when context says loading', () => {
        const wrapper = ({ children }: { children: React.ReactNode }) => (
            <TestAuthProvider
                initialToken="token123"
                initialUser={null}
                loadingUser={true}
            >
                {children}
            </TestAuthProvider>
        );

        const { result } = renderHook(() => useUser(), {
            wrapper,
        });

        expect(result.current.loading).toBe(true);
        expect(result.current.user).toBeNull();
        expect(result.current.error).toBeNull();
    });

    it('returns error state when context provides error', () => {
        const wrapper = ({ children }: { children: React.ReactNode }) => (
            <TestAuthProvider
                initialToken="token123"
                initialUser={null}
                loadingUser={false}
                errorUser="Failed to fetch user"
            >
                {children}
            </TestAuthProvider>
        );

        const { result } = renderHook(() => useUser(), {
            wrapper,
        });

        expect(result.current.loading).toBe(false);
        expect(result.current.user).toBeNull();
        expect(result.current.error).toBe('Failed to fetch user');
    });

    it('does not provide user when token is null', () => {
        const wrapper = ({ children }: { children: React.ReactNode }) => (
            <TestAuthProvider initialToken={null}>{children}</TestAuthProvider>
        );

        const { result } = renderHook(() => useUser(), {
            wrapper,
        });

        expect(result.current.user).toBeNull();
        expect(result.current.error).toBeNull();
        expect(result.current.loading).toBe(false);
    });
});
