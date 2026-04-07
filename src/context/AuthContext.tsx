import { createContext, useContext, useEffect, useMemo, useState } from 'react';
import { api, getAuthToken } from '@/lib/api';

export type AuthUser = {
  id: string;
  name: string;
  email: string;
  role: 'admin' | 'teacher';
  department: string;
  designation: string;
  mentorId: string;
};

type AuthContextValue = {
  user: AuthUser | null;
  loading: boolean;
  error: string | null;
  login: (email: string, password: string) => Promise<void>;
  register: (payload: { name: string; email: string; password: string; department?: string; designation?: string; mentorId?: string }) => Promise<void>;
  logout: () => void;
};

const AuthContext = createContext<AuthContextValue | undefined>(undefined);

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [user, setUser] = useState<AuthUser | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const loadUser = async () => {
      const token = getAuthToken();
      if (!token) {
        setLoading(false);
        return;
      }
      try {
        const me = await api.get<AuthUser>('/auth/me');
        setUser(me);
        setError(null);
      } catch (err) {
        localStorage.removeItem('auth_token');
        setUser(null);
        setError(err instanceof Error ? err.message : 'Failed to load user');
      } finally {
        setLoading(false);
      }
    };
    loadUser();
  }, []);

  const login = async (email: string, password: string) => {
    setLoading(true);
    try {
      const { user: loggedInUser, token } = await api.post<{ user: AuthUser; token: string }>('/auth/login', { email, password });
      localStorage.setItem('auth_token', token);
      setUser(loggedInUser);
      setError(null);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Login failed');
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const register = async (payload: { name: string; email: string; password: string; department?: string; designation?: string; mentorId?: string }) => {
    setLoading(true);
    try {
      const { user: newUser, token } = await api.post<{ user: AuthUser; token: string }>('/auth/register', payload);
      localStorage.setItem('auth_token', token);
      setUser(newUser);
      setError(null);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Registration failed');
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const logout = () => {
    localStorage.removeItem('auth_token');
    setUser(null);
  };

  const value = useMemo<AuthContextValue>(
    () => ({ user, loading, error, login, register, logout }),
    [user, loading, error]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used within AuthProvider');
  return ctx;
};
