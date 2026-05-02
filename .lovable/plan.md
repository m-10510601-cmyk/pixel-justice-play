## Case VII — The Ritual of Power

A new society-arc chapter modelled on Mask of Authority / Silent Room. Themes: cult manipulation, consent vs legality, premeditated murder vs failed ritual, and a new media-sentiment mechanic that can mislead the player.

### 1. Routing & navigation

- New page `src/pages/story/RitualOfPower.tsx`.
- Register `/story/ritual-of-power` in `src/App.tsx`.
- Add a "Chapter U · The Ritual of Power" card in the `society` section of `src/pages/Chapter.tsx`.

### 2. Pixel-art scene assets

Generate 7 new 1024×1024 pixel-art backgrounds in `src/assets/scenes/ritual/`:

| Key | File | Subject |
|---|---|---|
| `disappearance` | `rt-disappearance.png` | News desk / missing-person poster of Dato' Rahman |
| `ritual` | `rt-ritual.png` | Dim ritual chamber: candles, sigils, altar, robed figures (silhouettes only) |
| `mentor` | `rt-mentor.png` | The "spiritual mentor" in opulent study, occult symbols, cash on desk |
| `assistant` | `rt-assistant.png` | Lina the assistant in a small room, isolation/brainwashing tone |
| `media` | `rt-media.png` | Wall of TV screens with conflicting tabloid headlines |
| `interrogation` | `rt-interrogation.png` | Standard pixel-art interrogation room |
| `verdict` | `rt-verdict.png` | Malaysian courtroom (reuse the verdict aesthetic) |

Tone guidance for image gen: no gore, no real religious iconography — silhouettes, candles, abstract sigils only.

### 3. Scene image registry

Update `src/lib/sceneImages.ts`:
- Extend `ChapterId` with `"ritual-of-power"`.
- Add 7 imports + the `ritual-of-power` block in `REGISTRY`.
- Add `TITLE_FALLBACK["ritual-of-power"]` patterns:
  - `/disappear|missing|brief/i → disappearance`
  - `/ritual|ceremony|chamber/i → ritual`
  - `/mentor|guru|master/i → mentor`
  - `/assistant|lina|brainwash/i → assistant`
  - `/media|headline|tabloid|press/i → media`
  - `/interrogation/i → interrogation`
  - `/verdict|legal|court|reflection|ending/i → verdict`
- Update the comment-index header.

### 4. Story structure (`RitualOfPower.tsx`)

Same `Step` union as `MaskOfAuthority.tsx` (`scene | evidence | choice | insight`). Reuses `GameFrame`, `SceneDialogue`, `EvidenceBoard`, `ChoicePanel`, and the same `RecapPanel` component.

Acts and steps (≈22 steps total):

1. **Case Brief** (scene, `disappearance`) — Dato' Rahman, missing 6 days; ritual-mentor lead surfaces.
2. **Act I · The Disappearance** (scene, `mentor`) — investigators trace large outflows to the mentor.
3. **Choice ① · Initial Frame** (`q1`)
   - A. Missing person — *poor* (closes too early).
   - B. Fraud + suspicious disappearance — *best*.
   - C. Voluntary disappearance — *poor*.
   - D. Ordinary cult activity — *ok*.
4. **Act II · The Ritual Site** (scene, `ritual`) — body recovered; ritual setup intact.
5. **Evidence Board #1 · "It Was Voluntary"** — `ritual-video` (victim participating, reliable, tag `consent-trap`), `audio-consent` ("I accept all consequences", reliable, tag `consent-trap`), `ritual-injury` (forensic — fatal injury inflicted by mentor, reliable, tag `lethal-act`), `cause-of-death` (not survivable, reliable, tag `lethal-act`).
6. **Choice ② · Does Consent Remove Liability?** (`q2`)
   - A. Yes, consent erases the offence — *poor* (the legal trap).
   - B. Consent reduces it to negligence — *ok*.
   - C. Consent is not a defence to taking life — *best* (s.300 frame).
   - D. Need more evidence — *poor* (evidence is on the table).
   - Reveal cites: "agreement does not equal legality."
7. **Insight · Consent and Life** — short legal frame: under Malaysian law consent does not legitimise an act intended to cause death; the only narrow exceptions don't reach lethal ritual harm.
8. **Act III · The Assistant Lina** (scene, `assistant`) — interview reveals isolation, sleep deprivation, financial dependence, religious coercion.
9. **Evidence Board #2 · Assistant's Position** — `lina-prep` (helped prepare the ritual, reliable, tag `participation`), `lina-diary` (fear, attempted to leave twice, reliable, tag `coercion`), `mentor-control-log` (controlled phone, finances, sleep, reliable, tag `coercion`).
10. **Choice ③ · Lina's Status** (`q3`)
    - A. Pure accomplice — *poor*.
    - B. Pure victim — *ok* (humane but ignores participation).
    - C. Both — accomplice in act, victim of coercion — *best* (mitigation, not acquittal).
