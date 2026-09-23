import React, { createContext, useContext, useEffect, useMemo, useState } from 'react';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(() => {
        try {
            const stored = localStorage.getItem('remission_user');
            return stored ? JSON.parse(stored) : null;
        } catch (_) {
            return null;
        }
    });

    const value = useMemo(
        () => ({
            user,
            isAuthed: !!user,
            login: async (email, password) => {
                const res = await fetch('/api/auth', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ email, password }),
                });
                const data = await res.json();
                if (!res.ok) throw new Error(data.error || 'Login failed');
                setUser(data.user);
                localStorage.setItem('remission_user', JSON.stringify(data.user));
                return data.user;
            },
            signup: async (email, password, extraFields = {}) => {
                const res = await fetch('/api/auth', {
                    method: 'PUT',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ email, password, ...extraFields }),
                });
                const data = await res.json();
                if (!res.ok) throw new Error(data.error || 'Signup failed');
                setUser(data.user);
                localStorage.setItem('remission_user', JSON.stringify(data.user));
                return data.user;
            },
            logout: () => {
                setUser(null);
                localStorage.removeItem('remission_user');
            },
        }),
        [user],
    );

    return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => useContext(AuthContext);

export default AuthContext;
