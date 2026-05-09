# Show portraits for all dialogue speakers (Ch.2–9)

## Problem

In `DialogueLine.tsx`, the speaker name is mapped to a `CharacterKey` via `inferCharacter()`. Today only 5 portraits exist: `principal | parent | you | aira | narrator`. Every speaker in chapters 2–9 (Officer Tan, Profiler, Suspect A/B, Doctor, Student A–E, Driver, Teen A/B, Journalist, Expert, Prosecution, Defence, Bystander, Mei, Agent, Manager, Supervisor, Friend, Caller, Madam Tan, Bank Liaison, Tech, Forensics, Investigator, Lina, Mentor, Mr. Tan, Officer Lim, Fake MAS Officer, Suspect, Neighbour A/B, Guardian, Victim, Narrator, …) falls through to `narrator` (a faceless silhouette) — so only the player's judge portrait shows.

## Fix (frontend only)

### 1. `src/components/story/CharacterPortrait.tsx`

Extend `CharacterKey` and add new 16×16 pixel-art portraits, all built with the same `block(x,y,w,h,color)` helper + `Face` base already in the file. New keys (each gets a distinct silhouette via hat/hair/uniform/skin tone so the player can tell them apart at a glance):

- `officer` — police cap + badge, navy uniform collar
- `detective` — fedora + trench collar (used for Profiler / Investigator / Forensics)
- `lawyer` — barrister wig + black robe + white tab (used for Prosecution / Defence / Mentor)
- `doctor` — surgical cap + mask + scrubs collar
- `student_m`, `student_f` — school uniform, two hair variants (covers Student A–E, Teen A/B, Lina, Mei, Aira already exists)
- `suspect` — hoodie up, shadowed eyes (Suspect, Suspect A/B, Driver)
- `civilian_m`, `civilian_f` — plain shirt/blouse, neutral hair (Mr. Tan, Madam Tan, Friend, Neighbour, Bystander, Guardian, Victim, Agent, Manager, Supervisor, Bank Liaison, Tech, Caller)
- `journalist` — TV-mic foreground + blazer collar
- `expert` — glasses + lab coat collar
- `voice` — silhouette + speech-wave overlay (Caller / Fake MAS Officer / Narrator-as-VO)

Reuse existing `Face` skin tones; vary hair/hat colors. No new assets — pure CSS blocks, matches current 16-bit aesthetic.

### 2. `src/components/story/DialogueLine.tsx` — `inferCharacter()`

Expand the lookup to a name→key map covering every speaker found in `src/pages/story/*.tsx`:

```text
you / guardian            → you
principal                 → principal
parent                    → parent
aira                      → aira
officer / officer tan/lim → officer
profiler/investigator/forensics → detective
prosecution/defence/mentor → lawyer
doctor                    → doctor
student a/b/c/d/e         → student_m / student_f (alternate by letter)
teen a/b                  → student_m / student_f
lina / mei                → student_f
suspect / suspect a/b / driver → suspect
journalist                → journalist
expert                    → expert
caller / fake mas officer / narrator (when spoken) → voice
mr. tan / friend / agent / manager / supervisor / bank liaison / tech / neighbour a/b / bystander / guardian (chapter 5) / victim → civilian_m
madam tan                 → civilian_f
```

Matching is lower-cased substring, with longer/more-specific names checked first (e.g. `madam tan` before `tan`, `fake mas officer` before `officer`).

### 3. No other files change

`SceneDialogue` already calls `DialogueLine`, so once `inferCharacter` resolves a real key the portrait renders automatically. Story data files (`src/pages/story/*.tsx`) are untouched — speakers stay as written.

## QA

Walk one beat from each chapter 2–9 in the preview and confirm a non-`you` speaker now shows a portrait that visually matches their role (cop = cap, lawyer = wig, student = uniform, suspect = hoodie, etc.).
