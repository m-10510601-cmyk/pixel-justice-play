# Polish dialogue: smarter speaker mapping + richer line UI

## Part A — Robust speaker → portrait mapping

Replace the long `if/else` chain in `inferCharacter()` with a normalized, prioritized table-driven matcher in `src/components/story/DialogueLine.tsx`:

1. **Normalize** `who`: lowercase, strip parenthetical asides like `"(whispering)"` / `"(calmly)"`, collapse whitespace, trim trailing punctuation. So `"Mei (whispering)"` and `"Suspect (calmly)"` resolve cleanly.
2. **Ordered rule list** (first match wins; long/specific keywords before short ones):
   - exact `you` → `you`
   - keywords containing `aira's parent`, `parent`, `mother`, `father`, `mom`, `dad`, `mr.`, `mrs.`, `madam`, `auntie`, `uncle` → `parent` / `civilian_m` / `civilian_f`
   - `principal`, `headmaster`, `headmistress`, `teacher`, `dean` → `principal`
   - `aira` (exact-name) → `aira`
   - `fake`, `caller`, `voice`, `narrator`, `dispatcher`, `radio`, `pa system` → `voice`
   - `officer`, `inspector`, `constable`, `police`, `cop`, `sergeant` → `officer`
   - `profiler`, `investigator`, `analyst`, `forensic`, `detective`, `csi` → `detective`
   - `prosecution`, `prosecutor`, `defence`, `defense`, `mentor`, `lawyer`, `advocate`, `counsel`, `barrister`, `judge` (when not "YOU") → `lawyer`
   - `doctor`, `dr.`, `nurse`, `medic`, `paramedic` → `doctor`
   - `journalist`, `tv`, `reporter`, `press`, `news` → `journalist`
   - `expert`, `scientist`, `professor`, `prof.`, `consultant`, `auditor` → `expert`
   - `suspect`, `driver`, `runner`, `accused`, `defendant`, `convict`, `gang`, `dealer` → `suspect`
   - `student`, `teen`, `pupil`, `classmate`, `kid`, `boy`, `girl` → alternate `student_m` / `student_f` based on a stable hash of the full name (so `Student A`, `Student C`, `Student E` stay consistent across replays — not by trailing letter, which currently miscategorizes `Teen B` as female arbitrarily)
   - first-name allowlist for `student_f`: `lina`, `mei`, `aira` (already), `siti`, `priya`, `chloe`, `anya`
   - first-name allowlist for `student_m`: `arif`, `daniel`, `hafiz`, `ravi`, `wei`, `kai`
   - `victim`, `widow` → `civilian_f`
   - `bystander`, `neighbour`, `neighbor`, `friend`, `agent`, `manager`, `supervisor`, `liaison`, `tech`, `bank`, `clerk`, `cashier`, `stranger`, `witness` → `civilian_m` (default)
3. **Final fallback**: instead of always `civilian_m`, use a stable hash of the name to pick between `civilian_m` and `civilian_f`, so unknown speakers still feel varied rather than identical.
4. **Dev-only logging**: when `import.meta.env.DEV` and a name hits only the final fallback, `console.warn` once per unique name so future chapters surface unmapped speakers.
5. **Unit-style guard**: extract `inferCharacter` to module scope (already is) and export it so we can add a quick Vitest covering every speaker name found in `src/pages/story/*.tsx`.

## Part B — Make dialogue lines more engaging

Visual / behavioral upgrades inside `DialogueLine.tsx` and `SceneDialogue.tsx`. All design tokens already exist (`--primary`, `--accent`, `--card`, `--gold`, `--shadow-pixel-sm`, `speak-bob` keyframe).

1. **Active-speaker emphasis**
   - Pass `speaking` to `CharacterPortrait` based on whether this line is the most recent one (`isCurrent` from `SceneDialogue`). Past lines render dimmed (already supported via `speaking={false}` → opacity 0.55 + grayscale).
   - Add a subtle `speak-bob` only on the active portrait (already wired via the same prop).
   - Active bubble gets a soft glow ring (`shadow-glow` token, reduced intensity) and a 1px brighter border; past bubbles drop to `bg-card/70` and lose the tail glow.

2. **Bubble-in animation**
   - Add a `dialogue-pop` keyframe in `index.css`: `transform: translateY(6px) scale(0.97); opacity: 0` → settled. Apply on each new line (key change triggers re-mount of the most recent line wrapper).
   - Inner-thought lines use a separate `thought-fade` keyframe (slower, slight blur-in) to feel mental rather than spoken.

3. **Typewriter polish**
   - Replace plain `▌` cursor with a blinking block via CSS class `caret-blink` so it doesn't jitter the layout when the text grows.
   - When the typewriter is active for a non-`you` speaker, render a small "···" typing indicator above the bubble tail; for `you` inner thoughts, use "💭" pulse instead.
   - Punctuation pacing: in the typewriter loop, multiply `charDelay` by 4 after `.`, `?`, `!`, and by 2 after `,`, `;`, `:` for natural cadence. Configurable via prop, default on.

4. **Color-coded name plates**
   - Map each `CharacterKey` to a name-plate color (e.g. officer = justice-blue, suspect = destructive, lawyer = gold, civilian = muted, voice = accent). Apply to the small uppercase name label so the speaker is identifiable at a glance even before the portrait registers.

5. **Layout / readability**
   - Bump body text from `text-sm` to `text-base` for spoken lines, keep `text-sm italic` for inner thoughts.
   - Add `max-w-[85%]` to the bubble so very long lines wrap into a tighter, more comic-style block instead of stretching edge-to-edge.
   - Add a faint 1px dotted divider above each new speaker change (not between same-speaker consecutive lines) to chunk the conversation visually.

6. **Sound-less haptic cue (optional, behind a setting we already have)**
   - On manual advance in MANUAL mode, briefly flash the bubble border (`animate-pulse` 1 cycle) so taps feel responsive. Skip in AUTO mode.

## Files to change

- `src/components/story/DialogueLine.tsx` — rewrite `inferCharacter`, add name-plate color map, active/past styling, animation classes, max-width, divider logic (needs to know previous speaker; accept optional `prevWho` prop).
- `src/components/story/SceneDialogue.tsx` — pass `isCurrent` (→ `speaking`) and `prevWho` to each `DialogueLine`; add punctuation-aware typewriter delay.
- `src/index.css` — add `@keyframes dialogue-pop`, `thought-fade`, `caret-blink`, and `.caret-blink` / `.dialogue-pop` / `.thought-fade` utility classes.
- `src/test/dialogueLine.test.ts` (new) — assert `inferCharacter` returns a non-`narrator`, non-default key for every distinct `who:` value found across `src/pages/story/*.tsx`.

## Out of scope

- No story-data edits; speaker names in `src/pages/story/*.tsx` stay as written.
- No new portrait art (we already added 12 portraits in the previous pass).
- No audio.