11. **Act IV · Money vs Faith** (scene, `mentor`) — financial trail + ritual notebooks side by side.
12. **Evidence Board #3 · Mixed Motive** — `bank-transfers` (RM ~3.2M to mentor accounts, reliable, tag `fraud`), `ritual-notes` (detailed years-old liturgy, reliable, tag `belief`), `client-list` (other paying clients, reliable, tag `fraud`).
13. **Choice ④ · Motive** (`q4`)
    - A. Pure scam — *ok*.
    - B. Sincere faith — *poor*.
    - C. Mixed motive: sincere belief monetised — *best* (matches the evidence).
14. **Act V · Media Pressure** (scene, `media`) — the new mechanic.
15. **Choice ⑤ · Media Influence** (`q5`)
    - A. Follow the "Occult Killings!" narrative — *poor*.
    - B. Follow the "Victim Volunteered!" narrative — *poor*.
    - C. Anchor on evidence; ignore both feeds — *best*.
    - D. Issue a public statement to calm sentiment — *ok* (procedural, not investigative).
    - Reveal: high-profile trials are won and lost by which narrative the investigator absorbs.
16. **Act VI · The Failed-Ritual Twist** (scene, `interrogation`) — mentor claims the death was an "unintended overreach" of the rite.
17. **Evidence Board #4 · Premeditation** — `prior-deaths` (two earlier "ritual deaths" in mentor's history, reliable, tag `premeditation`), `lethal-instructions` (mentor's own notes specify a fatal step, reliable, tag `premeditation`), `insurance-payout` (mentor named beneficiary on a policy taken out 3 weeks before, reliable, tag `premeditation`).
18. **Choice ⑥ · Was It Murder?** (`q6`)
    - A. Failed ritual / accident — *poor*.
    - B. Voluntary self-harm by victim — *poor*.
    - C. Premeditated lethal act — *best* (s.302 frame).
19. **Choice ⑦ · Victim's Responsibility** (`q7`)
    - A. None at all — *ok* (legally accurate).
    - B. Errors in judgment — *best* (legally none, but acknowledges risk-taking — the chapter's controversy point).
    - C. Partial criminal responsibility — *poor* (legally wrong; victims don't "share" their own murder).
    - Reveal makes explicit: legally A, but the honest analytical answer is B — risk-taking ≠ liability.
20. **Insight · Legal Frame** — Penal Code §302 (murder), §420 (cheating), §34 (common intention) tied to the assistant question.
21. **Verdict scene** (scene, `verdict`).
22. **Ending Resolver + Reflection card.**

### 5. Ending logic

Score across q1–q7 with the optimal answers (B, C, C, C, C, C, B). Q5 and Q7 each carry a penalty if the player picks the "media-driven" or "victim-blames" answers.

- **Perfect (green)** — `q2=C` AND `q6=C` AND `q3=C` AND score ≥ 11: mentor convicted under §302 + §420; assistant receives a reduced sentence with proven coercion; client list opens leads into the syndicate arc.
- **Ambiguous (yellow)** — `q6=C` but other choices weaker, OR media-driven q5: mentor convicted of murder; the public still debates whether the victim "asked for it"; assistant's sentencing is harsh because coercion wasn't argued well.
- **Failure (red)** — `q2 ∈ {A,B}` OR `q6 ∈ {A,B}` OR overall score ≤ 6: ruled "accidental death during ritual"; mentor walks; the client list is never pulled.

### 6. UX details

- Same scene rendering pattern: `step.image ?? sceneImageFor("ritual-of-power", step.sceneKey ?? step.title)`.
- Evidence cards use `evidenceTags` to drive Recap highlighting (`consent-trap`, `lethal-act`, `coercion`, `participation`, `fraud`, `belief`, `premeditation`).
- Media act renders two stacked tabloid mock-cards (one sensational, one apologist) above the choice — implemented inline in the scene step's `lines` plus a small in-page `<div>` block; no new component needed.
- Closing "What This Teaches" card highlights: consent is not a defence to murder, mixed motives are real, media narratives are not evidence, and coercion is mitigation not acquittal.
- Footer: REPLAY + CONTINUE (back to `/chapter/society`).

### Technical notes

- New files: `src/pages/story/RitualOfPower.tsx`, 7 PNGs in `src/assets/scenes/ritual/`.
- Edited files: `src/App.tsx` (route + import), `src/pages/Chapter.tsx` (society card), `src/lib/sceneImages.ts` (chapter id, registry, fallbacks, header comment).
- No backend, no schema changes, no new dependencies.
- Sensitive-topic guard for image gen: silhouettes only, no real religious iconography, no graphic injury — keep visuals symbolic (candles, sigils, empty altar, abstract robes).
- After generation, view each PNG once for tone QA before wiring.