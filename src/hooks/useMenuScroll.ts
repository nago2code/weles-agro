import { useEffect, useRef, type MouseEvent } from "react";
import { animate, type AnimationPlaybackControls } from "framer-motion";
import { motionEase, useMotionSettings } from "../lib/motion";

export function useMenuScroll() {
  const { reduced } = useMotionSettings();
  const running = useRef<AnimationPlaybackControls | null>(null);
  useEffect(() => {
    const stop = () => running.current?.stop();
    const onKey = (event: KeyboardEvent) => {
      if (["Escape", "PageDown", "PageUp", "Home", "End", "ArrowDown", "ArrowUp", " "].includes(event.key)) stop();
    };
    window.addEventListener("wheel", stop, { passive: true });
    window.addEventListener("touchstart", stop, { passive: true });
    window.addEventListener("keydown", onKey);
    return () => {
      stop();
      window.removeEventListener("wheel", stop);
      window.removeEventListener("touchstart", stop);
      window.removeEventListener("keydown", onKey);
    };
  }, []);
  return (event: MouseEvent<HTMLAnchorElement>) => {
    if (event.button !== 0 || event.metaKey || event.ctrlKey || event.shiftKey || event.altKey) return;
    const url = new URL(event.currentTarget.href);
    if (url.pathname !== window.location.pathname || !url.hash) return;
    const target = document.getElementById(decodeURIComponent(url.hash.slice(1)));
    if (!target) return;
    event.preventDefault();
    running.current?.stop();
    const headerHeight = document.querySelector(".header-inner")?.getBoundingClientRect().height ?? 68;
    const end = Math.max(0, Math.min(
      window.scrollY + target.getBoundingClientRect().top - headerHeight - 20,
      document.documentElement.scrollHeight - window.innerHeight,
    ));
    if (window.location.hash !== url.hash) history.pushState(null, "", url.hash);
    if (reduced) {
      window.scrollTo({ top: end, behavior: "instant" });
      return;
    }
    running.current = animate(window.scrollY, end, {
      duration: Math.min(1.05, 0.5 + Math.abs(end - window.scrollY) / 10000),
      ease: motionEase,
      onUpdate: top => window.scrollTo({ top, behavior: "instant" }),
    });
  };
}
