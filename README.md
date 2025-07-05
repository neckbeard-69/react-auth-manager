# react-auth-handler

**A simple, flexible React auth context library for handling tokens, silent refresh, and conditional rendering — works with any Axios instance.**

---

## 🚀 Features

✅ Drop-in `<AuthProvider>` for React  
✅ Automatic request/response interceptors  
✅ Pluggable refresh function  
✅ Hooks: `useAuth`, `useIsAuthenticated`, `useSignIn`, `useSignOut`, `useRefresh`, `useUser`  
✅ Conditional render helpers: `<SignedIn>`, `<SignedOut>`, `<AuthSwitch>`  
✅ Zero runtime dependencies (React & Axios are peer dependencies)

---

## 📦 Install

```bash
npm install react-auth-handler
```

> **Note:** You must have **Axios** installed in your project:
> ```bash
> npm install axios
> ```

---

## 🛠️ Usage

### 1️⃣ Wrap your app

```tsx
import { AuthProvider } from 'react-auth-handler';
import axios from 'axios';

const api = axios.create({ baseURL: '/api' });

export default function App() {
  return (
    <AuthProvider
      api={api}
      refreshTokenFn={async () => {
        const res = await api.post('/refresh_token');
        return res.data.access_token;
      }}
    >
      <YourRoutes />
    </AuthProvider>
  );
}
```

---

### 2️⃣ Sign in & sign out

```tsx
import { useSignIn, useSignOut } from 'react-auth-handler';
import api from './api';

export function LoginButton() {
  const signIn = useSignIn();

  async function handleLogin() {
    const res = await api.post('/login', { username: '...', password: '...' });
    signIn(res.data.access_token);
  }

  return <button onClick={handleLogin}>Login</button>;
}

export function LogoutButton() {
  const signOut = useSignOut();
  return <button onClick={signOut}>Logout</button>;
}
```

---

### 3️⃣ Fetch user info

```tsx
import { useUser } from 'react-auth-handler';
import api from './api';

export function UserProfile() {
  const { user, loading, error } = useUser(() =>
    api.get('/me').then(res => res.data)
  );

  if (loading) return <p>Loading...</p>;
  if (error) return <p>Error: {error}</p>;
  return <pre>{JSON.stringify(user, null, 2)}</pre>;
}
```

---

### 4️⃣ Conditional rendering

```tsx
import { SignedIn, SignedOut, AuthSwitch } from 'react-auth-handler';

export function AuthStatus() {
  return (
    <>
      <SignedIn>
        <p>Welcome back!</p>
      </SignedIn>

      <SignedOut>
        <p>Please log in to continue.</p>
      </SignedOut>

      <AuthSwitch
        signedIn={<p>You are signed in.</p>}
        signedOut={<p>You are signed out.</p>}
      />
    </>
  );
}
```

---

## ⚙️ API

| Feature | Description |
| ------- | ----------- |
| `<AuthProvider>` | Context provider. Requires `api` and `refreshTokenFn`. |
| `useAuth` | Low-level hook to access `{ token, setToken, refreshToken }`. |
| `useIsAuthenticated` | Returns `true` if a token exists. |
| `useSignIn` | Returns `signIn(token)` to set a new token. |
| `useSignOut` | Clears the token. |
| `useRefresh` | Calls your `refreshTokenFn`. |
| `useUser` | Fetches and caches user data whenever token changes. |
| `<SignedIn>` | Renders children only if authenticated. |
| `<SignedOut>` | Renders children only if not authenticated. |
| `<AuthSwitch>` | Renders `signedIn` or `signedOut` component. |

---

## 🧩 Requirements

- React 18+
- Axios 1.x

---

## ✅ License

MIT

---
