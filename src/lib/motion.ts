import { useMotionPreference } from "../components/MotionProvider";
export const motionEase = [0.16, 1, 0.3, 1] as const;
export function useMotionSettings() {
  const { reduced } = useMotionPreference();
  return {
    reduced: Boolean(reduced),
    enter: { opacity: 1, y: 0 },
    from: { opacity: 0.35, y: reduced ? 0 : 14 },
    transition: { duration: reduced ? 0.12 : 0.32, ease: motionEase },
  };
}
