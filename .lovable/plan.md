## Case T — The High-Pay Trap

A new **society-arc** chapter on trafficking-by-deception, modelled on the Wong Jia Yee / "job scam" pattern. Themes: deceptive recruitment, document seizure, debt bondage, and the legal crux that **consent is irrelevant under ATIPSOM 2007 when deception or coercion is the means**. Built on the same single-page narrative pattern as Mask of Authority / Silent Dormitory.

### 1. Routing & navigation

- New page `src/pages/story/HighPayTrap.tsx`.
- Register `/story/high-pay-trap` in `src/App.tsx`.
- Add a "Chapter T · The High-Pay Trap" card in the `society` section of `src/pages/Chapter.tsx`.

### 2. Pixel-art scene assets

Generate 7 new 1024×1024 pixel-art backgrounds in `src/assets/scenes/highpay/`. Tone: no graphic content, no real brands; exploitation shown through environment (locked gates, rows of monitors), not bodies.

| Key | File | Subject |
|---|---|---|
| `cafe` | `hp-cafe.png` | Local café, two friends at a table, one showing a phone with a flashy job ad |
| `office` | `hp-office.png` | Recruitment office, smiling agent across a desk, framed "registered business" certificate |
| `airport` | `hp-airport.png` | Foreign airport arrival hall at night, stern manager with hand out for passports |
| `compound` | `hp-compound.png` | Walled compound at dusk: rows of barred windows, locked gate, single watchtower light |
| `scam-floor` | `hp-scam-floor.png` | Dim room of cubicles with monitors and headsets, time clock on the wall |
| `interrogation` | `hp-interrogation.png` | Standard pixel-art police interrogation room |
| `verdict` | `hp-verdict.png` | Malaysian courtroom (verdict aesthetic) |

### 3. Scene image registry

Update `src/lib/sceneImages.ts`:
- Extend `ChapterId` with `"high-pay-trap"`.
- Add 7 imports + the `high-pay-trap` block in `REGISTRY`.
- Add `TITLE_FALLBACK["high-pay-trap"]`:
  - `/cafe|opportunity|ad|advert|brief/i → cafe`
  - `/office|agent|recruit|trust/i → office`
  - `/airport|arrival|passport|seizure|control/i → airport`
  - `/compound|exploitation|reality|debt|locked/i → compound`
  - `/scam|floor|sunk|rationalis|rationaliz|psychological/i → scam-floor`
  - `/interrogation|confront|suspect/i → interrogation`
  - `/verdict|legal|court|reflection|ending|charge/i → verdict`
- Update the comment-index header.

### 4. Story structure (`HighPayTrap.tsx`)

Same `Step` union as MaskOfAuthority. ~24 steps across 6 acts:

1. **Case Brief** (scene, `cafe`) — A young woman walks into the station after escaping a "compound job" abroad.
2. **Act I · The Opportunity** (scene, `cafe`) — friend introduces the agent; the ad shown.
3. **Evidence Board #1 · The Ad** — `job-ad` (high salary, no experience, board provided, tag `lure`), `agent-card` (registered business cert, reliable, tag `legitimacy-mask`), `friend-chat` (chat from "B", tag `lure`).
4. **Choice ① · Judging the Ad** (`q1`)
   - A. Legitimate — *poor*.
   - B. Exaggerated marketing — *ok*.
   - C. Suspicious, needs more detail — *best* (the optimal investigative posture).
   - D. Obvious scam — *poor* (you skip the grooming evidence).
5. **Act II · Building Trust** (scene, `office`) — agent: "we'll sign the contract once you arrive."
6. **Choice ② · The Recruitment Process** (`q2`)
   - A. Reasonable — *poor*.
   - B. Risky but acceptable — *poor*.
   - C. Major red flag — lack of documentation — *best*.
7. **Act III · The Turning Point** (scene, `airport`) — passports surrendered "for safety and permits".
8. **Insight · Document Seizure** — withholding travel documents is one of the named indicators of trafficking under ATIPSOM and the Palermo Protocol.
9. **Choice ③ · Nature of the Act** (`q3`)
   - A. Company policy — *poor*.
   - B. Safety protocol — *poor*.
   - C. Means of physical/psychological control — *best*.
