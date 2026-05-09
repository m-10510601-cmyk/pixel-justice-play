import { useState } from "react";
import { useSettings } from "@/game/SettingsContext";
import BackpackModal from "@/components/BackpackModal";

interface Props {
  caseSlug?: string;
  className?: string;
}

const BackpackButton = ({ caseSlug, className = "" }: Props) => {
  const { inventory } = useSettings();
  const [open, setOpen] = useState(false);
  const total = (["gavel", "book", "badge", "scroll", "scales", "robe"] as const).reduce(
    (s, id) => s + (inventory[id] ?? 0),
    0,
  );
  return (
    <>
      <button
        onClick={() => setOpen(true)}
        className={`pixel-btn-square relative ${className}`}
        aria-label="Backpack"
        title="Backpack"
      >
        <span className="text-base leading-none">🎒</span>
        <span className="absolute -top-1 -right-1 pixel text-[8px] bg-accent text-accent-foreground px-1 border border-primary">
          {total}
        </span>
      </button>
      <BackpackModal open={open} onClose={() => setOpen(false)} caseSlug={caseSlug} />
    </>
  );
};

export default BackpackButton;