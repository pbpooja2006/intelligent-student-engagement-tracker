import { useSyncExternalStore, useCallback } from "react";
import { getStudents, getNotifications, getClassificationStats, subscribe } from "@/data/mockData";

export function useStudentStore() {
  const students = useSyncExternalStore(subscribe, getStudents, getStudents);
  const notifications = useSyncExternalStore(subscribe, getNotifications, getNotifications);
  const stats = useSyncExternalStore(subscribe, getClassificationStats, getClassificationStats);

  return { students, notifications, stats };
}
