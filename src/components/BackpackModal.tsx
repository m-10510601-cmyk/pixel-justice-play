import { useSettings, type ItemId } from "@/game/SettingsContext";
import { toast } from "sonner";
import Modal from "@/components/Modal";

const ITEM_META: Record<Exclude<ItemId, "timeExt">, { icon: string; name: string; desc: string }> = {
  gavel: { icon: "⭐", name: "STAR +1", desc: "+1 ★ in this chapter" },
  book: { icon: "📕", name: "LAW BOOK", desc: "Removes one wrong option" },
  badge: { icon: "🛡", name: "BADGE", desc: "Improves defense" },
  scroll: { icon: "📜", name: "SCROLL", desc: "Reveals a hidden hint" },
  scales: { icon: "⚖", name: "XP +50%", desc: "Next chapter XP +50%" },
  robe: { icon: "👘", name: "XP +100%", desc: "Next chapter XP +100%" },
};

const ORDER: Array<keyof typeof ITEM_META> = ["gavel", "book", "scales", "robe", "badge", "scroll"];

interface Props {
  open: boolean;
  onClose: () => void;
  caseSlug?: string;
}

const BackpackModal = ({ open, onClose, caseSlug }: Props) => {
  const { inventory, armItemForCase, getUsedItemsForCase, playCue } = useSettings();
  const usedHere = caseSlug ? getUsedItemsForCase(caseSlug) : [];
  const lockedAll = usedHere.length > 0;
  const totalOwned = ORDER.reduce((s, id) => s + (inventory[id] ?? 0), 0);

  const handleUse = (id: keyof typeof ITEM_META) => {
    if (!caseSlug) return;
    if (armItemForCase(caseSlug, id)) {
      playCue();
      toast(`✓ USED ${ITEM_META[id].name}`);
      onClose();
    } else {
      toast("Cannot use — already used an item this chapter");
    }
  };

  return (
    <Modal open={open} onClose={onClose} title="🎒 BACKPACK">
      <div className="space-y-2">
        {caseSlug && lockedAll && (
          <div className="pixel text-[9px] text-accent border-2 border-accent p-2">
            ITEM ALREADY USED THIS CHAPTER — others locked
          </div>
        )}
        {!caseSlug && (
          <div className="pixel text-[9px] text-primary/80 border-2 border-primary/40 p-2">
            Open inside a chapter to USE items
          </div>
        )}
        {totalOwned === 0 && (
          <div className="pixel text-[9px] text-foreground/70 p-2 text-center">
            Backpack is empty — visit the STORE
          </div>
        )}
        <ul className="space-y-2">
          {ORDER.map((id) => {
            const m = ITEM_META[id];
            const count = inventory[id] ?? 0;
            const usedThis = usedHere.includes(id);
            const canUse = !!caseSlug && count > 0 && !lockedAll;
            return (
              <li
                key={id}
                className={`flex items-center gap-2 border-2 border-primary/50 bg-background/60 p-2 ${count === 0 ? "opacity-50" : ""}`}
              >
                <span className="text-2xl leading-none">{m.icon}</span>
                <div className="flex-1 min-w-0">
                  <div className="pixel text-[10px] text-primary">{m.name} <span className="opacity-70">x{count}</span></div>
                  <div className="text-[10px] opacity-80">{m.desc}</div>
                </div>
                {caseSlug && (
                  usedThis ? (
                    <span className="pixel text-[9px] text-accent border border-accent px-2 py-1">USED</span>
                  ) : (
                    <button
                      onClick={() => handleUse(id)}
                      disabled={!canUse}
                      className="pixel-btn text-[10px] px-2 py-1 disabled:opacity-40 disabled:cursor-not-allowed"
                    >
                      USE
                    </button>
                  )
                )}
              </li>
            );
          })}
        </ul>
      </div>
    </Modal>
  );
};

export default BackpackModal;