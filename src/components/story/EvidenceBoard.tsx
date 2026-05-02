import { useState } from "react";

export type EvidenceItem =
  | { type: "cctv"; label: string; status?: "offline" | "tampered" | "ok" }
  | { type: "phone"; label: string; status?: "deleted" | "ok" }
  | { type: "chat"; from: "A" | "B" | "C"; text: string }
  | { type: "video"; label: string }
  | { type: "list"; text: string }
  | { type: "note"; text: string };

interface Props {
  title: string;
  items: EvidenceItem[];
}

const RedactedBar = () => (
  <span
    aria-hidden
    className="inline-block align-middle h-3 w-12 mx-1"
    style={{
      background:
        "repeating-linear-gradient(45deg, hsl(0 0% 0%) 0 4px, hsl(0 80% 35%) 4px 8px)",
    }}
  />
);

const ChatBubble = ({ from, text }: { from: "A" | "B" | "C"; text: string }) => {
  const right = from === "C";
  const colors: Record<string, string> = {
    A: "border-accent bg-accent/15 text-foreground",
    B: "border-primary/70 bg-primary/15 text-foreground",
    C: "border-destructive/70 bg-destructive/15 text-foreground",
  };
  return (
    <div className={`flex ${right ? "justify-end" : "justify-start"}`}>
      <div className={`relative max-w-[80%] border-2 px-2 py-1 ${colors[from]}`}
        style={{ boxShadow: "2px 2px 0 hsl(0 0% 0%)" }}>
        <div className="pixel text-[8px] opacity-70 mb-0.5">USER {from}</div>
        <p className="text-sm leading-snug">{text}</p>
      </div>
    </div>
  );
};

const CCTVCard = ({ label, status = "offline" }: { label: string; status?: string }) => (
  <div className="border-2 border-primary bg-black/80 p-2 relative" style={{ boxShadow: "inset 0 0 0 2px hsl(0 0% 10%), 2px 2px 0 hsl(0 0% 0%)" }}>
    <div className="flex items-center justify-between pixel text-[8px] text-primary/80">
      <span>● CCTV-03</span>
      <span className={status === "ok" ? "text-primary" : "text-destructive"}>
        ⚠ {status?.toUpperCase()}
      </span>
    </div>
    {/* "static" screen */}
    <div
      className="mt-2 h-20 relative overflow-hidden"
      style={{
        background:
          "repeating-linear-gradient(0deg, hsl(0 0% 8%) 0 2px, hsl(0 0% 14%) 2px 4px)",
      }}
    >
      <div className="absolute inset-0 flex items-center justify-center pixel text-[10px] text-destructive/80">
        NO SIGNAL
      </div>
      <div className="absolute bottom-1 right-1 pixel text-[8px] text-primary/70">
        REC ●
      </div>
    </div>
    <p className="text-xs mt-2 text-foreground/90">{label}</p>
  </div>
);

const PhoneCard = ({ label, status = "deleted" }: { label: string; status?: string }) => (
  <div className="border-2 border-accent bg-card/90 p-2" style={{ boxShadow: "2px 2px 0 hsl(0 0% 0%)" }}>
    <div className="flex items-center gap-2 pixel text-[8px] text-accent">
      <span>📱 PHONE FORENSICS</span>
      <span className="ml-auto text-destructive">{status?.toUpperCase()}</span>
    </div>
    <div className="mt-2 grid grid-cols-6 gap-1">
      {Array.from({ length: 18 }).map((_, k) => (
        <div
          key={k}
          className="aspect-square border border-foreground/20"
          style={{
            background:
              k % 4 === 0
                ? "repeating-linear-gradient(45deg, hsl(0 70% 40%) 0 2px, hsl(0 0% 10%) 2px 4px)"
                : "hsl(220 15% 20%)",
          }}
        />
      ))}
    </div>
    <p className="text-xs mt-2 text-foreground/90">{label}</p>
  </div>
);

