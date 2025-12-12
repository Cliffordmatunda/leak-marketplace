import { createContext, useContext, useState, useEffect } from 'react';
import api from '../Api/axios';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);

    // 1. Check if user is logged in on page load
    useEffect(() => {
        const checkUserLoggedIn = async () => {
            try {
                const { data } = await api.get('/users/me');
                setUser(data.data.user);
            } catch (err) {
                // If error (401), it just means not logged in. No big deal.
                setUser(null);
            } finally {
                setLoading(false);
            }
        };

        checkUserLoggedIn();
    }, []);

    // 2. Login Function
    const login = async (email, password) => {
        const { data } = await api.post('/users/login', { email, password });
        setUser(data.data.user);
        // Note: We don't store token in localStorage. The Cookie handles it.
    };

    // 3. Logout Function
    const logout = async () => {
        await api.get('/users/logout');
        setUser(null);
        // Optional: Redirect to login logic here
    };

    return (
        <AuthContext.Provider value={{ user, login, logout, loading, isAdmin: user?.role === 'admin' }}>
            {children}
        </AuthContext.Provider>
    );
};

// Custom Hook to use Auth easily
export const useAuth = () => useContext(AuthContext);