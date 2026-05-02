// =============================================================================
// Scene → Image registry
// -----------------------------------------------------------------------------
// Each chapter declares scene-keys that map to a dedicated pixel-art background.
// Story files can either set `sceneKey: "..."` on a scene step, or rely on the
// title-keyword fallback below. An explicit `image:` on a step always wins.
//
// Registry index (chapter / key → asset):
//   the-runner / brief          → runner-brief.png
//   the-runner / call           → runner-call.png
//   the-runner / door           → runner-door.png
//   the-runner / station        → runner-station.png
//   the-runner / arrest         → runner-arrest.png
//   the-runner / interrogation  → runner-interrogation.png
//   the-runner / reflection     → runner-reflection.png
//
//   green-trade / tipoff          → gt-tipoff.png
//   green-trade / surveillance    → gt-surveillance.png
//   green-trade / twofaces        → gt-twofaces.png
//   green-trade / interrogation-a → gt-interrogation-a.png
//   green-trade / interrogation-b → gt-interrogation-b.png
//   green-trade / reflection      → gt-reflection.png
//
//   silent-room / er             → sr-er.png
//   silent-room / medical        → sr-medical.png
//   silent-room / neighborhood   → sr-neighborhood.png
//   silent-room / records        → sr-records.png
//   silent-room / interrogation  → sr-interrogation.png
//   silent-room / verdict        → sr-verdict.png
//   silent-room / reflection     → sr-reflection.png
//
//   mask-of-authority / report        → mask-report.png
//   mask-of-authority / call          → mask-call.png
//   mask-of-authority / doorstep      → mask-doorstep.png
//   mask-of-authority / money         → mask-money.png
//   mask-of-authority / interrogation → mask-interrogation.png
//   mask-of-authority / scripts       → mask-scripts.png
//   mask-of-authority / verdict       → mask-verdict.png
//
//   ritual-of-power / disappearance  → rt-disappearance.png
//   ritual-of-power / ritual         → rt-ritual.png
//   ritual-of-power / mentor         → rt-mentor.png
//   ritual-of-power / assistant      → rt-assistant.png
//   ritual-of-power / media          → rt-media.png
//   ritual-of-power / interrogation  → rt-interrogation.png
//   ritual-of-power / verdict        → rt-verdict.png
//
//   silent-dormitory / dorm-night            → dm-dorm-night.png
//   silent-dormitory / interrogation-circle  → dm-circle.png
//   silent-dormitory / escalation            → dm-escalation.png
//   silent-dormitory / routine               → dm-routine.png
//   silent-dormitory / collapse              → dm-collapse.png
//   silent-dormitory / hospital              → dm-hospital.png
//   silent-dormitory / verdict               → dm-verdict.png
// =============================================================================

import runnerBrief from "@/assets/scenes/runner/runner-brief.png";
import runnerCall from "@/assets/scenes/runner/runner-call.png";
import runnerDoor from "@/assets/scenes/runner/runner-door.png";
import runnerStation from "@/assets/scenes/runner/runner-station.png";
import runnerArrest from "@/assets/scenes/runner/runner-arrest.png";
import runnerInterrogation from "@/assets/scenes/runner/runner-interrogation.png";
import runnerReflection from "@/assets/scenes/runner/runner-reflection.png";

import gtTipoff from "@/assets/scenes/greentrade/gt-tipoff.png";
import gtSurveillance from "@/assets/scenes/greentrade/gt-surveillance.png";
import gtTwoFaces from "@/assets/scenes/greentrade/gt-twofaces.png";
import gtInterrogationA from "@/assets/scenes/greentrade/gt-interrogation-a.png";
import gtInterrogationB from "@/assets/scenes/greentrade/gt-interrogation-b.png";
import gtReflection from "@/assets/scenes/greentrade/gt-reflection.png";

import srEr from "@/assets/scenes/silentroom/sr-er.png";
import srMedical from "@/assets/scenes/silentroom/sr-medical.png";
import srNeighborhood from "@/assets/scenes/silentroom/sr-neighborhood.png";
import srRecords from "@/assets/scenes/silentroom/sr-records.png";
import srInterrogation from "@/assets/scenes/silentroom/sr-interrogation.png";
import srVerdict from "@/assets/scenes/silentroom/sr-verdict.png";
import srReflection from "@/assets/scenes/silentroom/sr-reflection.png";

import maskReport from "@/assets/scenes/mask/mask-report.png";
import maskCall from "@/assets/scenes/mask/mask-call.png";
import maskDoorstep from "@/assets/scenes/mask/mask-doorstep.png";
import maskMoney from "@/assets/scenes/mask/mask-money.png";
import maskInterrogation from "@/assets/scenes/mask/mask-interrogation.png";
import maskScripts from "@/assets/scenes/mask/mask-scripts.png";
import maskVerdict from "@/assets/scenes/mask/mask-verdict.png";

import rtDisappearance from "@/assets/scenes/ritual/rt-disappearance.png";
import rtRitual from "@/assets/scenes/ritual/rt-ritual.png";
import rtMentor from "@/assets/scenes/ritual/rt-mentor.png";
import rtAssistant from "@/assets/scenes/ritual/rt-assistant.png";
import rtMedia from "@/assets/scenes/ritual/rt-media.png";
import rtInterrogation from "@/assets/scenes/ritual/rt-interrogation.png";
import rtVerdict from "@/assets/scenes/ritual/rt-verdict.png";

