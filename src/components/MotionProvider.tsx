import { createContext, useContext, useEffect, useState, type ReactNode } from "react";
import { MotionConfig, useReducedMotion } from "framer-motion";
const STORAGE_KEY = "weles-motion-preference";
type Preference = "system" | "full" | "reduced";
const MotionPreference = createContext({ reduced: false, toggle: () => {} });
export const useMotionPreference = () => useContext(MotionPreference);
export function MotionProvider({ children }: { children: ReactNode }) {
  const systemReduced = useReducedMotion();
  const [preference, setPreference] = useState<Preference>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      return saved === "full" || saved === "reduced" ? saved : "system";
    } catch { return "system"; }
  });
  const reduced = preference === "system" ? Boolean(systemReduced) : preference === "reduced";
  useEffect(() => {
    document.documentElement.dataset.motion = reduced ? "reduced" : "full";
  }, [reduced]);
  function toggle() {
    const next = reduced ? "full" : "reduced";
    setPreference(next);
    try { localStorage.setItem(STORAGE_KEY, next); } catch { /* Preference still works for this visit. */ }
  }
  return <MotionPreference.Provider value={{ reduced, toggle }}>
    <MotionConfig reducedMotion={reduced ? "always" : "never"} transition={{ duration: 0.28, ease: [0.16, 1, 0.3, 1] }}>{children}</MotionConfig>
  </MotionPreference.Provider>;
}
