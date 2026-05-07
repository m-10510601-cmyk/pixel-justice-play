import { useEffect, useRef } from "react";
import { useLocation } from "react-router-dom";
import { useSettings } from "@/game/SettingsContext";

const TRACKS = {
  menu: "/music/menu.mp3",
  quest: "/music/quest.mp3",
  courtroom: "/music/courtroom.mp3",
  tense: "/music/story-tense.mp3",
  mystery: "/music/story-mystery.mp3",
  somber: "/music/story-somber.mp3",
} as const;

type TrackKey = keyof typeof TRACKS;

function trackForPath(pathname: string): TrackKey {
  if (pathname.startsWith("/case/")) return "courtroom";
  if (pathname === "/quest") return "quest";
  if (pathname.startsWith("/story/")) {
    const slug = pathname.replace("/story/", "");
    if (["silent-fall", "silent-dormitory", "dark-night"].includes(slug)) return "tense";
    if (["green-trade", "mask-of-authority", "the-runner"].includes(slug)) return "mystery";
    if (["silent-room", "ritual-of-power", "high-pay-trap"].includes(slug)) return "somber";
  }
  return "menu";
}

const BgmController = () => {
  const { volume, bgmEnabled } = useSettings();
  const { pathname } = useLocation();
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const currentRef = useRef<TrackKey | null>(null);
  const fadeRafRef = useRef<number | null>(null);

  // Lazily create the audio element once
  if (typeof window !== "undefined" && !audioRef.current) {
    const a = new Audio();
    a.loop = true;
    a.preload = "auto";
    a.volume = 0;
    audioRef.current = a;
  }

  const targetVolume = bgmEnabled ? Math.min(1, (volume / 100) * 0.5) : 0;

  // Cross-fade utility
  const fadeTo = (target: number, ms = 400, onDone?: () => void) => {
    const a = audioRef.current;
    if (!a) return;
    if (fadeRafRef.current) cancelAnimationFrame(fadeRafRef.current);
    const start = a.volume;
    const t0 = performance.now();
    const step = (now: number) => {
      const k = Math.min(1, (now - t0) / ms);
      a.volume = Math.min(1, Math.max(0, start + (target - start) * k));
      if (k < 1) fadeRafRef.current = requestAnimationFrame(step);
      else { fadeRafRef.current = null; onDone?.(); }
    };
    fadeRafRef.current = requestAnimationFrame(step);
  };

  // Switch tracks on route change
  useEffect(() => {
    const a = audioRef.current;
    if (!a) return;
    const next = trackForPath(pathname);
    if (currentRef.current === next) return;
    const swap = () => {
      currentRef.current = next;
      a.src = TRACKS[next];
      a.volume = 0;
      const tryPlay = () => a.play().catch(() => {
        // Autoplay blocked: wait for first user interaction
        const resume = () => {
          a.play().finally(() => {
            window.removeEventListener("pointerdown", resume);
            window.removeEventListener("keydown", resume);
          });
        };
        window.addEventListener("pointerdown", resume, { once: true });
        window.addEventListener("keydown", resume, { once: true });
      });
      tryPlay();
      fadeTo(targetVolume);
    };
    if (currentRef.current === null) swap();
    else fadeTo(0, 300, swap);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [pathname]);

  // React to volume / bgmEnabled changes
  useEffect(() => {
    const a = audioRef.current;
    if (!a) return;
    if (!bgmEnabled || volume === 0) {
      fadeTo(0, 250, () => a.pause());
    } else {
      if (a.paused) a.play().catch(() => {});
      fadeTo(targetVolume, 250);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [bgmEnabled, volume]);

  return null;
};

export default BgmController;