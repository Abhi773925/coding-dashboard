import { useState, useEffect, useCallback } from 'react';
import axios from 'axios';
import config from '../config/api';

const API_BASE_URL = config.API_URL;

export const useAuth = () => {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    // Fetch current user
    const fetchCurrentUser = useCallback(async () => {
        try {
            const response = await axios.get(`${API_BASE_URL}/auth/current-user`, {
                withCredentials: true
            });
            setUser(response.data);
            setError(null);
        } catch (err) {
            setUser(null);
            setError('Not authenticated');
        } finally {
            setLoading(false);
        }
    }, []);

    // Login with Google
    const loginWithGoogle = useCallback(() => {
        window.location.href = `${API_BASE_URL}/auth/google`;
    }, []);

    // Logout
    const logout = useCallback(async () => {
        try {
            await axios.post(`${API_BASE_URL}/auth/logout`, {}, {
                withCredentials: true
            });
            setUser(null);
        } catch (err) {
            setError('Failed to logout');
        }
    }, []);

    // Check authentication status on mount
    useEffect(() => {
        fetchCurrentUser();
    }, [fetchCurrentUser]);

    return {
        user,
        loading,
        error,
        isAuthenticated: !!user,
        loginWithGoogle,
        logout,
        refreshUser: fetchCurrentUser
    };
};
