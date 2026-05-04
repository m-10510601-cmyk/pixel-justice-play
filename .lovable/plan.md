## Add "Responsibility of the Dark Night" card to Case Selection Hub

The chapter exists (route, page, assets) but is missing from the `CASES` array in `src/pages/Quest.tsx`, so there's no card to click on `/quest`.

### Change

Edit `src/pages/Quest.tsx` — append one entry to the `CASES` array:

```ts
{ to: "/story/dark-night", chapter: "Chapter S", title: "Responsibility of the Dark Night", tag: "Negligence vs. unforeseeability · public bias" },
```

That's it — the existing `.map()` render and `useStoryProgress` continue/progress-bar logic will pick it up automatically. No other files need changes.