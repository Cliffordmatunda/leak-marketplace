import { createContext, useContext, useState, useEffect } from 'react';
import api from '../api/axios';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const checkUserLoggedIn = async () => {
            try {
                const { data } = await api.get('/users/me');
                setUser(data.data.user);
            } catch (err) {
                setUser(null);
            } finally {
                setLoading(false);
            }
        };
        checkUserLoggedIn();
    }, []);

    // ✅ CHANGED: Accepts 'username' instead of 'email'
    const login = async (username, password) => {
        const { data } = await api.post('/users/login', { username, password });
        setUser(data.data.user);
    };

    const logout = async () => {
        await api.get('/users/logout');
        setUser(null);
    };

    return (
        <AuthContext.Provider value={{ user, login, logout, loading, isAdmin: user?.role === 'admin' }}>
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => useContext(AuthContext);