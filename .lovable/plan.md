## Case V — The Silent Room

A new multi-act story chapter modelled on Silent Fall / Green Trade / The Runner, themed around long-term child abuse, systemic failure, and the line between discipline and harm. Six acts, seven choices, three endings, full pixel-art scene set.

### 1. Routing & navigation

- Add page `src/pages/story/SilentRoom.tsx`.
- Register route `/story/silent-room` in `src/App.tsx`.
- Add an entry card in `src/pages/Chapter.tsx` under the `society` chapter list (alongside The Runner):
  - Title: "Chapter W · The Silent Room"
  - Subtitle: "Child protection · systemic failure · multi-ending"

### 2. Pixel-art scene assets

Generate 7 new 1024×1024 16-bit pixel-art backgrounds in `src/assets/scenes/silentroom/`, matching the style of the existing runner/greentrade sets:

| Key | File | Subject |
|---|---|---|
| `er` | `sr-er.png` | Hospital ER — child on gurney, doctor + agitated guardian |
| `medical` | `sr-medical.png` | X-ray light box with multiple fractures, medical chart |
| `neighborhood` | `sr-neighborhood.png` | Apartment corridor at night, child silhouette outside door |
| `records` | `sr-records.png` | Stack of clinic folders / dossier on desk |
| `interrogation` | `sr-interrogation.png` | Interrogation room with guardian seated under lamp |
| `verdict` | `sr-verdict.png` | Courtroom — gavel, child's empty chair |
| `reflection` | `sr-reflection.png` | A quiet, empty child's bedroom — the "silent room" |

### 3. Scene image registry

Update `src/lib/sceneImages.ts`:
- Extend `ChapterId` with `"silent-room"`.
- Add the 7 imports + `silent-room` block in `REGISTRY`.
- Add `TITLE_FALLBACK["silent-room"]` patterns: `/er|emergency|brief/i → er`, `/medical|x-?ray|fracture/i → medical`, `/neighbour|neighbor|hood|testimon/i → neighborhood`, `/records|clinic|history|pattern/i → records`, `/interrogation|guardian/i → interrogation`, `/verdict|legal|judgment|judgement/i → verdict`, `/reflection|ending|silent room/i → reflection`.
- Update the comment-index header to list the new mappings.

### 4. Story structure (`SilentRoom.tsx`)

Mirror the `Step` union from `TheRunner.tsx` (`scene | evidence | choice | insight`). Use `SceneDialogue`, `EvidenceBoard`, `ChoicePanel`, `GameFrame`. Reuse `bg` from `@/assets/story-silent-fall.jpg` as the frame backdrop.

Acts and steps:

1. **Case Brief** (scene, `er`) — set 2026 Malaysia, child "Adi" (6) brought in unresponsive; guardian claims a fall.
2. **Act I · ER Report** (scene, `er`) — Doctor whisper, agitated guardian, system narrative line.
3. **Choice ① · Initial Judgment** (`q1`)
   - A. Standard accident — *poor* (closes too early).
   - B. Verify injuries match story — *best*.
   - C. Guardian credible — *poor* (uncritical).
   - D. Insufficient information — *best*.
4. **Act II · Medical Anomalies** (scene, `medical`) — doctor explains bruises and fractures at different healing stages.
5. **Evidence Board #1** — `medical-report` (reliable), `xray-old-fracture` (reliable), `xray-new-fracture` (reliable), `guardian-statement` (unreliable). Each item carries a short rationale.
6. **Choice ② · Evidence Interpretation** (`q2`)
   - A. Active child / minor injuries — *poor*.
   - B. Possible recurring injuries — *ok*.
   - C. Possible chart error — *poor*.
   - D. Inconsistent with single-event accident — *best* (legal grounding).