import dmDormNight from "@/assets/scenes/dormitory/dm-dorm-night.png";
import dmCircle from "@/assets/scenes/dormitory/dm-circle.png";
import dmEscalation from "@/assets/scenes/dormitory/dm-escalation.png";
import dmRoutine from "@/assets/scenes/dormitory/dm-routine.png";
import dmCollapse from "@/assets/scenes/dormitory/dm-collapse.png";
import dmHospital from "@/assets/scenes/dormitory/dm-hospital.png";
import dmVerdict from "@/assets/scenes/dormitory/dm-verdict.png";

export type ChapterId =
  | "the-runner"
  | "green-trade"
  | "silent-room"
  | "mask-of-authority"
  | "ritual-of-power"
  | "silent-dormitory";

const REGISTRY: Record<ChapterId, Record<string, string>> = {
  "the-runner": {
    brief: runnerBrief,
    call: runnerCall,
    door: runnerDoor,
    station: runnerStation,
    arrest: runnerArrest,
    interrogation: runnerInterrogation,
    reflection: runnerReflection,
  },
  "green-trade": {
    tipoff: gtTipoff,
    surveillance: gtSurveillance,
    twofaces: gtTwoFaces,
    "interrogation-a": gtInterrogationA,
    "interrogation-b": gtInterrogationB,
    reflection: gtReflection,
  },
  "silent-room": {
    er: srEr,
    medical: srMedical,
    neighborhood: srNeighborhood,
    records: srRecords,
    interrogation: srInterrogation,
    verdict: srVerdict,
    reflection: srReflection,
  },
  "mask-of-authority": {
    report: maskReport,
    call: maskCall,
    doorstep: maskDoorstep,
    money: maskMoney,
    interrogation: maskInterrogation,
    scripts: maskScripts,
    verdict: maskVerdict,
  },
  "ritual-of-power": {
    disappearance: rtDisappearance,
    ritual: rtRitual,
    mentor: rtMentor,
    assistant: rtAssistant,
    media: rtMedia,
    interrogation: rtInterrogation,
    verdict: rtVerdict,
  },
  "silent-dormitory": {
    "dorm-night": dmDormNight,
    "interrogation-circle": dmCircle,
    escalation: dmEscalation,
    routine: dmRoutine,
    collapse: dmCollapse,
    hospital: dmHospital,
    verdict: dmVerdict,
  },
};

// Title-keyword fallback per chapter — first match wins.
const TITLE_FALLBACK: Record<ChapterId, Array<[RegExp, string]>> = {
  "the-runner": [
    [/brief|case file/i, "brief"],
    [/\bcall\b|fear|manipulation/i, "call"],
    [/collection|\bdoor\b/i, "door"],
    [/suspicion|station/i, "station"],
    [/arrest|checkpoint/i, "arrest"],
    [/interrogation|breaking/i, "interrogation"],
    [/reflection|ending|verdict/i, "reflection"],
  ],
  "green-trade": [
    [/tip-?off|act\s+i\b/i, "tipoff"],
    [/surveillance|intercept/i, "surveillance"],
    [/two faces|profile/i, "twofaces"],
    [/suspect a/i, "interrogation-a"],
    [/suspect b/i, "interrogation-b"],
    [/reflection|final/i, "reflection"],
  ],
  "silent-room": [
    [/er\b|emergency|brief|hospital/i, "er"],
    [/medical|x-?ray|fracture|anomal/i, "medical"],
    [/neighbour|neighbor|hood|testimon/i, "neighborhood"],
    [/records|clinic|history|hidden|pattern/i, "records"],
    [/interrogation|guardian/i, "interrogation"],
    [/verdict|legal|judgment|judgement|court/i, "verdict"],
    [/reflection|ending|silent room/i, "reflection"],
  ],
  "mask-of-authority": [
    [/report|station|brief/i, "report"],
    [/call|vishing|phone/i, "call"],
    [/door|on-?site|collection/i, "doorstep"],
    [/money|financial|trail|mule/i, "money"],
    [/interrogation|arrest|suspect/i, "interrogation"],
    [/script|phone evidence|twist|folder/i, "scripts"],
    [/verdict|legal|court|reflection|ending/i, "verdict"],
  ],
  "ritual-of-power": [
    [/disappear|missing|brief/i, "disappearance"],
    [/ritual|ceremony|chamber|site/i, "ritual"],
    [/mentor|guru|master|money/i, "mentor"],
    [/assistant|lina|brainwash/i, "assistant"],
    [/media|headline|tabloid|press|pressure/i, "media"],
    [/interrogation|twist/i, "interrogation"],
    [/verdict|legal|court|reflection|ending/i, "verdict"],
  ],
  "silent-dormitory": [
    [/dorm|seed|brief|laptop|suspicion/i, "dorm-night"],
    [/interrogation|questioning|circle|pressure/i, "interrogation-circle"],
    [/escalation|hidden|thread|exit|punishment/i, "escalation"],
    [/routine|normalisation|normalization|silence|habituation/i, "routine"],
    [/collapse|breaking|crisis/i, "collapse"],
    [/hospital|aftermath|doctor/i, "hospital"],
    [/verdict|legal|court|reflection|ending|charge/i, "verdict"],
  ],
};

/**
 * Resolve the background image for a scene step.
 * @param chapter    Chapter id, e.g. "the-runner".
 * @param keyOrTitle Explicit sceneKey ("call") or the scene title.
 */
export function sceneImageFor(
  chapter: ChapterId,
  keyOrTitle?: string,
): string | undefined {
  if (!keyOrTitle) return undefined;
  const chapterMap = REGISTRY[chapter];
  if (!chapterMap) return undefined;

  const direct = chapterMap[keyOrTitle];
  if (direct) return direct;

  for (const [pattern, key] of TITLE_FALLBACK[chapter]) {
    if (pattern.test(keyOrTitle)) {
      const hit = chapterMap[key];
      if (hit) return hit;
    }
  }
  return undefined;
}
