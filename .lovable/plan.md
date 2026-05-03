## New Case: Responsibility of the Dark Night

A 9-act story chapter inspired by the Basikal Lajak case, focused on negligence vs. unforeseeability and public-opinion bias.

### Files to add

- `src/pages/story/DarkNight.tsx` — full 9-act story page (scene → evidence → choice → insight → ending), modeled on `HighPayTrap.tsx`. Uses existing `SceneDialogue`, `EvidenceBoard`, `ChoicePanel`, and `useStoryProgress` for save/continue.
- `src/assets/scenes/darknight/` — 6 generated pixel-art scenes:
  - `dn-highway.png` (midnight highway impact)
  - `dn-scene.png` (chaotic accident site, bystanders)
  - `dn-station.png` (police station / first report)
  - `dn-flashback.png` (driver memory, shadows in headlights)
  - `dn-feed.png` (social-media polarization)
  - `dn-court.png` (courtroom / expert testimony)
  - `dn-verdict.png` (final judgment ending card)

### Files to edit

- `src/App.tsx` — register route `/story/dark-night` → `DarkNight`.
- `src/pages/Quest.tsx` — append a 9th case card: `Chapter S · Responsibility of the Dark Night` (tag: "Negligence vs. unforeseeability · public bias").
- `src/lib/sceneImages.ts` — register the 6 darknight scene keys (`highway`, `scene`, `station`, `flashback`, `feed`, `court`, `verdict`) under slug `dark-night`.

### Story structure (mirrors existing chapters)

Steps in order:
1. Scene — Act I Impact (highway)
2. Choice ① Initial Impression (best: B/D)
3. Scene — Act II Chaos (bystanders)
4. Choice ② Social Influence (best: C)
5. Evidence — Initial intel (road, lighting, group)
6. Scene — Act III First Report
7. Choice ③ Nature of case (best: B)
8. Scene — Act IV Driver flashback
9. Choice ④ Foreseeability (best: B/C)
10. Scene — Act V Teenagers earlier that night
11. Choice ⑤ Judging the group (best: B+C)
12. Evidence — Speed data, modified bicycles, no signage
13. Scene — Act VI Social media explosion
14. Choice ⑥ Bias test (best: C; A/B applies hidden bias penalty to score)
15. Scene — Act VII Expert testimony
16. Choice ⑦ Technical reality (best: B)
17. Scene — Act VIII Legal showdown
18. Choice ⑧ Negligence (best: C — contributory)
19. Choice ⑨a Driver liability (best: B partial)
20. Choice ⑨b Teenagers liability (best: B/C)
21. Choice ⑨c Social system (best: D multi-party — hidden high score)
22. Insight — syndicate hook: night-activity videos uploaded → traffic/gambling recruitment
23. Ending screen — three branches:
    - 🟢 Balanced (most "best" picks, no bias penalty)
    - 🟡 Emotional (bias penalty triggered)
    - 🔴 Failure (extreme one-sided liability)

### Technical details

- `useStoryProgress({ slug: "dark-night", title: "Responsibility of the Dark Night", route: "/story/dark-night", ... })` — automatic save/restore + Continue button on Index/Quest, consistent with the other 8 chapters.
- Choice options carry `evidenceRefs`/`evidenceTags` to highlight the relevant evidence (road conditions, speed, modified bikes), reusing the highlight pipeline already in `HighPayTrap.tsx`.
- `gradeEnding(answers)` computes a score: +1 per "best" answer, -2 if Choice ⑥ is A or B (bias penalty), +2 if Choice ⑨c = D. Thresholds map to Balanced / Emotional / Failure.
- Scene images generated at 1024×1024 pixel-art, dark cinematic palette consistent with existing chapters.

No backend or schema changes required.