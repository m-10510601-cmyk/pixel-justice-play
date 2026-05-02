import React from "react";
import { useEffect, useMemo, useRef, useState } from "react";

type EvidenceCommon = {
  id?: string;
  detail?: string;
  tags?: string[];
  title?: string;
};

export type EvidenceItem = EvidenceCommon &
  (
    | { type: "cctv"; label: string; status?: "offline" | "tampered" | "ok" }
    | { type: "phone"; label: string; status?: "deleted" | "ok" }
    | { type: "chat"; from: "A" | "B" | "C"; text: string }
    | { type: "video"; label: string }
    | { type: "list"; text: string }
    | { type: "note"; text: string }
  );

interface Props {
  title: string;
  items: EvidenceItem[];
  highlightIds?: string[];
  highlightTags?: string[];
  defaultOpen?: boolean;
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

const ChatBubble = ({ from, text }: { from: "A" | "B" | "C"; text: React.ReactNode }) => {
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

const CCTVCard = ({ label, status = "offline" }: { label: React.ReactNode; status?: string }) => (
  <div className="border-2 border-primary bg-black/80 p-2 relative" style={{ boxShadow: "inset 0 0 0 2px hsl(0 0% 10%), 2px 2px 0 hsl(0 0% 0%)" }}>
    <div className="flex items-center justify-between pixel text-[8px] text-primary/80">
      <span>● CCTV-03</span>
      <span className={status === "ok" ? "text-primary" : "text-destructive"}>
        ⚠ {status?.toUpperCase()}
      </span>
    </div>
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

const PhoneCard = ({ label, status = "deleted" }: { label: React.ReactNode; status?: string }) => (
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

const VideoCard = ({ label }: { label: React.ReactNode }) => (
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

const ListItem = ({ text }: { text: React.ReactNode }) => (
  <div className="flex items-start gap-2 border-l-4 border-accent pl-2 py-1 bg-background/60">
    <span className="pixel text-[10px] text-accent mt-0.5">▸</span>
    <p className="text-sm leading-snug">{text}</p>
  </div>
);

const StickyNote = ({ text }: { text: React.ReactNode }) => (
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
    <div
      aria-hidden
      className="absolute -top-2 left-1/2 -translate-x-1/2 w-10 h-3 opacity-80"
      style={{ background: "hsl(0 0% 95% / 0.7)", boxShadow: "0 1px 0 hsl(0 0% 0% / 0.2)" }}
    />
  </div>
);

type FilterKey = "all" | "cctv" | "phone" | "chat" | "video" | "list" | "note";

const FILTERS: { key: FilterKey; label: string; icon: string }[] = [
  { key: "all", label: "ALL", icon: "▦" },
  { key: "cctv", label: "CCTV", icon: "📷" },
  { key: "phone", label: "PHONE", icon: "📱" },
  { key: "chat", label: "CHAT", icon: "💬" },
  { key: "video", label: "VIDEO", icon: "🎥" },
  { key: "list", label: "LIST", icon: "▸" },
  { key: "note", label: "NOTE", icon: "📝" },
];

const itemSearchText = (it: EvidenceItem): string => {
  switch (it.type) {
    case "cctv":
    case "phone":
    case "video":
      return `${it.type} ${it.label} ${"status" in it ? it.status ?? "" : ""} ${it.detail ?? ""} ${(it.tags ?? []).join(" ")}`;
    case "chat":
      return `chat user ${it.from} ${it.text} ${it.detail ?? ""} ${(it.tags ?? []).join(" ")}`;
    case "list":
    case "note":
      return `${it.type} ${it.text} ${it.detail ?? ""} ${(it.tags ?? []).join(" ")}`;
  }
};

const itemTitle = (it: EvidenceItem): string => {
  if (it.title) return it.title;
  switch (it.type) {
    case "cctv": return `CCTV · ${it.label.slice(0, 40)}`;
    case "phone": return `Phone · ${it.label.slice(0, 40)}`;
    case "video": return `Clip · ${it.label.slice(0, 40)}`;
    case "chat": return `Chat ${it.from} · ${it.text.slice(0, 30)}`;
    case "list": return it.text.slice(0, 50);
    case "note": return `Note · ${it.text.slice(0, 40)}`;
  }
};

const highlight = (text: string, q: string) => {
  if (!q) return text;
  const idx = text.toLowerCase().indexOf(q.toLowerCase());
  if (idx < 0) return text;
  return (
    <>
      {text.slice(0, idx)}
      <mark className="bg-accent/40 text-accent-foreground px-0.5">
        {text.slice(idx, idx + q.length)}
      </mark>
      {text.slice(idx + q.length)}
    </>
  );
};

const isHighlighted = (
  it: EvidenceItem,
  ids: Set<string>,
  tags: Set<string>,
) => {
  if (it.id && ids.has(it.id)) return true;
  if (it.tags && it.tags.some((t) => tags.has(t))) return true;
  return false;
};

const EvidenceBoard = ({ title, items, highlightIds, highlightTags, defaultOpen }: Props) => {
  const [revealed, setRevealed] = useState(!!defaultOpen);
  const [filter, setFilter] = useState<FilterKey>("all");
  const [query, setQuery] = useState("");
  const [expanded, setExpanded] = useState<Record<string, boolean>>({});
  const [pulseOn, setPulseOn] = useState(true);
  const [activeTags, setActiveTags] = useState<Set<string>>(new Set());
  const [linkedOnly, setLinkedOnly] = useState(false);
  const firstHitRef = useRef<HTMLDivElement | null>(null);

  const idSet = useMemo(() => new Set(highlightIds ?? []), [highlightIds]);
  const tagSet = useMemo(() => new Set(highlightTags ?? []), [highlightTags]);
  const hasHighlights = idSet.size > 0 || tagSet.size > 0;

  // Auto-open file + auto-expand highlighted items + scroll into view + pulse
  useEffect(() => {
    if (!hasHighlights) return;
    setRevealed(true);
    const next: Record<string, boolean> = {};
    items.forEach((it, k) => {
      if (isHighlighted(it, idSet, tagSet)) {
        next[it.id ?? `idx-${k}`] = true;
      }
    });
    setExpanded((cur) => ({ ...cur, ...next }));
    setPulseOn(true);
    setLinkedOnly(true);
    const tLinked = window.setTimeout(() => setLinkedOnly(false), 3200);
    const t1 = window.setTimeout(() => {
      firstHitRef.current?.scrollIntoView({ behavior: "smooth", block: "center" });
    }, 80);
    const t2 = window.setTimeout(() => setPulseOn(false), 3200);
    return () => {
      window.clearTimeout(t1);
      window.clearTimeout(t2);
      window.clearTimeout(tLinked);
    };
  }, [highlightIds, highlightTags, items, hasHighlights, idSet, tagSet]);

  const counts = useMemo(() => {
    const c: Record<string, number> = { all: items.length };
    for (const it of items) c[it.type] = (c[it.type] ?? 0) + 1;
    return c;
  }, [items]);

  const visibleFilters = FILTERS.filter((f) => f.key === "all" || (counts[f.key] ?? 0) > 0);

  // Tag counts derived from items
  const tagCounts = useMemo(() => {
    const m = new Map<string, number>();
    for (const it of items) {
      if (!it.tags) continue;
      for (const t of it.tags) m.set(t, (m.get(t) ?? 0) + 1);
    }
    return Array.from(m.entries()).sort((a, b) => b[1] - a[1] || a[0].localeCompare(b[0]));
  }, [items]);

  const linkedCount = useMemo(
    () => items.filter((it) => isHighlighted(it, idSet, tagSet)).length,
    [items, idSet, tagSet],
  );

  const toggleTag = (t: string) => {
    setActiveTags((cur) => {
      const n = new Set(cur);
      if (n.has(t)) n.delete(t); else n.add(t);
      return n;
    });
  };

  const filtersActive =
    filter !== "all" || !!query || activeTags.size > 0 || linkedOnly;

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    return items.filter((it) => {
      if (filter !== "all" && it.type !== filter) return false;
      if (linkedOnly && !isHighlighted(it, idSet, tagSet)) return false;
      if (activeTags.size > 0) {
        if (!it.tags || !it.tags.some((t) => activeTags.has(t))) return false;
      }
      if (!q) return true;
      return itemSearchText(it).toLowerCase().includes(q);
    });
  }, [items, filter, query, activeTags, linkedOnly, idSet, tagSet]);

  const highlightedItems = useMemo(
    () => items.filter((it) => isHighlighted(it, idSet, tagSet)),
    [items, idSet, tagSet],
  );

  const expandableCount = items.filter((it) => !!it.detail).length;
  const allExpanded =
    expandableCount > 0 &&
    items.every((it, k) => !it.detail || expanded[it.id ?? `idx-${k}`]);

  const toggleAll = () => {
    if (allExpanded) {
      setExpanded({});
    } else {
      const next: Record<string, boolean> = {};
      items.forEach((it, k) => {
        if (it.detail) next[it.id ?? `idx-${k}`] = true;
      });
      setExpanded(next);
    }
  };

  let firstHitAssigned = false;

  return (
    <div className="relative border-2 border-accent bg-background/85 p-3 space-y-3"
      style={{ boxShadow: "var(--shadow-pixel)" }}
    >
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
        <div className="space-y-3 animate-fade-in">
          {/* Highlight banner */}
          {hasHighlights && highlightedItems.length > 0 && (
            <div
              className="border-2 border-primary bg-primary/15 p-2 animate-fade-in"
              style={{ boxShadow: "2px 2px 0 hsl(0 0% 0%)" }}
            >
              <div className="pixel text-[9px] text-primary mb-1">
                🔦 EVIDENCE LINKED TO YOUR CHOICE
              </div>
              <div className="flex flex-wrap gap-1">
                {highlightedItems.map((it, k) => (
                  <span
                    key={k}
                    className="pixel text-[8px] px-2 py-0.5 border border-primary text-primary bg-background/50"
                  >
                    {itemTitle(it)}
                  </span>
                ))}
              </div>
            </div>
          )}

          {/* Search bar */}
          <div className="relative">
            <span className="absolute left-2 top-1/2 -translate-y-1/2 pixel text-[10px] text-accent">🔍</span>
            <input
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="SEARCH EVIDENCE…"
              className="w-full pl-7 pr-8 py-2 bg-card/80 border-2 border-accent text-sm pixel text-[10px] placeholder:text-accent/50 focus:outline-none focus:border-primary"
              style={{ boxShadow: "inset 2px 2px 0 hsl(0 0% 0% / 0.3)" }}
            />
            {query && (
              <button
                onClick={() => setQuery("")}
                className="absolute right-2 top-1/2 -translate-y-1/2 pixel text-[10px] text-destructive"
                aria-label="Clear search"
              >
                ✕
              </button>
            )}
          </div>

          {/* TYPE chips */}
          <div className="flex flex-wrap items-center gap-1">
            <span className="pixel text-[8px] text-accent/70 mr-1 w-10">TYPE</span>
            {visibleFilters.map((f) => {
              const active = filter === f.key;
              const n = counts[f.key] ?? 0;
              return (
                <button
                  key={f.key}
                  onClick={() => setFilter(f.key)}
                  className={`pixel text-[9px] px-2 py-1 border-2 transition-colors ${
                    active
                      ? "bg-accent text-accent-foreground border-accent"
                      : "bg-card/60 text-foreground/80 border-primary/40 hover:border-accent"
                  }`}
                  style={{ boxShadow: active ? "2px 2px 0 hsl(0 0% 0%)" : undefined }}
                >
                  {f.icon} {f.label} <span className="opacity-70">[{n}]</span>
                </button>
              );
            })}
          </div>

          {/* TAG chips */}
          {tagCounts.length > 0 && (
            <div className="flex flex-wrap items-center gap-1">
              <span className="pixel text-[8px] text-accent/70 mr-1 w-10">TAGS</span>
              {tagCounts.map(([t, n]) => {
                const active = activeTags.has(t);
                return (
                  <button
                    key={t}
                    onClick={() => toggleTag(t)}
                    className={`pixel text-[9px] px-2 py-1 border-2 transition-colors ${
                      active
                        ? "bg-primary text-primary-foreground border-primary"
                        : "bg-card/60 text-foreground/80 border-primary/40 hover:border-primary"
                    }`}
                    style={{ boxShadow: active ? "2px 2px 0 hsl(0 0% 0%)" : undefined }}
                    aria-pressed={active}
                  >
                    #{t} <span className="opacity-70">[{n}]</span>
                  </button>
                );
              })}
              {activeTags.size > 0 && (
                <button
                  onClick={() => setActiveTags(new Set())}
                  className="pixel text-[8px] text-destructive underline ml-1"
                >
                  CLEAR
                </button>
              )}
            </div>
          )}

          {/* STATE chip — linked only */}
          {hasHighlights && (
            <div className="flex flex-wrap items-center gap-1">
              <span className="pixel text-[8px] text-accent/70 mr-1 w-10">STATE</span>
              <button
                onClick={() => setLinkedOnly((v) => !v)}
                className={`pixel text-[9px] px-2 py-1 border-2 transition-colors ${
                  linkedOnly
                    ? "bg-primary text-primary-foreground border-primary"
                    : "bg-card/60 text-foreground/80 border-primary/40 hover:border-primary"
                }`}
                style={{ boxShadow: linkedOnly ? "2px 2px 0 hsl(0 0% 0%)" : undefined }}
                aria-pressed={linkedOnly}
              >
                ★ LINKED ONLY <span className="opacity-70">[{linkedCount}]</span>
              </button>
            </div>
          )}

          {/* Results meta */}
          <div className="pixel text-[8px] text-accent/80 flex items-center justify-between gap-2">
            <span>
              SHOWING {filtered.length} / {items.length}
            </span>
            <div className="flex items-center gap-2">
              {expandableCount > 0 && (
                <button
                  onClick={toggleAll}
                  className="pixel text-[8px] text-primary underline"
                >
                  {allExpanded ? "COLLAPSE ALL" : "EXPAND ALL"}
                </button>
              )}
              {filtersActive && (
                <button
                  onClick={() => {
                    setFilter("all");
                    setQuery("");
                    setActiveTags(new Set());
                    setLinkedOnly(false);
                  }}
                  className="pixel text-[8px] text-primary underline"
                >
                  RESET
                </button>
              )}
            </div>
          </div>

          {/* Filtered items */}
          {filtered.length === 0 ? (
            <div className="border-2 border-dashed border-accent/50 bg-card/40 py-6 text-center px-3">
              <div className="pixel text-[10px] text-accent/70">∅ NO MATCHING EVIDENCE</div>
              <div className="text-xs text-foreground/60 mt-1">
                {(() => {
                  const parts: string[] = [];
                  if (filter !== "all") parts.push(`type=${filter.toUpperCase()}`);
                  if (activeTags.size > 0) parts.push(`tags=${Array.from(activeTags).map((t) => `#${t}`).join(" ")}`);
                  if (linkedOnly) parts.push("linked only");
                  if (query) parts.push(`search="${query}"`);
                  return parts.length ? `Active filters → ${parts.join(" · ")}` : "Try another filter or term.";
                })()}
              </div>
            </div>
          ) : (
            <div className="space-y-2">
              {filtered.map((it, k) => {
                const key = it.id ?? `idx-${k}`;
                const hit = isHighlighted(it, idSet, tagSet);
                const isOpen = !!expanded[key];
                const setOpen = (v: boolean) =>
                  setExpanded((cur) => ({ ...cur, [key]: v }));

                let inner: React.ReactNode = null;
                switch (it.type) {
                  case "cctv":
                    inner = <CCTVCard label={highlight(it.label, query) as any} status={it.status} />;
                    break;
                  case "phone":
                    inner = <PhoneCard label={highlight(it.label, query) as any} status={it.status} />;
                    break;
                  case "chat":
                    inner = <ChatBubble from={it.from} text={highlight(it.text, query) as any} />;
                    break;
                  case "video":
                    inner = <VideoCard label={highlight(it.label, query) as any} />;
                    break;
                  case "list":
                    inner = <ListItem text={highlight(it.text, query) as any} />;
                    break;
                  case "note":
                    inner = <StickyNote text={highlight(it.text, query) as any} />;
                    break;
                }

                const refCb =
                  hit && !firstHitAssigned
                    ? (el: HTMLDivElement | null) => {
                        firstHitRef.current = el;
                      }
                    : undefined;
                if (hit && !firstHitAssigned) firstHitAssigned = true;

                return (
                  <div
                    key={key}
                    ref={refCb}
                    data-evidence-id={it.id}
                    className={
                      hit
                        ? `relative rounded-sm ring-2 ring-primary ring-offset-2 ring-offset-background ${
                            pulseOn ? "animate-pulse" : ""
                          }`
                        : ""
                    }
                  >
                    {hit && (
                      <span
                        className="pixel text-[8px] absolute -top-2 left-2 z-10 px-1 bg-primary text-primary-foreground"
                        style={{ boxShadow: "1px 1px 0 hsl(0 0% 0%)" }}
                      >
                        ★ LINKED
                      </span>
                    )}
                    {inner}

                    {it.detail && (
                      <div className="mt-1">
                        <button
                          onClick={() => setOpen(!isOpen)}
                          className="pixel text-[9px] text-accent flex items-center gap-1 hover:text-primary"
                          aria-expanded={isOpen}
                        >
                          <span>{isOpen ? "▾" : "▸"}</span>
                          <span>{isOpen ? "HIDE DETAIL" : "EXPAND DETAIL"}</span>
                        </button>
                        {isOpen && (
                          <div className="mt-1 border-l-4 border-primary bg-card/70 px-2 py-1 animate-fade-in">
                            <p className="text-xs leading-snug text-foreground/90">
                              {it.detail}
                            </p>
                            {it.tags && it.tags.length > 0 && (
                              <div className="flex flex-wrap gap-1 mt-1">
                                {it.tags.map((t) => {
                                  const filterActive = activeTags.has(t);
                                  const linked = tagSet.has(t);
                                  return (
                                    <button
                                      key={t}
                                      onClick={() => toggleTag(t)}
                                      title={filterActive ? `Click to remove #${t} filter` : `Click to filter by #${t}`}
                                      className={`pixel text-[8px] px-1 border transition-colors ${
                                        filterActive
                                          ? "border-primary bg-primary text-primary-foreground"
                                          : linked
                                            ? "border-primary text-primary hover:bg-primary/15"
                                            : "border-accent/60 text-accent/80 hover:border-primary hover:text-primary"
                                      }`}
                                    >
                                      #{t}
                                    </button>
                                  );
                                })}
                              </div>
                            )}
                          </div>
                        )}
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default EvidenceBoard;
