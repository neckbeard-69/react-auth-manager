import type { AxiosInstance } from 'axios';

export type Token = string | null;

export type AuthContextType = {
    token: Token;
    setToken: (token: Token) => void;
    refreshToken: () => Promise<void>;
};

export interface AuthProviderProps {
    children: React.ReactNode;

    /** API instance, e.g. axios instance */
    api: AxiosInstance;

    /** Called when you need to refresh token, returns new token */
    refreshTokenFn: () => Promise<string | null>;
}
