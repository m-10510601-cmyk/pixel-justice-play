## Case W — The Silent Dormitory

A new **school-arc** chapter inspired by the Zulfarhan Osman case. Themes: mob mentality, diffusion of responsibility, seniority abuse, and the §302 vs §304 legal crux. Built on the same pattern as Mask of Authority / Ritual of Power (single-page narrative, 6 acts, choice-driven, multi-ending).

### 1. Routing & navigation

- New page `src/pages/story/SilentDormitory.tsx`.
- Register `/story/silent-dormitory` in `src/App.tsx` (import + `<Route>`).
- Add a "Chapter W · The Silent Dormitory" card in the `school` section of `src/pages/Chapter.tsx` (under Silent Fall / Green Trade).

### 2. Pixel-art scene assets

Generate 7 new 1024×1024 pixel-art backgrounds in `src/assets/scenes/dormitory/`. Tone guidance: **no graphic violence, no blood, no real military insignia** — silhouettes, shadows, empty bunks, atmospheric tension only.

| Key | File | Subject |
|---|---|---|
| `dorm-night` | `dm-dorm-night.png` | Dim military-style dorm, bunks, single desk lamp, missing laptop spot |
| `interrogation-circle` | `dm-circle.png` | Group of students surrounding one seated figure (silhouettes), tense lighting |
| `escalation` | `dm-escalation.png` | Hallway at night, one student arguing with another out of sight of group |
| `routine` | `dm-routine.png` | Same dorm in daylight — abuse normalised, students studying as if nothing wrong |
| `collapse` | `dm-collapse.png` | Dorm floor at night, victim slumped (silhouette only), panicked classmates |
| `hospital` | `dm-hospital.png` | Hospital corridor, doctor with clipboard, grim mood |
| `verdict` | `dm-verdict.png` | Malaysian courtroom (verdict aesthetic) |

### 3. Scene image registry

Update `src/lib/sceneImages.ts`:
- Extend `ChapterId` union with `"silent-dormitory"`.
- Add 7 imports + the `silent-dormitory` block in `REGISTRY`.
- Add `TITLE_FALLBACK["silent-dormitory"]`:
  - `/dorm|night|seed|brief|laptop/i → dorm-night`
  - `/interrogation|questioning|circle|pressure/i → interrogation-circle`
  - `/escalation|hidden|thread|exit|punishment/i → escalation`
  - `/routine|normalisation|normalization|silence|habituation/i → routine`
  - `/collapse|breaking|crisis/i → collapse`
  - `/hospital|aftermath|doctor/i → hospital`
  - `/verdict|legal|court|reflection|ending/i → verdict`
- Update the comment-index header.

### 4. Story structure (`SilentDormitory.tsx`)

Same `Step` union as MaskOfAuthority (`scene | evidence | choice | insight`). Reuses `GameFrame`, `SceneDialogue`, `EvidenceBoard`, `ChoicePanel`. ~24 steps across 6 acts:

1. **Case Brief** (scene, `dorm-night`) — A laptop goes missing in a military university dorm. Victim accused with no evidence.
2. **Act I · The Seed of Suspicion** (scene, `dorm-night`) — Student A/B confront the victim.
3. **Choice ① · Initial Judgment** (`q1`)
   - A. Trust group intuition — *poor*.
   - B. Demand physical evidence — *best*.
   - C. Escalate to superiors — *ok*.
   - D. Stay a bystander — *poor*.
4. **Act II · The Interrogation** (scene, `interrogation-circle`) — verbal "encirclement", no force yet.
5. **Evidence Board #1 · Chat Logs** — `chat-pressure` ("Give him a bit more pressure", reliable, tag `escalation`), `witness-stmt` (hallway witness, reliable, tag `coercion`), `roster` (six students consistently present, reliable, tag `collective`).
6. **Choice ② · Behavioural Assessment** (`q2`)
   - A. Reasonable inquiry — *poor*.
   - B. Emotional venting — *poor*.
   - C. Peer pressure / mob formation — *best*.
   - D. Normal interaction — *poor*.
7. **Act III · The Escalation** (scene, `escalation`) — Student D hesitates; Student B threatens "you're an accomplice if you back out".
8. **Choice ③ · Group Dynamic** (`q3`)
   - A. Isolated individual acts — *poor*.
   - B. Formation of collective criminal intent (§34 common intention) — *best*.
   - C. Simple conflict — *poor*.
