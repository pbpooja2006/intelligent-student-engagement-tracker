import type { Notification, Student, StudentStats } from "@/data/types";
import {
  createStudent as apiCreateStudent,
  deleteStudent as apiDeleteStudent,
  getNotifications,
  getStudents,
  markAllNotificationsRead as apiMarkAllNotificationsRead,
  markNotificationRead as apiMarkNotificationRead,
} from "@/lib/api";

interface StoreState {
  students: Student[];
  notifications: Notification[];
  stats: StudentStats;
  loading: boolean;
  error: string | null;
}

let state: StoreState = {
  students: [],
  notifications: [],
  stats: { advanced: 0, intermediate: 0, foundational: 0, all: 0 },
  loading: false,
  error: null,
};

let hasLoaded = false;
let listeners: Array<() => void> = [];

const computeStats = (students: Student[]): StudentStats => ({
  advanced: students.filter((s) => s.classification === "advanced").length,
  intermediate: students.filter((s) => s.classification === "intermediate").length,
  foundational: students.filter((s) => s.classification === "foundational").length,
  all: students.length,
});

const setState = (patch: Partial<StoreState>) => {
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

export const refresh = async () => {
  setState({ loading: true, error: null });
  try {
    const [students, notifications] = await Promise.all([getStudents(), getNotifications()]);
    setState({
      students,
      notifications,
      stats: computeStats(students),
      loading: false,
      error: null,
    });
    hasLoaded = true;
  } catch (err) {
    setState({ loading: false, error: err instanceof Error ? err.message : "Failed to load data" });
  }
};

export const ensureLoaded = () => {
  if (!hasLoaded && !state.loading) {
    void refresh();
  }
};

export const addStudent = async (payload: Omit<Student, "id">) => {
  const student = await apiCreateStudent(payload);
  await refresh();
  return student;
};

export const removeStudent = async (id: string) => {
  await apiDeleteStudent(id);
  await refresh();
};

export const markNotificationRead = async (id: string) => {
  await apiMarkNotificationRead(id);
  await refresh();
};

export const markAllNotificationsRead = async () => {
  await apiMarkAllNotificationsRead();
  await refresh();
};