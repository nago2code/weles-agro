import { useMotionPreference } from "../components/MotionProvider";
import { useEffect, type RefObject } from "react";
import { animate } from "framer-motion";
import { motionEase } from "../lib/motion";

/** Keep native dialog focus, Escape and focus restoration while animating its surface. */
export function useDialogMotion(ref: RefObject<HTMLDialogElement | null>, open: boolean) {
  const { reduced } = useMotionPreference();
  useEffect(() => {
    const panel = ref.current?.firstElementChild;
    if (!open || !panel) return;
    const control = animate(panel as HTMLElement,
      { opacity: [0.35, 1], y: reduced ? [0, 0] : [20, 0] },
      { duration: reduced ? 0.12 : 0.28, ease: motionEase });
    return () => control.complete();
  }, [open, reduced, ref]);
}
