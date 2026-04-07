import { useSyncExternalStore, useEffect } from 'react';
import { getStudents, getNotifications, getClassificationStats, subscribe, getMeta, loadAll } from '@/data/mockData';

export function useStudentStore() {
  const students = useSyncExternalStore(subscribe, getStudents, getStudents);
  const notifications = useSyncExternalStore(subscribe, getNotifications, getNotifications);
  const stats = useSyncExternalStore(subscribe, getClassificationStats, getClassificationStats);
  const meta = useSyncExternalStore(subscribe, getMeta, getMeta);

  useEffect(() => {
    if (!meta.initialized) {
      loadAll();
    }
  }, [meta.initialized]);

  return { students, notifications, stats, loading: meta.loading, error: meta.error };
}
