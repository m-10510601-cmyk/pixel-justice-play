import { useMemo, useState } from "react";
import { Link } from "react-router-dom";
import GameFrame from "@/components/GameFrame";
import bg from "@/assets/story-silent-fall.jpg";

/* =====================================================================
 * CHAPTER X · SILENT FALL
 * Unity-style runtime scene engine (DialogueManager + CharacterManager
 * + EvidenceSystem + BranchSystem + LogicEngine), rendered in React.
 *
 * Core rule: VIBE over plot. No obvious right/wrong. Multiple readings.
 * ===================================================================*/

type EvidenceId =
  | "ev_cctv_offline"
  | "ev_phone_wiped"
  | "ev_chat_fragments"
  | "ev_secret_clips"
  | "ev_recovered_video"
  | "ev_online_trace";

type CharId = "principal" | "parent" | "roommate" | "teacher" | "self";

type EmotionalState = "calm" | "defensive" | "emotional" | "unstable" | "neutral";

interface CharacterDef {
  id: CharId;
  name: string;
  baseEmotion: EmotionalState;
  cues: string[];
  color: string; // semantic token class
}

const CHARACTERS: Record<CharId, CharacterDef> = {
  principal: {
    id: "principal",
    name: "PRINCIPAL TAN",
    baseEmotion: "defensive",
    cues: ["measured tone", "avoids the word 'bullying'", "glances at the door"],
    color: "text-primary",
  },
  parent: {
    id: "parent",
    name: "AIRA'S MOTHER",
    baseEmotion: "emotional",
    cues: ["clenched hands", "voice cracks", "leans forward"],
    color: "text-accent",
  },
  roommate: {
    id: "roommate",
    name: "ROOMMATE · MEI",
    baseEmotion: "unstable",
    cues: ["avoids eye contact", "answers a beat too fast", "fidgets with sleeve"],
    color: "text-destructive-foreground",
  },
  teacher: {
    id: "teacher",
    name: "WARDEN CIK NORA",
    baseEmotion: "calm",
    cues: ["folds arms", "pauses before answering", "polite, clipped"],
    color: "text-foreground",
  },
  self: {
    id: "self",
    name: "YOU (INNER)",
    baseEmotion: "neutral",
    cues: ["observes", "weighs"],
    color: "text-muted-foreground",
  },
};

interface DialogueLine {
  who: CharId;
  text: string;
  /** if these evidence ids are present, replace text with this */
  mutateIf?: { has: EvidenceId[]; text: string; emotion?: EmotionalState }[];
  emotion?: EmotionalState;
  bias?: "biased" | "neutral" | "ambiguous";
}

interface Branch {
  id: string;
  label: string;
  /** suspicion deltas applied to characters */
  delta?: Partial<Record<CharId, number>>;
  /** which evidence this path unlocks for next scene */
  unlocks?: EvidenceId[];
  /** narrative path tag */
  path: "trust_school" | "press_roommates" | "follow_digital" | "withhold";
  /** short echo line — never confirms truth */
  echo: string;
}

interface Scene {
  id: string;
  title: string;
  vibe: string[];
  spawnLogic: string;
  spawn: CharId[];
  /** Evidence revealed when scene opens (system-driven) */
  reveal?: EvidenceId[];
  dialogue: DialogueLine[];
  experienceGoal: string;
  branches: Branch[];
}

const EVIDENCE_LABEL: Record<EvidenceId, string> = {
  ev_cctv_offline: "📷 CCTV marked OFFLINE at incident window",
  ev_phone_wiped: "📱 Phone — partial data wiped",
  ev_chat_fragments: "💬 Group chat fragments (ambiguous)",
  ev_secret_clips: "🎥 Secret clips · mocking, light shoves",
  ev_recovered_video: "🧩 Recovered clip · moments before fall",
  ev_online_trace: "🌐 Upload trace · external network",
};

