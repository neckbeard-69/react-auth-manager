# react-auth-manager

A straightforward and adaptable React authentication context library for managing tokens, silent refreshes, and user state—all integrated with any Axios instance.

## Key Features

  * **Effortless Integration:** A drop-in `<AuthProvider>` for React applications.
  * **Automatic Interceptors:** Request and response interceptors handle token management.
  * **Silent Refresh:** Supports custom refresh logic.
  * **User Profile Handling:** Fetches and caches user profiles automatically.
  * **Comprehensive Hooks:** Includes `useAuth`, `useIsAuthenticated`, `useSignIn`, `useSignOut`, `useRefresh`, and `useUser`.
  * **Conditional Rendering:** `<SignedIn>`, `<SignedOut>`, and `<AuthSwitch>` facilitate rendering UI based on authentication state.
  * **Lightweight:** Zero runtime dependencies beyond React and Axios.

## Installation

```bash
npm install @neckbeard/react-auth-manager
```

**Note:** Axios is a peer dependency and must be installed separately:

```bash
npm install axios
```

## Usage Guide

### 1\. Wrap Your Application

Wrap your application with `<AuthProvider>`, providing your Axios instance and functions for token refresh and user fetching.

```jsx
import { AuthProvider } from '@neckbeard/react-auth-manager';
import axios from 'axios';

const api = axios.create({ baseURL: '/api' });

export default function App() {
  return (
    <AuthProvider
      api={api}
      refreshTokenFn={async () => {
        try {
          const response = await api.post('/refresh_token');
          // Assuming the refresh token endpoint returns the new access token directly in response.data.accessToken
          return response.data.accessToken; 
        } catch (error) {
          console.error('Token refresh failed:', error);
          // It's often good practice to re-throw or handle the error to trigger a sign-out if refresh fails critically
          throw error; 
        }
      }}
      fetchUserFn={async () => {
        // Assuming the user profile endpoint returns user data directly in response.data
        const response = await api.get('/me');
        return response.data;
      }}
    >
      <YourRoutes />
    </AuthProvider>
  );
}
```

### 2\. Sign In and Out

Utilize `useSignIn` and `useSignOut` for managing login and logout operations.

```jsx
import { useSignIn, useSignOut } from '@neckbeard/react-auth-manager';
import api from './api'; // Ensure this points to your configured Axios instance

export function LoginButton() {
  const signIn = useSignIn();

  async function handleLogin() {
    try {
      const response = await api.post('/login', { username: '...', password: '...' });
      // Assuming the login endpoint returns the access token directly in response.data.accessToken
      signIn(response.data.accessToken); 
    } catch (error) {
      console.error('Login failed:', error);
      // Handle login error, e.g., display an error message to the user
    }
  }

  return <button onClick={handleLogin}>Login</button>;
}

export function LogoutButton() {
  const signOut = useSignOut();

  async function handleLogout() {
    try {
      await api.post('/logout'); // Optional: Call your backend logout endpoint
    } catch (error) {
      console.error('Logout failed on backend:', error);
      // Continue with client-side sign out even if backend logout fails
    } finally {
      signOut(); // Always clear client-side authentication state
    }
  }

  return <button onClick={handleLogout}>Logout</button>;
}
```

### 3\. Access the User Profile

The `useUser` hook provides access to the authenticated user's profile.

```jsx
import { useUser } from '@neckbeard/react-auth-manager';

export function UserProfile() {
  const { user, loading, error } = useUser();

  if (loading) return <p>Loading user profile...</p>;
  if (error) return <p>Error loading user profile: {error.message || 'An unknown error occurred'}</p>;
  if (!user) return <p>No user data available.</p>;

  return (
    <pre>{JSON.stringify(user, null, 2)}</pre>
  );
}
```

### 4\. Conditional Rendering

Render UI components based on the user's authentication status using `<SignedIn>`, `<SignedOut>`, and `<AuthSwitch>`.

```jsx
import { SignedIn, SignedOut, AuthSwitch } from '@neckbeard/react-auth-manager';

export function AuthStatus() {
  return (
    <>
      <SignedIn>
        <p>Welcome back, you are signed in.</p>
      </SignedIn>

      <SignedOut>
        <p>Please sign in to continue.</p>
      </SignedOut>

      <AuthSwitch
        signedIn={<p>Authenticated</p>}
        signedOut={<p>Not authenticated</p>}
      />
    </>
  );
}
```

## API Reference

| Feature           | Description                                                               |
| :---------------- | :------------------------------------------------------------------------ |
| `<AuthProvider>`  | The main authentication provider. Requires `api`, `refreshTokenFn`, and `fetchUserFn` props. |
| `useAuth`         | Low-level access to authentication state and functions: `{ token, setToken, refreshToken, user, loadingUser, errorUser }`. |
| `useIsAuthenticated` | Returns `true` if an authentication token exists.                         |
| `useSignIn`       | A function to call with an access token to sign the user in.              |
| `useSignOut`      | A function that clears the authentication token and user state.           |
| `useRefresh`      | A function that triggers the `refreshTokenFn` provided to `AuthProvider`. |
| `useUser`         | Returns an object containing `{ user, loading, error }` related to the fetched user profile. |
| `<SignedIn>`      | Renders its children only if the user is signed in.                       |
| `<SignedOut>`     | Renders its children only if the user is signed out.                      |
| `<AuthSwitch>`    | Renders the `signedIn` prop's content if authenticated, otherwise renders the `signedOut` prop's content. |

## Requirements

  * React 18+
  * Axios 1.x

## License

MIT
