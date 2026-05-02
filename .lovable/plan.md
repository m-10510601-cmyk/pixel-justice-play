## The Green Trade — Campus Drug Trafficking Chapter

A new interactive story chapter following the exact structure of `Silent Fall` (scene → evidence → choice → insight → multi-ending), themed around a campus drug trafficking investigation that hooks into the main syndicate storyline.

### Files to create

**1. `src/pages/story/GreenTrade.tsx`** (new — mirrors `SilentFall.tsx`)

Reuses existing components: `GameFrame`, `SceneDialogue`, `EvidenceBoard`, `ChoicePanel`, `DialogueLine`. Same state model: `STORY` array of typed steps, `Answers` map, `gradeEnding()` scoring, three endings.

`ChoiceKey` set: `q1` (starting point), `q2` (chat assessment), `q3` (suspect profiling), `q4` (case nature), `iA` (interrogate A), `iB` (interrogate B), `q5A` (charge A), `q5B` (charge B).

Scoring → endings:
- 🟢 Perfect: q1∈{B,C} + q2=B + q3=C + q4=C + iA=B + iB=B + q5A=C + q5B=B → upstream syndicate hook unlocked
- 🟡 Mid: partial — students caught, network hidden
- 🔴 Failure: q4=A or q5A=A → "personal use" closure, cold trail

**2. `src/App.tsx`** — add route `/story/green-trade` → `<GreenTrade />`

**3. `src/pages/Chapter.tsx`** — add a second ★ MAIN STORY card on the `school` chapter page linking to `/story/green-trade` (label: "Chapter Y · The Green Trade").

### Story outline (8 acts, ~16 steps)

```text
Act I  · Tip-off               scene  (Police Station briefing)
       · Choice ①              choice (investigation starting point)

Act II · Coded chat logs       evidence (chat: "green stuff", "RM50/pack")
       · Choice ②              choice (assess content)

Act III· Suspect profiles      scene  + evidence (Suspect A low-key / B socialite)
       · Choice ③              choice (who is suspicious — best: BOTH)

Act IV · Key evidence dump     evidence (e-wallet ledger, sealed package, lab report >1kg cannabis)
       · Choice ④              choice (nature of case — best: distribution)
       · Insight               (Dangerous Drugs Act 1952 — presumption of trafficking)

Act V  · Interrogation A       scene  + choice iA ("just keeping it" → press funds)
       · Interrogation B       scene  + choice iB ("everyone sells" → press upstream)

Act VI · Charge decisions      choice q5A (Suspect A) + choice q5B (Suspect B)

Act VII· Phone forensics       evidence (coded contacts, large account links)
       · Insight               (one node in National Drug Syndicate — main-story hook)

Act VIII· Final reflection     scene  (verdict moment)
```

### Choice content (key options, all with `hint` + `rationale` like SilentFall)

- **Choice ①**: A Raid dorms / B Tail transactions ✅best / C Analyse financials ✅best / D Observe campus (ok)
- **Choice ②**: A Normal / B Suspicious ✅best / C Clearly illegal (poor — premature) / D Indeterminable
- **Choice ③**: A Only A / B Only B / C Both ✅best / D Neither
- **Choice ④**: A Personal use / B Small dealing / C Distribution network ✅best / D Uncertain
- **Interrogation A**: A Believe him / B Question funds ✅best / C Threaten / D Release
- **Interrogation B**: A Accept excuse / B Press upstream ✅best / C Charge solo / D Drop
- **Charge A**: A Possession / B Distributor (ok) / C Trafficking ✅best (>1kg presumption) / D Insufficient
- **Charge B**: A Possession / B Distributor ✅best / C Trafficking (overreach) / D Insufficient

### Endings

- 🟢 **Perfect — "The Chain Revealed"**: Both convicted appropriately; phone metadata exposes upstream node; main syndicate plot unlocks.
- 🟡 **Mid — "Two Caught, Network Intact"**: Convictions secured but coded contacts go unanalysed; the syndicate continues.
- 🔴 **Failure — "Closed as Personal Use"**: Severity underestimated, case downgraded, lead dies.

### Visual assets

Reuse existing `scene-*.png` backgrounds from `src/assets/scenes/` (no new image generation in this plan — the same fallback pattern as SilentFall, where any missing image just shows the title card). If you'd like dedicated pixel art for the police station / dorm raid / interrogation room / phone forensics scenes, say so and I'll generate them in the build step.

### Out of scope

- No changes to `src/data/cases.ts` (this is a story chapter, not a case-file case).
- No new shared components — fully reuses `EvidenceBoard`, `ChoicePanel`, `SceneDialogue`.
- No localisation file changes (story text is English, matching SilentFall).
