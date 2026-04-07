import { api } from '@/lib/api';

export const departments = [
  'Computer Science & Engineering',
  'Information Technology',
  'Electronics & Communication',
  'Electrical Engineering',
  'Mechanical Engineering',
  'Civil Engineering',
  'Chemical Engineering',
  'Biotechnology',
  'Mathematics',
  'Physics'
];

export const years = ['1st Year', '2nd Year', '3rd Year', '4th Year'];

export type Classification = 'advanced' | 'intermediate' | 'foundational';

export interface Student {
  id: string;
  name: string;
  department: string;
  year: string;
  classification: Classification;
  mentor: string;
  warden: string;
  residenceType: 'Hosteller' | 'Day Scholar';
  attendance: {
    percentage: number;
    presentDays: number;
    totalDays: number;
    leaveCount: number;
  };
  academics: {
    semesters: { sem: number; sgpa: number }[];
    cgpa: number;
  };
  platforms: {
    github?: string;
    leetcode?: string;
    codeforces?: string;
    hackerrank?: string;
    linkedin?: string;
  };
  skills: string[];
  trainings: string[];
  skillsToLearn: string[];
  rewardPoints: number;
  activityPoints: number;
  engagementLevel: 'High' | 'Medium' | 'Low';
  email: string;
  phone: string;
  rollNo: string;
}

export interface Notification {
  id: string;
  type: 'inactive' | 'drop' | 'info';
  message: string;
  studentName: string;
  department: string;
  timestamp: Date;
  read: boolean;
}

export interface Educator {
  name: string;
  email: string;
  department: string;
  designation: string;
  isMentor: boolean;
  mentorId: string;
}

type StoreMeta = {
  loading: boolean;
  error: string | null;
  initialized: boolean;
};

let _students: Student[] = [];
let _notifications: Notification[] = [];
let _listeners: (() => void)[] = [];
let _stats = computeStats();
let _meta: StoreMeta = { loading: false, error: null, initialized: false };
let _loadPromise: Promise<void> | null = null;

export function subscribe(listener: () => void) {
  _listeners.push(listener);
  return () => {
    _listeners = _listeners.filter((l) => l !== listener);
  };
}

function notify() {
  _stats = computeStats();
  _listeners.forEach((l) => l());
}

function normalizeNotifications(notifications: Notification[]) {
  return notifications.map((n) => ({
    ...n,
    timestamp: n.timestamp ? new Date(n.timestamp) : new Date()
  }));
}

export function getStudents() {
  return _students;
}

export function getNotifications() {
  return _notifications;
}

export function getMeta() {
  return _meta;
}

export const getStudentsByClassification = (c: Classification) => _students.filter((s) => s.classification === c);
export const getStudentsByDeptAndYear = (dept: string, year: string, classification?: Classification) =>
  _students.filter((s) => s.department === dept && s.year === year && (!classification || s.classification === classification));
export const getStudentById = (id: string) => _students.find((s) => s.id === id);

function computeStats() {
  return {
    advanced: _students.filter((s) => s.classification === 'advanced').length,
    intermediate: _students.filter((s) => s.classification === 'intermediate').length,
    foundational: _students.filter((s) => s.classification === 'foundational').length,
    all: _students.length
  };
}

export function getClassificationStats() {
  return _stats;
}

export const classificationLabels: Record<string, string> = {
  advanced: 'Advanced',
  intermediate: 'Intermediate',
  foundational: 'Foundational',
  all: 'All Students'
};

export async function loadAll() {
  if (_loadPromise) return _loadPromise;
  _meta = { ..._meta, loading: true, error: null };
  notify();

  _loadPromise = (async () => {
    try {
      const [students, notifications] = await Promise.all([
        api.get<Student[]>('/students'),
        api.get<Notification[]>('/notifications')
      ]);
      _students = students;
      _notifications = normalizeNotifications(notifications);
      _meta = { ..._meta, loading: false, initialized: true };
    } catch (err) {
      _meta = {
        ..._meta,
        loading: false,
        initialized: true,
        error: err instanceof Error ? err.message : 'Failed to load data'
      };
    } finally {
      _loadPromise = null;
      notify();
    }
  })();

  return _loadPromise;
}

export async function refreshStudents() {
  try {
    const students = await api.get<Student[]>('/students');
    _students = students;
    notify();
  } catch (err) {
    _meta = { ..._meta, error: err instanceof Error ? err.message : 'Failed to refresh students' };
    notify();
  }
}

export async function refreshNotifications() {
  try {
    const notifications = await api.get<Notification[]>('/notifications');
    _notifications = normalizeNotifications(notifications);
    notify();
  } catch (err) {
    _meta = { ..._meta, error: err instanceof Error ? err.message : 'Failed to refresh notifications' };
    notify();
  }
}

export async function addStudent(student: Omit<Student, 'id'>) {
  const created = await api.post<Student>('/students', student);
  _students = [created, ..._students];
  notify();
  return created;
}

export async function deleteStudent(id: string) {
  await api.delete(`/students/${id}`);
  const student = _students.find((s) => s.id === id);
  _students = _students.filter((s) => s.id !== id);
  notify();
  return student;
}

export async function addNotification(notif: Omit<Notification, 'id'>) {
  const created = await api.post<Notification>('/notifications', {
    ...notif,
    timestamp: notif.timestamp
  });
  _notifications = [normalizeNotifications([created])[0], ..._notifications];
  notify();
  return created;
}

export async function markNotificationRead(id: string) {
  await api.patch(`/notifications/${id}/read`);
  _notifications = _notifications.map((n) => (n.id === id ? { ...n, read: true } : n));
  notify();
}

export async function markAllNotificationsRead() {
  await api.patch('/notifications/read-all');
  _notifications = _notifications.map((n) => ({ ...n, read: true }));
  notify();
}
