import type { AuthUser } from "@/data/types";
import { getProfile, login as apiLogin, register as apiRegister } from "@/lib/api";

interface AuthState {
  user: AuthUser | null;
  loading: boolean;
  error: string | null;
}

let state: AuthState = {
  user: null,
  loading: false,
  error: null,
};

let listeners: Array<() => void> = [];
let hasLoaded = false;

const setState = (patch: Partial<AuthState>) => {
  state = { ...state, ...patch };
  listeners.forEach((l) => l());
};

export const subscribe = (listener: () => void) => {
  listeners.push(listener);
  return () => {
    listeners = listeners.filter((l) => l !== listener);
  };
};

export const getSnapshot = () => state;

const getToken = () => {
  if (typeof window === "undefined") return null;
  return window.localStorage.getItem("token");
};

const setToken = (token: string) => {
  if (typeof window === "undefined") return;
  window.localStorage.setItem("token", token);
};

export const clearToken = () => {
  if (typeof window === "undefined") return;
  window.localStorage.removeItem("token");
};

export const loadProfile = async () => {
  const token = getToken();
  if (!token) {
    setState({ user: null, loading: false });
    hasLoaded = true;
    return;
  }

  setState({ loading: true, error: null });
  try {
    const user = await getProfile();
    setState({ user, loading: false, error: null });
  } catch (err) {
    clearToken();
    setState({ user: null, loading: false, error: err instanceof Error ? err.message : "Failed to load profile" });
  } finally {
    hasLoaded = true;
  }
};

export const ensureAuthLoaded = () => {
  if (!hasLoaded && !state.loading) {
    void loadProfile();
  }
};

export const login = async (email: string, password: string) => {
  setState({ loading: true, error: null });
  try {
    const auth = await apiLogin(email, password);
    setToken(auth.token);
    setState({ user: auth.user, loading: false, error: null });
    hasLoaded = true;
    return auth.user;
  } catch (err) {
    setState({ loading: false, error: err instanceof Error ? err.message : "Login failed" });
    throw err;
  }
};

export const register = async (payload: { name: string; email: string; password: string; department?: string }) => {
  setState({ loading: true, error: null });
  try {
    const auth = await apiRegister(payload);
    setToken(auth.token);
    setState({ user: auth.user, loading: false, error: null });
    hasLoaded = true;
    return auth.user;
  } catch (err) {
    setState({ loading: false, error: err instanceof Error ? err.message : "Signup failed" });
    throw err;
  }
};

export const logout = () => {
  clearToken();
  setState({ user: null, loading: false, error: null });
};