const SCENES: Scene[] = [
  {
    id: "sc_office",
    title: "SCENE 01 · SCHOOL OFFICE",
    vibe: ["tension", "polished silence", "deflection", "grief", "mistrust"],
    spawnLogic:
      "Principal seated, framed by the school crest. Parent enters last, remains standing. Camera holds on whoever is not speaking.",
    spawn: ["principal", "parent", "self"],
    dialogue: [
      {
        who: "principal",
        emotion: "defensive",
        bias: "biased",
        text: "“We've reviewed the situation. It appears to be an unfortunate accident.”",
        mutateIf: [
          {
            has: ["ev_cctv_offline"],
            text: "“The cameras… well. Maintenance is on a rolling schedule. It's unfortunate timing.”",
            emotion: "unstable",
          },
        ],
      },
      {
        who: "parent",
        emotion: "emotional",
        bias: "biased",
        text: "“She begged me not to send her back. You all knew. You all KNEW.”",
      },
      {
        who: "principal",
        emotion: "defensive",
        bias: "ambiguous",
        text: "“Children… exaggerate. We never received a formal complaint.”",
      },
      {
        who: "self",
        emotion: "neutral",
        bias: "neutral",
        text: "Two stories. Neither rehearsed enough to be a lie. Neither honest enough to be the truth.",
      },
    ],
    experienceGoal:
      "The player should feel suspicion form without anchor — every party seems partially right and partially evasive.",
    branches: [
      {
        id: "b_office_press",
        label: "Press the principal on the cameras",
        path: "follow_digital",
        delta: { principal: +2, parent: -1 },
        unlocks: ["ev_cctv_offline", "ev_phone_wiped"],
        echo: "He doesn't deny. He reframes.",
      },
      {
        id: "b_office_listen",
        label: "Sit with the parent in silence",
        path: "trust_school",
        delta: { parent: +1, principal: 0 },
        echo: "Grief is not evidence. But it isn't nothing either.",
      },
      {
        id: "b_office_dorm",
        label: "Excuse yourself — go to the dorm",
        path: "press_roommates",
        delta: { principal: +1 },
        unlocks: ["ev_chat_fragments"],
        echo: "You leave a question unanswered on purpose.",
      },
      {
        id: "b_office_withhold",
        label: "Say nothing. Take notes.",
        path: "withhold",
        echo: "The room learns more from your silence than you do.",
      },
    ],
  },
  {
    id: "sc_dorm",
    title: "SCENE 02 · DORMITORY · ROOM 2-B",
    vibe: ["stillness", "performed normality", "claustrophobia", "guilt residue"],
    spawnLogic:
      "Roommate sits on her bed, phone face-down. Warden hovers near the door, never fully entering. Focus snaps to whoever breaks the silence.",
    spawn: ["roommate", "teacher", "self"],
    reveal: ["ev_chat_fragments"],
    dialogue: [
      {
        who: "teacher",
        emotion: "calm",
        bias: "ambiguous",
        text: "“The girls are still shaken. Please, be gentle.”",
      },
      {
        who: "roommate",
        emotion: "unstable",
        bias: "biased",
        text: "“We weren't… close. But we weren't NOT friends.”",
        mutateIf: [
          {
            has: ["ev_chat_fragments"],
            text: "“Those messages — they were jokes. You'd have to be there. You don't know how she was.”",
            emotion: "defensive",
          },
          {
            has: ["ev_secret_clips"],
            text: "“…Who showed you that? That wasn't supposed to leave the group.”",
            emotion: "unstable",
          },
        ],
      },
      {
        who: "self",
        emotion: "neutral",
        bias: "neutral",
        text: "She corrected herself. People only correct what they're afraid you noticed.",
      },
      {
        who: "teacher",
        emotion: "calm",
        bias: "ambiguous",
        text: "“If something was wrong, we'd have known. Wouldn't we.”",
      },
    ],
    experienceGoal:
      "Suspicion should braid: the roommate is unreliable but possibly truthful; the warden is composed but possibly complicit through omission.",
    branches: [
      {
        id: "b_dorm_clips",
        label: "Show the chat fragments",
        path: "press_roommates",
        delta: { roommate: +3, teacher: +1 },
        unlocks: ["ev_secret_clips"],
        echo: "She doesn't deny it. She negotiates with it.",
      },
      {
        id: "b_dorm_warden",
        label: "Turn to the warden — ‘What did you see?’",
        path: "trust_school",
        delta: { teacher: +2 },
        echo: "Her pause is longer than her answer.",
      },
      {
        id: "b_dorm_phone",
        label: "Ask why the phone data is missing",
        path: "follow_digital",
        delta: { roommate: +1, principal: +1 },
        unlocks: ["ev_phone_wiped", "ev_recovered_video"],
        echo: "Deletion is a kind of confession the law has trouble reading.",
      },
      {
        id: "b_dorm_leave",
        label: "Withdraw — observe from the corridor",
        path: "withhold",
        echo: "The room exhales the moment you leave it.",
      },
    ],
  },
  {
    id: "sc_recovered",
    title: "SCENE 03 · LAB · RECOVERED FRAGMENT",
    vibe: ["cold light", "disbelief", "moral vertigo", "incompleteness"],
    spawnLogic:
      "Player alone with a paused frame. The other characters appear only as overlapping audio memories — no sprite, only voice tags.",
    spawn: ["self"],
    reveal: ["ev_recovered_video", "ev_online_trace"],
    dialogue: [
      {
        who: "self",
        emotion: "neutral",
        bias: "neutral",
        text: "The clip is 11 seconds. Voices, then the railing, then nothing. No push is visible. No push is ruled out.",
      },
      {
        who: "roommate",
        emotion: "unstable",
        bias: "biased",
        text: "(audio memory) “Maybe she should just disappear.”",
      },
      {
        who: "principal",
        emotion: "defensive",
        bias: "ambiguous",
        text: "(audio memory) “We never received a formal complaint.”",
      },
      {
        who: "self",
        emotion: "neutral",
        bias: "ambiguous",
        text: "The same 11 seconds was uploaded — twice — before anyone called for help.",
      },
    ],
    experienceGoal:
      "The player should reach a verdict that does not feel like a verdict. Truth is structurally incomplete; reasoning must carry the weight.",
    branches: [
      {
        id: "b_final_systemic",
        label: "File: ‘Environmental responsibility — multiple parties’",
        path: "follow_digital",
        delta: { principal: +2, roommate: +2, teacher: +1 },
        echo: "No single hand. Many hands not raised.",
      },
      {
        id: "b_final_direct",
        label: "File: ‘Direct act unproven — close as accident’",
        path: "trust_school",
        delta: { principal: -2 },
        echo: "The file closes cleanly. The dorm does not.",
      },
      {
        id: "b_final_network",
        label: "Escalate the upload trace to Chapter 4 unit",
        path: "follow_digital",
        delta: { roommate: +1 },
        echo: "A pattern, not a person, walks out of this room with you.",
      },
      {
        id: "b_final_hold",
        label: "Hold the case open. Refuse to classify.",
        path: "withhold",
        echo: "Some files are honest only when they stay open.",
      },
    ],
  },
];

