import { useMotionPreference } from "../components/MotionProvider";
import { useEffect } from "react";
import { animate, type AnimationPlaybackControls } from "framer-motion";
import { motionEase } from "../lib/motion";

/** Visible HTML remains the fallback; only elements entering view are animated. */
export function usePageMotion() {
  const { reduced } = useMotionPreference();
  useEffect(() => {
    const running = new Set<AnimationPlaybackControls>();
    const observer = new IntersectionObserver((entries) => {
      for (const entry of entries) {
        if (!entry.isIntersecting) continue;
        observer.unobserve(entry.target);
        const controls = animate(entry.target as HTMLElement,
          { opacity: [0.4, 1], y: reduced ? [0, 0] : [18, 0] },
          { duration: reduced ? 0.12 : 0.5, ease: motionEase },
        );
        running.add(controls);
        controls.then(() => running.delete(controls));
      }
    }, { threshold: 0.15 });
    document.querySelectorAll(
      ".hero-copy h1, .hero-actions, .catalog-heading, .section-heading, .buyer-benefits-copy h2, .locations-heading, .contacts-intro, .purchase-intro, .purchase-offer-layout",
    ).forEach(element => observer.observe(element));
    return () => {
      observer.disconnect();
      running.forEach(control => control.complete());
    };
  }, [reduced]);
}
