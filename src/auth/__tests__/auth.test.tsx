import React from 'react';
import { render, screen, waitFor } from '@testing-library/react';
import { renderHook } from '@testing-library/react';
import { useIsAuthenticated, useUser } from '../hooks';
import { SignedIn, SignedOut } from '../components';
import { TestAuthProvider } from '../__helpers__/test-utils';

// Mock API function for useUser hook
const mockFetchUser = jest.fn();

beforeEach(() => {
    jest.clearAllMocks();
});

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
    it('fetches user data successfully when token exists', async () => {
        const userData = {
            email: 'test@example.com',
            first_name: 'Test',
            last_name: 'User',
            role: 'admin',
        };
        mockFetchUser.mockResolvedValueOnce(userData);

        const wrapper = ({ children }: { children: React.ReactNode }) => (
            <TestAuthProvider initialToken="token123">
                {children}
            </TestAuthProvider>
        );

        const { result } = renderHook(() => useUser(mockFetchUser), {
            wrapper,
        });

        expect(result.current.loading).toBe(true);
        await waitFor(() => expect(result.current.loading).toBe(false));

        expect(result.current.user).toEqual(userData);
        expect(result.current.error).toBeNull();
    });

    it('handles fetch error and sets error state', async () => {
        mockFetchUser.mockRejectedValueOnce(new Error('Failed to fetch'));

        const wrapper = ({ children }: { children: React.ReactNode }) => (
            <TestAuthProvider initialToken="token123">
                {children}
            </TestAuthProvider>
        );

        const { result } = renderHook(() => useUser(mockFetchUser), {
            wrapper,
        });

        expect(result.current.loading).toBe(true);
        await waitFor(() => expect(result.current.loading).toBe(false));

        expect(result.current.user).toBeNull();
        expect(result.current.error).toBe('Failed to fetch user');
    });

    it('does not fetch user if token is null', () => {
        const wrapper = ({ children }: { children: React.ReactNode }) => (
            <TestAuthProvider initialToken={null}>{children}</TestAuthProvider>
        );

        const { result } = renderHook(() => useUser(mockFetchUser), {
            wrapper,
        });

        expect(result.current.user).toBeNull();
        expect(result.current.error).toBeNull();
        expect(result.current.loading).toBe(false);
        expect(mockFetchUser).not.toHaveBeenCalled();
    });
});