/* ===================== Runtime engine state ===================== */

type Suspicion = Record<CharId, number>;
const ZERO_SUSPICION: Suspicion = {
  principal: 0,
  parent: 0,
  roommate: 0,
  teacher: 0,
  self: 0,
};

function applyDelta(s: Suspicion, d?: Partial<Record<CharId, number>>): Suspicion {
  if (!d) return s;
  const next = { ...s };
  (Object.keys(d) as CharId[]).forEach((k) => {
    next[k] = (next[k] ?? 0) + (d[k] ?? 0);
  });
  return next;
}

function resolveLine(line: DialogueLine, evidence: Set<EvidenceId>): DialogueLine {
  if (!line.mutateIf) return line;
  for (const m of line.mutateIf) {
    if (m.has.every((e) => evidence.has(e))) {
      return { ...line, text: m.text, emotion: m.emotion ?? line.emotion };
    }
  }
  return line;
}

function emotionTag(e?: EmotionalState) {
  if (!e || e === "neutral") return null;
  const tone =
    e === "defensive"
      ? "border-primary/60 text-primary"
      : e === "emotional"
        ? "border-accent text-accent"
        : e === "unstable"
          ? "border-destructive/70 text-destructive-foreground"
          : "border-muted text-muted-foreground";
  return (
    <span className={`pixel text-[8px] px-1 border ${tone} ml-2 align-middle`}>
      {e.toUpperCase()}
    </span>
  );
}