10. **Act IV · Reality Shatters** (scene, `compound`) — "you owe us thousands; you work until you pay it back."
11. **Evidence Board #2 · Inside the Compound** — `salary-records` (income far below promise, "deductions" for food/lodging/debt, tag `debt-bondage`), `worker-stmts` (chat from "C": "different stories, same room", tag `pattern`), `gate-log` (locked from outside between 22:00–06:00, tag `confinement`).
12. **Choice ④ · Nature of the Case** (`q4`)
    - A. Breach of contract — *poor*.
    - B. Unhappy employee — *poor*.
    - C. Debt bondage / exploitation — *best*.
13. **Act V · The Sunk-Cost Trap** (scene, `scam-floor`) — internal monologue of self-rationalisation while running scam scripts.
14. **Choice ⑤ · The Consent Question (Core Legal Point)** (`q5`)
    - A. She stayed voluntarily — *poor*.
    - B. She had the physical option to run — *poor*.
    - C. Her will is suppressed by psychological/financial control — *best*.
    - Reveal cites ATIPSOM s.2: consent is irrelevant where any prohibited means is used.
15. **Insight · Consent under ATIPSOM** — short legal frame: deception OR coercion OR abuse of position OR debt bondage = consent of the victim is legally irrelevant.
16. **Act VI · The Hidden Phone** (scene, `compound`) — whispered call: "they won't let me leave… please…"; investigation begins.
17. **Evidence Board #3 · The Network** — `recruit-bonus` (chat: "recruit 5 more, RM2000 off your debt", tag `pyramid`), `money-flow` (recruitment agent → "security firm" → offshore wallet, tag `network`), `network-map` (Recruiter → Transporter → Controller → Exploiter, tag `network`), `green-trade-link` (overlap with Chapter Y e-wallets, tag `syndicate`).
18. **Choice ⑥ · The "Consent" Defence** (`q6`) — A. No crime / B. Mitigation / C. Irrelevant under ATIPSOM (best).
19. **Choice ⑦ · Organisational Nature** (`q7`) — A. Lone wolf / B. Small team / C. Structured criminal network (best) / D. Ad-hoc.
20. **Insight · ATIPSOM Four Pillars** — Recruitment (the ad) · Transportation (the journey) · Control (passport seizure) · Exploitation (debt bondage / forced scam labour).
21. **Verdict scene** (`verdict`).
22. **Choice ⑧ · Final Verdict** (`q8`)
    - A. Labour dispute — *poor*.
    - B. Contractual issue — *poor*.
    - C. Trafficking in Persons (ATIPSOM 2007) — *best*.
    - D. Voluntary employment — *poor*.
23. **Ending Resolver + Reflection card**.
24. (Final reflection inside the ending block — link to the syndicate / Green Trade arc.)

### 5. Ending logic

Optimal answers: q1=C, q2=C, q3=C, q4=C, q5=C, q6=C, q7=C, q8=C. Score "best=2, ok=1, poor=0".

- **Justice / Perfect (green)** — `q5=C` AND `q6=C` AND `q8=C` AND score ≥ 13: ATIPSOM conviction; recruiter, transporter and on-site controller all charged; victims protected and repatriated; the money trail opens a thread into the Green Trade e-wallet syndicate.
- **Grey / Recommended (yellow)** — `q8=C` but other choices weaker, OR `q6 ∈ {A,B}`: local agent convicted; the overseas mastermind stays untouchable; the network adapts within weeks.
- **Failure (red)** — `q5 ∈ {A,B}` OR `q8 ∈ {A,B,D}` OR score ≤ 6: ruled a labour dispute or "voluntary employment"; victim deported as an illegal worker; cycle continues.

### 6. UX details

- Standard pattern: `step.image ?? sceneImageFor("high-pay-trap", step.sceneKey ?? step.title)`.
- Evidence tags: `lure`, `legitimacy-mask`, `confinement`, `debt-bondage`, `pattern`, `pyramid`, `network`, `syndicate`.
- Closing "What This Teaches" card: lies + debt + document seizure = a cage without bars; ATIPSOM's four pillars; consent is not a defence.
- Footer: REPLAY + CONTINUE (back to `/chapter/society`).

### Technical notes

- **New files**: `src/pages/story/HighPayTrap.tsx`, 7 PNGs in `src/assets/scenes/highpay/`.
- **Edited files**: `src/App.tsx` (import + route), `src/pages/Chapter.tsx` (society card), `src/lib/sceneImages.ts` (chapter id, registry, fallbacks, header comment).
- No backend, no schema changes, no new dependencies.
- Sensitive-topic guard for image gen: no real brands, no graphic content, no recognisable faces — environment-driven storytelling (locked gate, rows of monitors, hand reaching for passports).
- After image generation, view each PNG once for tone QA before wiring.