const VideoCard = ({ label }: { label: string }) => (
  <div className="border-2 border-primary bg-card/90 p-2 flex items-center gap-2" style={{ boxShadow: "2px 2px 0 hsl(0 0% 0%)" }}>
    <div className="w-12 h-12 border-2 border-primary bg-black/70 relative shrink-0 flex items-center justify-center">
      <span className="pixel text-[14px] text-primary">▶</span>
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          background:
            "repeating-linear-gradient(0deg, transparent 0 3px, hsl(0 0% 100% / 0.05) 3px 4px)",
        }}
      />
    </div>
    <div className="flex-1">
      <div className="pixel text-[8px] text-primary/80">CLIP · 00:0{Math.floor(Math.random() * 7) + 2}</div>
      <p className="text-sm leading-snug">{label}</p>
    </div>
  </div>
);

const ListItem = ({ text }: { text: string }) => (
  <div className="flex items-start gap-2 border-l-4 border-accent pl-2 py-1 bg-background/60">
    <span className="pixel text-[10px] text-accent mt-0.5">▸</span>
    <p className="text-sm leading-snug">{text}</p>
  </div>
);

const StickyNote = ({ text }: { text: string }) => (
  <div
    className="relative p-2 mt-2"
    style={{
      background: "hsl(48 90% 70%)",
      color: "hsl(0 0% 10%)",
      boxShadow: "3px 3px 0 hsl(0 0% 0% / 0.5)",
      transform: "rotate(-1deg)",
    }}
  >
    <div className="pixel text-[8px] mb-1 opacity-70">💭 INVESTIGATOR NOTE</div>
    <p className="text-sm italic leading-snug">{text}</p>
    {/* tape */}
    <div
      aria-hidden
      className="absolute -top-2 left-1/2 -translate-x-1/2 w-10 h-3 opacity-80"
      style={{ background: "hsl(0 0% 95% / 0.7)", boxShadow: "0 1px 0 hsl(0 0% 0% / 0.2)" }}
    />
  </div>
);

const EvidenceBoard = ({ title, items }: Props) => {
  const [revealed, setRevealed] = useState(false);

  return (
    <div className="relative border-2 border-accent bg-background/85 p-3 space-y-3"
      style={{ boxShadow: "var(--shadow-pixel)" }}
    >
      {/* file-tab header */}
      <div className="flex items-center justify-between gap-2">
        <div className="flex items-center gap-2">
          <span
            className="pixel text-[8px] px-2 py-1 bg-accent text-accent-foreground"
            style={{ boxShadow: "2px 2px 0 hsl(0 0% 0%)" }}
          >
            CASE FILE
          </span>
          <span className="pixel text-[10px] text-accent">{title}</span>
        </div>
        <span className="pixel text-[8px] text-destructive flex items-center">
          CLASSIFIED <RedactedBar />
        </span>
      </div>

      {!revealed ? (
        <button
          onClick={() => setRevealed(true)}
          className="w-full border-2 border-dashed border-accent/70 bg-card/40 py-6 hover:bg-card/60 transition-colors"
        >
          <div className="pixel text-[10px] text-accent">📂 TAP TO OPEN FILE</div>
          <div className="text-xs text-foreground/70 mt-1">{items.length} items inside</div>
        </button>
      ) : (
        <div className="space-y-2 animate-fade-in">
          {items.map((it, k) => {
            switch (it.type) {
              case "cctv":
                return <CCTVCard key={k} label={it.label} status={it.status} />;
              case "phone":
                return <PhoneCard key={k} label={it.label} status={it.status} />;
              case "chat":
                return <ChatBubble key={k} from={it.from} text={it.text} />;
              case "video":
                return <VideoCard key={k} label={it.label} />;
              case "list":
                return <ListItem key={k} text={it.text} />;
              case "note":
                return <StickyNote key={k} text={it.text} />;
            }
          })}
        </div>
      )}
    </div>
  );
};

export default EvidenceBoard;
