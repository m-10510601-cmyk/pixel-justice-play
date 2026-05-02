# Plan: Optional Voice Narration for Dialogue

Add ElevenLabs text-to-speech to the Silent Fall dialogue scenes. When enabled, each line is read aloud and the typewriter effect synchronizes its reveal speed to the audio's duration so the text finishes typing exactly when the voice finishes speaking.

## What the user will see

In each scene:
- A new toolbar button next to AUTO/SKIP: **🔊 VOICE** (toggle on/off, persisted).
- When **VOICE is ON**:
  - As each new dialogue line appears, audio starts playing.
  - Typewriter pace adapts to the audio length: the last character is revealed right as the line finishes speaking.
  - Different voices per character (Principal, Aira's Parent, You / inner monologue, narrator).
  - Inner monologue uses a softer, more intimate voice with lower volume.
  - A subtle "🔊" pulse appears on the active speaker's portrait.
  - "PAUSE" stops both audio and typing; "SKIP ▶▶" stops audio and reveals all lines.
- When **VOICE is OFF**: behaves exactly like today (constant `charDelay` typewriter, no audio).

A global setting in **Settings → Sound** also exposes a master "Voice Narration" toggle so it persists across sessions.

## Required setup

1. **Lovable Cloud** must be enabled — needed to host the secure edge function that holds the ElevenLabs API key.
2. **ElevenLabs API key** must be added as a secret (`ELEVENLABS_API_KEY`) in Lovable Cloud. After enabling Cloud, the user will be prompted to paste the key.

## How it will be built

### 1. Edge function `supabase/functions/tts/index.ts`
- Accepts `{ text, voiceId, modelId? }` POST body.
- Calls ElevenLabs `/v1/text-to-speech/{voiceId}?output_format=mp3_44100_128`.
- Returns raw `audio/mpeg` bytes (no base64) with permissive CORS so the browser can `fetch().blob()` it directly.
- Uses `eleven_turbo_v2_5` by default for low first-byte latency.
- Errors return JSON `{ error }` with 4xx/5xx status; client falls back to silent typewriter.

### 2. Voice mapping `src/lib/voiceMap.ts`
Maps each `CharacterKey` to an ElevenLabs voice ID + per-character settings:
- `principal` → George (`JBFqnCBsd6RMkjVDRZzb`) — formal, controlled.
- `parent` → Sarah (`EXAVITQu4vr4xnSDxMaL`) — warm, worried.
- `aira` → Lily (`pFZP5JQG7iQjIQuC4Bku`) — young, soft.
- `you` (player, spoken) → Brian (`nPczCjzI2devNBz1zQrb`).
- `you` (inner monologue) → River (`SAz9YHcvj6GT2YYXdXww`) — quieter, lower volume.
- `narrator` → Daniel (`onwK4e9ZLuTAKqWW03F9`).

### 3. Audio hook `src/hooks/useLineNarration.ts`
- `play(text, voiceId, opts)` → `Promise<{ duration: number; stop: () => void }>`.
- Internally fetches the edge function URL, creates an `Audio` from a blob URL, awaits `loadedmetadata` to get `duration`, then plays.
- Caches blobs in an in-memory `Map<key, Blob>` (key = `voiceId + sha1(text)`) so re-typing the same line (RETRY) is instant and free.
- Exposes `stopAll()` to halt any active sound.
- Handles "voice off" / API errors gracefully by resolving with `duration: 0`.

### 4. Update `SceneDialogue.tsx`
- Accept new prop `voiceEnabled: boolean`.
- When a new line becomes current:
  1. If voice on, request audio first; once `duration` is known, set effective `charDelay = max(15, (duration*1000 - 250) / textLength)` so typing pace matches the spoken pace (a small lead-out pad keeps the cursor from racing past speech).
  2. Start typewriter and `audio.play()` together.
  3. On audio `ended`, advance after the existing `pauseAfter`.
- When user presses PAUSE: pause audio + stop typewriter timer.
- When SKIP: stop audio, reveal all lines instantly.
- When user taps to skip a line: stop audio for that line and advance.

### 5. UI additions
- `SceneDialogue` toolbar gains a **🔊 / 🔈** button bound to local + global voice setting.
- `CharacterPortrait` accepts new prop `talking?: boolean`; when true, adds a small pulsing speaker dot in the corner.
- `Settings.tsx` adds a "Voice Narration" toggle row under SOUND, stored in `SettingsContext` as `voiceNarration: boolean` (default `false`).
- `SettingsContext` persists the new flag to `localStorage` like the existing `sound` flag.

### 6. Files

Create:
- `supabase/functions/tts/index.ts`
- `src/lib/voiceMap.ts`
- `src/hooks/useLineNarration.ts`

Edit:
- `src/components/story/SceneDialogue.tsx` (audio sync + voice toggle)
- `src/components/story/CharacterPortrait.tsx` (add `talking` indicator)
- `src/game/SettingsContext.tsx` (add `voiceNarration` flag + persistence + i18n strings)
- `src/pages/Settings.tsx` (add toggle row)
- `src/pages/story/SilentFall.tsx` (pass global `voiceNarration` to `SceneDialogue`)

## Technical notes

- All audio bytes flow through the edge function — the ElevenLabs key never reaches the client.
- We rely on `audio.duration` (read after `loadedmetadata`) to compute the per-character delay; if the metadata doesn't arrive in 600ms we fall back to the default `charDelay` and just play the audio over the standard typing.
- The blob cache lives in memory only (no IndexedDB); a full page reload re-fetches. This keeps things simple and avoids stale-cache bugs.
- Voice narration default is **OFF** to avoid surprise audio on first visit.
- No changes to choice/evidence/insight steps.
