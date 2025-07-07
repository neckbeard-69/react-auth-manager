import type { AxiosInstance } from 'axios';

export type Token = string | null;

export type AuthContextType = {
    token: Token;
    setToken: (token: Token) => void;
    refreshToken: () => Promise<void>;

    user: any | null;
    loadingUser: boolean;
    errorUser: string | null;
};

export interface AuthProviderProps {
    children: React.ReactNode;

    /** API instance, e.g. axios instance */
    api: AxiosInstance;

    /** Called when you need to refresh token, returns new token */
    refreshTokenFn: () => Promise<string | null>;

    /** Called to fetch user profile, returns user data */
    fetchUserFn: () => Promise<any>;
}
