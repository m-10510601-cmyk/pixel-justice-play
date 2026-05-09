import { useEffect, useState } from "react";

const AutoSaveIndicator = () => {
  const [show, setShow] = useState(false);
  useEffect(() => {
    let timer: ReturnType<typeof setTimeout> | null = null;
    const onSaved = () => {
      setShow(true);
      if (timer) clearTimeout(timer);
      timer = setTimeout(() => setShow(false), 1200);
    };
    window.addEventListener("lg:autosaved", onSaved);
    return () => {
      window.removeEventListener("lg:autosaved", onSaved);
      if (timer) clearTimeout(timer);
    };
  }, []);
  if (!show) return null;
  return (
    <div
      className="pixel text-[9px] fixed top-2 right-2 z-[200] bg-background/80 border border-primary text-primary px-2 py-1 pointer-events-none animate-pulse"
      aria-live="polite"
    >
      ✓ AUTO-SAVED
    </div>
  );
};

export default AutoSaveIndicator;