9. **Insight · Common Intention (§34)** — short legal frame: shared purpose + concerted acts = each liable for the act of all.
10. **Act IV · The Normalisation of Silence** (scene, `routine`) — abuse becomes routine; moral rationalisation.
11. **Choice ④ · Critical Perception** (`q4`)
    - A. Situation stabilised — *poor*.
    - B. Risk decreasing — *poor*.
    - C. Fatal danger ignored due to habituation — *best*.
12. **Evidence Board #2 · The Pattern** — `medic-log` (no medical visit logged in 8 days, reliable, tag `omission`), `bystander-diary` (Student D's notes — fear of retaliation, reliable, tag `coercion`), `injury-pattern` (forensic — repeated trauma over days, reliable, tag `prolonged`).
13. **Act V · The Breaking Point** (scene, `collapse`) — victim collapses; A says "if we call now we're all finished".
14. **Choice ⑤ · The Decision** (`q5`)
    - A. Call medical help immediately — *best*.
    - B. Observe for another hour — *poor* (the inertia trap).
    - C. Keep pressing for the laptop — *poor*.
    - D. Do nothing — *poor*.
    - Reveal: psychological inertia is the killer here, not any single blow.
15. **Act VI · Aftermath** (scene, `hospital`) — doctor: "delay was fatal; injuries sustained over a long period."
16. **Evidence Board #3 · Role Allocation** — `student-A-acts` (instigator, sustained pressure, reliable, tag `instigator`), `student-B-acts` (executor of physical acts, reliable, tag `executor`), `student-D-silence` (knew, did not report, reliable, tag `bystander`), `laptop-found` (laptop was misplaced, never stolen — reliable, tag `irony`).
17. **Choice ⑥ · Student A — Instigator** (`q6`) — A. One-off mistake / B. Persistent course of conduct (best) / C. Not responsible.
18. **Choice ⑦ · Student B — Executor** (`q7`) — A. Just following / B. Common intention under §34 (best) / C. Not responsible.
19. **Insight · Bystander & Duty** — short note on moral failing vs limited legal duty for Student D in Malaysian law.
20. **Act VI (cont.) · The Legal Crux** (scene, `verdict`).
21. **Choice ⑧ · Final Classification** (`q8`)
    - A. Murder §302 — *ok* (emotional justice; intent to kill is hard to prove).
    - B. Culpable homicide §304 — *best* (knowledge that acts were likely to cause death, no specific intent to kill).
    - C. Accident — *poor*.
    - Reveal: maps to the real-case legal transition.
22. **Insight · §302 vs §304** — clear contrast: intent to kill vs knowledge of likely death.
23. **Verdict scene** (scene, `verdict`).
24. **Ending Resolver + Reflection card**.

### 5. Ending logic

Optimal answers: q1=B, q2=C, q3=B, q4=C, q5=A, q6=B, q7=B, q8=B. Score sums "best=2, ok=1, poor=0".

- **Perfect / Legally Precise (green)** — `q8=B` AND `q3=B` AND `q5=A` AND score ≥ 12: §304 conviction for A and B (common intention); D censured; institutional "seniority culture" exposed and ties into the syndicate arc.
- **Emotional Justice (yellow)** — `q8=A` OR (`q8=B` but score 7–11): §302 conviction that risks being overturned on appeal for lack of specific intent; the player feels vindicated but the law is uneasy.
- **Failure (red)** — `q8=C` OR `q5 ∈ {B,C,D}` OR score ≤ 6: ruled accidental; minor disciplinary action; institution closes ranks.

### 6. UX details

- Standard pattern: `step.image ?? sceneImageFor("silent-dormitory", step.sceneKey ?? step.title)`.
- Evidence cards use `evidenceTags`: `escalation`, `coercion`, `collective`, `omission`, `prolonged`, `instigator`, `executor`, `bystander`, `irony`.
- Closing "What This Teaches" card highlights the four lessons: mob mentality, diffusion of responsibility, normalisation of silence, and §302 vs §304.
- Footer: REPLAY + CONTINUE (back to `/chapter/school`).

### Technical notes

- **New files**: `src/pages/story/SilentDormitory.tsx`, 7 PNGs in `src/assets/scenes/dormitory/`.
- **Edited files**: `src/App.tsx` (import + route), `src/pages/Chapter.tsx` (school card), `src/lib/sceneImages.ts` (chapter id, registry, fallbacks, header comment).
- No backend, no schema changes, no new dependencies.
- Sensitive-topic guard for image gen: silhouettes only, no graphic injury, no blood, no real insignia. Lighting and posture do all the work.
- After image generation, view each PNG once for tone QA before wiring.