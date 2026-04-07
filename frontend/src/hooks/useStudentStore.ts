import { useEffect, useSyncExternalStore } from "react";
import { ensureLoaded, getSnapshot, subscribe } from "@/data/studentStore";

export function useStudentStore() {
  const snapshot = useSyncExternalStore(subscribe, getSnapshot, getSnapshot);

  useEffect(() => {
    ensureLoaded();
  }, []);

  return snapshot;
}