7. **Act III · Neighborhood** (scene, `neighborhood`) — Neighbor A and Neighbor B testimonies.
8. **Evidence Board #2** — `neighbor-a` (ok / cautious weight), `neighbor-b` (ok), `school-silence` (reliable — bruises noted but never reported).
9. **Choice ③ · Assessing Testimony** (`q3`)
   - A. Standard family friction — *poor*.
   - B. Possible neglect — *ok*.
   - C. Neighbors unreliable — *poor*.
   - D. Long-term abnormal pattern — *best*.
10. **Act IV · Hidden Records** (scene, `records`) — discovery of multiple clinic visits at different hospitals, all logged as accidents.
11. **Evidence Board #3** — `clinic-records` (reliable, with `evidenceTags: ["pattern"]`), `school-incident-log` (reliable), `cps-no-referral` (reliable — system failure).
12. **Choice ④ · Pattern Recognition** (`q4`)
   - A. Coincidence — *poor*.
   - B. Clumsy child — *poor*.
   - C. Pattern of systemic physical abuse — *best*.
   - D. General negligence — *ok*.
13. **Act V · Interrogation** (scene, `interrogation`) — guardian's emotional appeal, then the "discipline vs abuse" pivot dialogue.
14. **Choice ⑤ · Response Strategy** (`q5`)
   - A. Express sympathy — *poor* (manipulation risk).
   - B. Focus on timeline — *best*.
   - C. Confront medical contradictions — *best*.
   - D. Suspend interrogation — *ok*.
   - Reveal explains B+C is the strongest combined approach.
15. **Insight · Discipline vs Abuse** — short framing block on Penal Code §302/§304 and Child Act 2001 (Malaysia), plus the line "every Tuesday for a month".
16. **Act VI · Legal Junction** — two reasoning choices in sequence:
    - **Choice ⑥ · Nature of Action** (`q6`): A Strict / B Excessive / **C Persistent abuse — best**.
    - **Choice ⑦ · Nature of Death** (`q7`): A Single fall / B Compound accident / **C Death from long-term abuse — best**.
17. **Verdict & Ending Resolver** (scene → reflection) — compute ending from answers (see §5).
18. **Reflection** (`reflection`) — closing inner monologue: "It wasn't only the room that was silent."

### 5. Ending logic

Score = count of optimal answers across q1–q7 (B/D, D, D, C, B+C, C, C). Q5 counts as optimal when **both** B and C are picked (multi-select shim: store as concatenated id like `"BC"`; treat any string containing both `B` and `C` as optimal).

- **Justice Ending (green)** — score ≥ 6 and q4=C and q6=C and q7=C: abuse proven, guardian convicted, community reporting reform announced.
- **Realistic Ending (yellow, default)** — score 4–5 or q7≠C: convicted of negligence causing death; "too little, too late".
- **Failure Ending (red)** — score ≤ 3 or q1∈{A,C} and q2≠D: ruled accidental, case closed, the truth stays silent.

Each ending shows: outcome banner, 2–3 line narrative, and a "What this teaches" insight tying back to systemic failure (school + neighbours + clinics).

### 6. UX details

- Scenes resolve backgrounds via `sceneImageFor("silent-room", step.sceneKey ?? step.title)` — same pattern as `TheRunner.tsx`.
- Evidence cards support `evidenceTags: ["pattern", "system-failure"]` so the recap card highlights the through-line.
- After verdict, render an `EvidenceBoard` recap with rationale + jump-to-evidence (reuse the existing `EvidenceBoard` interactions added earlier).
- Footer button row: "Replay chapter" (resets answers), "Back to chapter list" (`/chapter/society`).

### Technical notes

- New files: `src/pages/story/SilentRoom.tsx`, 7 PNGs in `src/assets/scenes/silentroom/`.
- Edited files: `src/App.tsx` (route + import), `src/pages/Chapter.tsx` (society card), `src/lib/sceneImages.ts` (registry + fallbacks + header comment).
- No backend, no schema changes, no new dependencies.
- Sensitive-topic guard: keep all descriptions clinical/legal; no graphic depiction in pixel art (silhouettes, charts, empty rooms).
- After generation, QA each PNG by viewing once to confirm tone before wiring.