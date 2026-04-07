import { useEffect, useSyncExternalStore } from "react";
import { ensureAuthLoaded, getSnapshot, subscribe } from "@/data/authStore";

export function useAuthStore() {
  const snapshot = useSyncExternalStore(subscribe, getSnapshot, getSnapshot);

  useEffect(() => {
    ensureAuthLoaded();
  }, []);

  return snapshot;
}