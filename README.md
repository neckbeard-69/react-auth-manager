# react-auth-manager

A straightforward and adaptable React authentication context library designed for managing tokens, silent refreshes, and conditional rendering. It seamlessly integrates with any Axios instance.

---

## Key Features

* **Effortless Integration:** A drop-in `<AuthProvider>` component for your React applications.
* **Automatic Interception:** Includes automatic request and response interceptors to streamline token handling.
* **Customizable Refresh:** Provides a pluggable function for handling token refreshes.
* **Comprehensive Hooks:** Offers a suite of hooks including `useAuth`, `useIsAuthenticated`, `useSignIn`, `useSignOut`, `useRefresh`, and `useUser` for various authentication needs.
* **Conditional Rendering Utilities:** Features `<SignedIn>`, `<SignedOut>`, and `<AuthSwitch>` components to simplify UI rendering based on authentication status.
* **Lightweight:** Has zero runtime dependencies, with React and Axios as peer dependencies.

---

## Installation

To get started, install the library using npm:

```bash
npm install @neckbeard/react-auth-manager
````

> **Note:** Axios is a peer dependency and must be installed separately in your project:
>
> ```bash
> npm install axios
> ```

-----

## Usage Guide

### 1\. Wrap Your Application

Begin by wrapping your main application component with the `AuthProvider`. You'll need to provide your Axios instance and a function for refreshing tokens.

```tsx
import { AuthProvider } from 'neckbeard-69/react-auth-manager';
import axios from 'axios';

const api = axios.create({ baseURL: '/api' });

export default function App() {
  return (
    <AuthProvider
      api={api}
      refreshTokenFn={async () => {
        try {
          const res = await api.post('/refresh_token');
          return res.data.access_token;
        } catch (error) {
          console.error("Failed to refresh token:", error);
        }
      }}
    >
      <YourRoutes />
    </AuthProvider>
  );
}
```

-----

### 2\. Sign In and Sign Out

Utilize the `useSignIn` and `useSignOut` hooks to manage user sessions.

```tsx
import { useSignIn, useSignOut } from 'neckbeard-69/react-auth-manager';
import api from './api';

export function LoginButton() {
  const signIn = useSignIn();

  async function handleLogin() {
    try {
      const res = await api.post('/login', { username: '...', password: '...' });
      signIn(res.data.access_token);
    } catch (error) {
      console.error("Login failed:", error);
      alert("Login failed. Please check your credentials.");
    }
  }

  return <button onClick={handleLogin}>Login</button>;
}

export function LogoutButton() {
  const signOut = useSignOut();
  
  async function handleLogout() {
    try {
      // Optionally call an API endpoint to invalidate the session on the server
      await api.post('/logout'); 
      signOut();
    } catch (error) {
      console.error("Logout failed:", error);
      signOut(); 
    }
  }

  return <button onClick={handleLogout}>Logout</button>;
}
```

-----

### 3\. Fetch User Information

The `useUser` hook allows you to fetch and cache user-specific data.

```tsx
import { useUser } from 'neckbeard-69/react-auth-manager';
import api from './api';

export function UserProfile() {
  // The useUser hook handles its own loading and error states internally,
  // making it clean to use.
  const { user, loading, error } = useUser(() =>
    api.get('/me').then(res => res.data)
  );

  if (loading) return <p>Loading user profile...</p>;
  if (error) return <p>Error loading profile: {error.message || 'Unknown error'}</p>;
  if (!user) return <p>No user data available.</p>; 

  return <pre>{JSON.stringify(user, null, 2)}</pre>;
}
```

-----

### 4\. Conditional Rendering

Leverage the `<SignedIn>`, `<SignedOut>`, and `<AuthSwitch>` components for conditional rendering based on the user's authentication status.

```tsx
import { SignedIn, SignedOut, AuthSwitch } from 'neckbeard-69/react-auth-manager';

export function AuthStatus() {
  return (
    <>
      <SignedIn>
        <p>Welcome back! You are currently signed in.</p>
      </SignedIn>

      <SignedOut>
        <p>Please log in to continue using all features.</p>
      </SignedOut>

      <AuthSwitch
        signedIn={<p>You are authenticated.</p>}
        signedOut={<p>You are not authenticated.</p>}
      />
    </>
  );
}
```

-----

## API Reference

This section provides a detailed overview of the components and hooks available in `react-auth-manager`.

| Feature            | Description                                                                                                                                      |
| :----------------- | :----------------------------------------------------------------------------------------------------------------------------------------------- |
| `<AuthProvider>`   | The core context provider. Requires `api` and `refreshTokenFn` props.                                                                            |
| `useAuth`          | A low-level hook for accessing the authentication state: `{ token, setToken, refreshToken }`.                                                    |
| `useIsAuthenticated` | Returns `true` if an authentication token is present, indicating a logged-in user.                                                               |
| `useSignIn`        | Returns a function that accepts an authentication token to establish the user's session.                                                                         |
| `useSignOut`       | A function that clears the current authentication token, effectively logging out the user.                                                       |
| `useRefresh`       | A hook that invokes your provided `refreshTokenFn` to refresh the token.                                                                         |
| `useUser`          | Fetches and intelligently caches user data, automatically updating when the authentication token changes.                                        |
| `<SignedIn>`       | Renders its children components only when the user is authenticated.                                                                             |
| `<SignedOut>`      | Renders its children components only when the user is not authenticated.                                                                         |
| `<AuthSwitch>`     | A versatile component that renders either its `signedIn` or `signedOut` prop based on the authentication status.                                 |

-----

## Requirements

  * React 18+
  * Axios 1.x

-----

## License

MIT