function biasTag(b?: DialogueLine["bias"]) {
  if (!b || b === "neutral") return null;
  const tone =
    b === "biased"
      ? "border-destructive/60 text-destructive-foreground"
      : "border-muted text-muted-foreground";
  return (
    <span className={`pixel text-[8px] px-1 border ${tone} ml-1 align-middle`}>
      {b.toUpperCase()}
    </span>
  );
}

/* ============================ Component ============================ */

const SilentFall = () => {
  const [sceneIdx, setSceneIdx] = useState(0);
  const [suspicion, setSuspicion] = useState<Suspicion>(ZERO_SUSPICION);
  const [evidence, setEvidence] = useState<Set<EvidenceId>>(new Set());
  const [pathLog, setPathLog] = useState<{ scene: string; branch: Branch }[]>([]);
  const [pendingReveal, setPendingReveal] = useState<EvidenceId[]>([]);

  const total = SCENES.length;
  const done = sceneIdx >= total;
  const scene = !done ? SCENES[sceneIdx] : null;

  // System-driven evidence reveal on scene open
  useMemo(() => {
    if (!scene?.reveal) return;
    const fresh = scene.reveal.filter((e) => !evidence.has(e));
    if (fresh.length) {
      const next = new Set(evidence);
      fresh.forEach((e) => next.add(e));
      setEvidence(next);
      setPendingReveal(fresh);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [sceneIdx]);

  const choose = (b: Branch) => {
    setSuspicion((s) => applyDelta(s, b.delta));
    if (b.unlocks) {
      const next = new Set(evidence);
      b.unlocks.forEach((e) => next.add(e));
      setEvidence(next);
    }
    setPathLog((p) => [...p, { scene: scene!.id, branch: b }]);
    setPendingReveal([]);
    setSceneIdx((i) => i + 1);
  };

  const restart = () => {
    setSceneIdx(0);
    setSuspicion(ZERO_SUSPICION);
    setEvidence(new Set());
    setPathLog([]);
    setPendingReveal([]);
  };

  // Branch interpretation (no single ending — a *reading* of the case)
  const reading = useMemo(() => {
    const tally: Record<Branch["path"], number> = {
      trust_school: 0,
      press_roommates: 0,
      follow_digital: 0,
      withhold: 0,
    };
    pathLog.forEach((p) => (tally[p.branch.path] += 1));
    const dominant = (Object.entries(tally) as [Branch["path"], number][])
      .sort((a, b) => b[1] - a[1])[0];
    return { tally, dominant: dominant?.[0] };
  }, [pathLog]);

  return (
    <GameFrame bgImage={bg}>
      <header className="pt-5 px-5 flex items-center gap-3">
        <Link to="/chapter/school" className="pixel-btn-square" aria-label="Back">←</Link>
        <h1 className="pixel text-glow text-xs sm:text-sm text-primary flex-1 text-center pr-12">
          CHAPTER X · SILENT FALL
        </h1>
      </header>

      {!done && (
        <div className="px-5 pt-3">
          <div className="h-2 border-2 border-primary/70 bg-background/60">
            <div
              className="h-full bg-primary transition-all"
              style={{ width: `${((sceneIdx + 1) / total) * 100}%` }}
            />
          </div>
          <div className="pixel text-[9px] text-primary/90 mt-1 flex justify-between">
            <span>SCENE {sceneIdx + 1} / {total}</span>
            <span>EVIDENCE {evidence.size}/6</span>
          </div>
        </div>
      )}

      <main className="flex-1 px-5 py-4 overflow-y-auto space-y-3">
        {/* HUD: suspicion meters */}
        {!done && (
          <div className="bg-background/80 border-2 border-primary/60 p-2">
            <div className="pixel text-[9px] text-primary mb-1">SUSPICION INDEX</div>
            <div className="grid grid-cols-2 gap-x-3 gap-y-1">
              {(["principal", "parent", "roommate", "teacher"] as CharId[]).map((id) => {
                const v = suspicion[id];
                const pct = Math.max(0, Math.min(100, 50 + v * 10));
                return (
                  <div key={id} className="flex items-center gap-2">
                    <span className={`pixel text-[8px] w-20 truncate ${CHARACTERS[id].color}`}>
                      {CHARACTERS[id].name}
                    </span>
                    <div className="flex-1 h-2 border border-primary/50 bg-background/60">
                      <div className="h-full bg-accent" style={{ width: `${pct}%` }} />
                    </div>
                    <span className="pixel text-[8px] w-6 text-right text-muted-foreground">
                      {v >= 0 ? `+${v}` : v}
                    </span>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* Evidence reveal banner */}
        {pendingReveal.length > 0 && (
          <div className="bg-accent/15 border-2 border-accent p-2">
            <div className="pixel text-[9px] text-accent">EVIDENCE UNLOCKED</div>
            {pendingReveal.map((e) => (
              <p key={e} className="text-sm">{EVIDENCE_LABEL[e]}</p>
            ))}
          </div>
        )}

        {/* Scene block */}
        {scene && (
          <>
            {/* Vibe + spawn meta */}
            <div className="bg-card/90 border-2 border-primary p-3 shadow-[var(--shadow-pixel)] space-y-2">
              <div className="pixel text-[10px] text-primary">{scene.title}</div>
              <div>
                <div className="pixel text-[9px] text-accent">VIBE</div>
                <div className="flex flex-wrap gap-1 mt-1">
                  {scene.vibe.map((v) => (
                    <span
                      key={v}
                      className="pixel text-[8px] px-1 border border-primary/60 text-primary/90 bg-background/60"
                    >
                      {v.toUpperCase()}
                    </span>
                  ))}
                </div>
              </div>
              <div>
                <div className="pixel text-[9px] text-accent mt-1">SPAWN</div>
                <div className="flex flex-wrap gap-1 mt-1">
                  {scene.spawn.map((c) => (
                    <span
                      key={c}
                      className={`pixel text-[8px] px-1 border border-primary/60 ${CHARACTERS[c].color} bg-background/60`}
                    >
                      {CHARACTERS[c].name}
                    </span>
                  ))}
                </div>
                <p className="text-xs italic text-muted-foreground mt-1">{scene.spawnLogic}</p>
              </div>
            </div>

            {/* Dialogue */}
            <div className="space-y-2">
              {scene.dialogue.map((raw, k) => {
                const line = resolveLine(raw, evidence);
                const ch = CHARACTERS[line.who];
                return (
                  <div
                    key={k}
                    className="bg-background/80 border-2 border-primary/50 p-2"
                  >
                    <div className="flex items-center flex-wrap">
                      <span className={`pixel text-[9px] ${ch.color}`}>{ch.name}</span>
                      {emotionTag(line.emotion ?? ch.baseEmotion)}
                      {biasTag(line.bias)}
                    </div>
                    <p className="text-base leading-snug mt-1">{line.text}</p>
                    <p className="text-[10px] italic text-muted-foreground mt-1">
                      cue: {ch.cues[k % ch.cues.length]}
                    </p>
                  </div>
                );
              })}
            </div>

            {/* Player goal */}
            <div className="bg-primary/10 border-2 border-primary/60 p-2">
              <div className="pixel text-[9px] text-primary">PLAYER EXPERIENCE GOAL</div>
              <p className="text-sm mt-1">{scene.experienceGoal}</p>
            </div>

            {/* Branches */}
            <div className="space-y-2">
              <div className="pixel text-[10px] text-accent">BRANCHES — choose an interpretation</div>
              {scene.branches.map((b) => (
                <button
                  key={b.id}
                  onClick={() => choose(b)}
                  className="w-full text-left p-2 border-2 border-primary/50 bg-background/70 hover:bg-primary/15 transition-colors"
                >
                  <div className="text-sm">▸ {b.label}</div>
                  <div className="pixel text-[8px] text-muted-foreground mt-1">
                    PATH · {b.path.replace("_", " ").toUpperCase()}
                    {b.unlocks?.length ? `  ·  UNLOCKS ${b.unlocks.length}` : ""}
                  </div>
                </button>
              ))}
            </div>
          </>
        )}

        {/* End screen — reading, not verdict */}
        {done && (
          <>
            <div className="bg-card/95 border-2 border-primary p-3 shadow-[var(--shadow-pixel)] space-y-2">
              <div className="pixel text-[10px] text-accent">CASE READING</div>
              <div className="pixel text-sm text-primary">
                {reading.dominant === "follow_digital" && "Pattern-led · Systemic Reading"}
                {reading.dominant === "press_roommates" && "Person-led · Proximate Reading"}
                {reading.dominant === "trust_school" && "Institutional Reading"}
                {reading.dominant === "withhold" && "Open File · Refused Closure"}
              </div>
              <p className="text-base leading-snug">
                Nothing here resolves. The case offers a shape, not a verdict.
                What you chose to look at became what the file remembers.
              </p>
            </div>

            <div className="bg-background/80 border-2 border-accent p-3 space-y-1">
              <div className="pixel text-[10px] text-accent">PATH LOG</div>
              {pathLog.map((p, i) => (
                <div key={i} className="text-xs">
                  <span className="pixel text-[8px] text-primary mr-2">{i + 1}.</span>
                  {p.branch.label}
                  <div className="text-[10px] italic text-muted-foreground ml-6">
                    → {p.branch.echo}
                  </div>
                </div>
              ))}
            </div>

            <div className="bg-primary/10 border-2 border-primary p-3 space-y-1">
              <div className="pixel text-[10px] text-primary">FINAL SUSPICION INDEX</div>
              {(["principal", "parent", "roommate", "teacher"] as CharId[]).map((id) => (
                <div key={id} className="text-xs flex justify-between">
                  <span className={CHARACTERS[id].color}>{CHARACTERS[id].name}</span>
                  <span className="text-muted-foreground">
                    {suspicion[id] >= 0 ? `+${suspicion[id]}` : suspicion[id]}
                  </span>
                </div>
              ))}
            </div>

            <div className="bg-background/80 border-2 border-primary/60 p-3">
              <div className="pixel text-[10px] text-primary">EVIDENCE LEDGER</div>
              {[...evidence].map((e) => (
                <p key={e} className="text-sm">• {EVIDENCE_LABEL[e]}</p>
              ))}
              {evidence.size === 0 && (
                <p className="text-sm italic text-muted-foreground">
                  No evidence pursued. The file is thin by your design.
                </p>
              )}
            </div>

            <div className="grid grid-cols-2 gap-3">
              <button onClick={restart} className="pixel-btn pixel-btn-secondary text-sm">
                REPLAY
              </button>
              <Link to="/chapter/school" className="pixel-btn text-sm text-center">
                CONTINUE
              </Link>
            </div>
          </>
        )}
      </main>
    </GameFrame>
  );
};

export default SilentFall;