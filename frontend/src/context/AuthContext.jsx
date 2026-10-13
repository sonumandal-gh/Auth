import { useState, useEffect } from 'react';
import api from '../services/api';
import { AuthContext } from './context';

export function AuthProvider({ children }) {
  const [token, setToken] = useState(() => localStorage.getItem('token'));
  const [user, setUser] = useState(() => {
    const savedUser = localStorage.getItem('user');
    if (savedUser) {
      try {
        return JSON.parse(savedUser);
      } catch {
        return null;
      }
    }
    const savedName = localStorage.getItem('userName');
    const savedId = localStorage.getItem('userId');
    if (savedName && savedId) {
      return { _id: savedId, firstName: savedName, role: 'student' };
    }
    return null;
  });
  const [loading, setLoading] = useState(false);

  // Synchronize auth state with storage helper
  const setAuthSession = (authToken, authUser) => {
    if (authToken && authUser) {
      localStorage.setItem('token', authToken);
      localStorage.setItem('user', JSON.stringify(authUser));
      localStorage.setItem('userId', authUser._id || authUser.userId || '');
      localStorage.setItem('userName', authUser.firstName || '');
      setToken(authToken);
      setUser(authUser);
    } else {
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      localStorage.removeItem('userId');
      localStorage.removeItem('userName');
      setToken(null);
      setUser(null);
    }
  };

  // Login action
  const login = async (email, password) => {
    setLoading(true);
    try {
      const response = await api.post('/api/auth/login', { email, password });
      const { token: receivedToken, user: receivedUser } = response.data;
      
      const userData = receivedUser || {
        _id: response.data.userId,
        firstName: response.data.firstName,
        lastName: response.data.lastName,
        email: response.data.email,
        role: response.data.role || 'student'
      };

      setAuthSession(receivedToken, userData);
      return userData;
    } finally {
      setLoading(false);
    }
  };

  // Register action
  const register = async (formData) => {
    setLoading(true);
    try {
      const response = await api.post('/api/auth/register', formData);
      const { token: receivedToken, user: receivedUser } = response.data;

      // Auto-login with returned token and user
      if (receivedToken && receivedUser) {
        setAuthSession(receivedToken, receivedUser);
      }
      return response.data;
    } finally {
      setLoading(false);
    }
  };

  // Logout action
  const logout = async () => {
    try {
      await api.post('/api/auth/logout').catch(() => {});
    } finally {
      setAuthSession(null, null);
    }
  };

  // Listen to global 401 unauthorized events from Axios interceptor
  useEffect(() => {
    const handleUnauthorized = () => {
      setToken(null);
      setUser(null);
    };

    window.addEventListener('auth:unauthorized', handleUnauthorized);
    return () => {
      window.removeEventListener('auth:unauthorized', handleUnauthorized);
    };
  }, []);

  const value = {
    user,
    token,
    isAuthenticated: Boolean(token && user),
    loading,
    login,
    register,
    logout
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
}

export default AuthProvider;
