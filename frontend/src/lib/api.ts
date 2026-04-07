import type { AuthUser, Notification, Student } from "@/data/types";
import API_BASE_URL from "@/api/config";

const buildUrl = (path: string) => {
  const baseRaw = API_BASE_URL.replace(/\/$/, "");
  const next = path.startsWith("/") ? path : `/${path}`;
  if (baseRaw.endsWith("/api") && next.startsWith("/api/")) {
    return `${baseRaw}${next.slice(4)}`;
  }
  return `${baseRaw}${next}`;
};

const getAuthHeader = () => {
  if (typeof window === "undefined") return {};
  const token = window.localStorage.getItem("token");
  return token ? { Authorization: `Bearer ${token}` } : {};
};

async function request<T>(path: string, options: RequestInit = {}): Promise<T> {
  const res = await fetch(buildUrl(path), {
    ...options,
    headers: {
      "Content-Type": "application/json",
      ...getAuthHeader(),
      ...(options.headers || {}),
    },
  });

  const text = await res.text();
  const data = text ? JSON.parse(text) : null;

  if (!res.ok) {
    const message = data?.error || data?.message || `Request failed (${res.status})`;
    throw new Error(message);
  }

  return data as T;
}

export async function getStudents(filters: Record<string, string> = {}) {
  const params = new URLSearchParams();
  Object.entries(filters).forEach(([key, value]) => {
    if (value) params.append(key, value);
  });
  const query = params.toString();
  const path = query ? `/api/students?${query}` : "/api/students";
  const res = await request<{ data: Student[] }>(path);
  return res.data || [];
}

export async function getStudentById(id: string) {
  const res = await request<{ data: Student }>(`/api/students/${id}`);
  return res.data;
}

export async function createStudent(payload: Omit<Student, "id">) {
  const res = await request<{ data: Student }>("/api/students", {
    method: "POST",
    body: JSON.stringify(payload),
  });
  return res.data;
}

export async function updateStudent(id: string, payload: Partial<Student>) {
  const res = await request<{ data: Student }>(`/api/students/${id}`, {
    method: "PUT",
    body: JSON.stringify(payload),
  });
  return res.data;
}

export async function deleteStudent(id: string) {
  await request<{ data: string }>(`/api/students/${id}`, { method: "DELETE" });
}

export async function getNotifications() {
  const res = await request<{ data: Notification[] }>("/api/notifications");
  return (res.data || []).map((n) => ({
    ...n,
    timestamp: new Date(n.timestamp),
  }));
}

export async function markNotificationRead(id: string) {
  const res = await request<{ data: Notification }>(`/api/notifications/${id}/read`, { method: "PATCH" });
  return { ...res.data, timestamp: new Date(res.data.timestamp) };
}

export async function markAllNotificationsRead() {
  await request<{ data: string }>("/api/notifications/read-all", { method: "PATCH" });
}

export interface AuthResponse {
  user: AuthUser;
  token: string;
}

export async function login(email: string, password: string) {
  const res = await request<{ data: AuthResponse }>("/api/auth/login", {
    method: "POST",
    body: JSON.stringify({ email, password }),
  });
  return res.data;
}

export async function register(payload: {
  name: string;
  email: string;
  password: string;
  department?: string;
}) {
  const res = await request<{ data: AuthResponse }>("/api/auth/register", {
    method: "POST",
    body: JSON.stringify(payload),
  });
  return res.data;
}

export async function getProfile() {
  const res = await request<{ data: AuthUser }>("/api/auth/profile");
  return res.data;
}
