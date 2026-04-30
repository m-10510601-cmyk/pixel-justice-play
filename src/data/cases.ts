export type LegalCategory = {
  id: string;
  label: string;
  correct?: boolean;
  rationale: string;
};

export type Evidence = {
  id: string;
  icon: string;
  title: string;
  summary: string;
  detail: string;
  reliable: boolean;
};

export type Verdict = {
  id: "guilty" | "not_guilty";
  label: string;
};

export type Punishment = {
  id: string;
  label: string;
};

export type CaseData = {
  id: string;
  chapter: "school" | "society";
  title: string;
  brief: string;
  statements: { speaker: string; quote: string }[];
  evidence: Evidence[];
  categories: LegalCategory[];
  punishments: Punishment[];
  correctVerdict: Verdict["id"];
  realWorldNote: string;
  standardOfProof: string;
};

export const CASES: CaseData[] = [
  {
    id: "school-1",
    chapter: "school",
    title: "The Missing Laptop",
    brief:
      "A Year-10 student, Alex, is accused of stealing a classmate's laptop from the library during lunch break.",
    statements: [
      { speaker: "Witness — Mia", quote: "I saw Alex near the bag, but I didn't see them open it." },
      { speaker: "Defendant — Alex", quote: "I was at the canteen the whole time. Ask the cashier." },
      { speaker: "Victim — Jordan", quote: "My laptop was gone when I came back from class." },
    ],
    evidence: [
      {
        id: "cctv",
        icon: "📹",
        title: "Library CCTV",
        summary: "Footage shows a hooded figure near the bag.",
        detail: "The figure's face is not visible. Build, height and clothing do not clearly match Alex.",
        reliable: false,
      },
      {
        id: "alibi",
        icon: "🥪",
        title: "Canteen Receipt",
        summary: "Time-stamped receipt at 12:14 PM.",
        detail: "The theft window is 12:10–12:20. Receipt + cashier statement place Alex away from the library.",
        reliable: true,
      },
      {
        id: "rumor",
        icon: "💬",
        title: "Hallway Rumor",
        summary: "Students whisper that Alex 'always needs money'.",
        detail: "Hearsay with no source. Not admissible as evidence of theft.",
        reliable: false,
      },
      {
        id: "fingerprint",
        icon: "🔍",
        title: "No Prints on Bag",
        summary: "Forensic check found no usable prints.",
        detail: "Absence of physical evidence weakens any direct link to Alex.",
        reliable: true,
      },
    ],
    categories: [
      { id: "theft", label: "Theft", rationale: "Requires proof Alex took the laptop. Evidence does not show this." },
      { id: "misconduct", label: "Misconduct", rationale: "No rule-breaking behavior was demonstrated." },
      { id: "insufficient", label: "Insufficient Evidence", correct: true, rationale: "Reliable evidence supports Alex's alibi; no direct proof of theft exists." },
    ],
    punishments: [
      { id: "none", label: "No Action" },
      { id: "warning", label: "Verbal Warning" },
      { id: "suspension", label: "Suspension" },
    ],
    correctVerdict: "not_guilty",
    realWorldNote:
      "In real schools, disciplinary panels require clear, corroborated evidence. Circumstantial presence is rarely enough.",
    standardOfProof: "Balance of probabilities — and here, the probabilities favor the defendant.",
  },
  {
    id: "society-1",
    chapter: "society",
    title: "The Online Investment Scheme",
    brief:
      "Sam, a small business owner, is accused of fraud after running an online 'guaranteed returns' investment group that collapsed.",
    statements: [
      { speaker: "Investor — Priya", quote: "Sam personally promised me 30% monthly returns." },
      { speaker: "Defendant — Sam", quote: "I believed the strategy would work. I lost my own savings too." },
      { speaker: "Accountant — Lee", quote: "Funds from new investors were paid out to earlier ones." },
    ],
    evidence: [
      {
        id: "chats",
        icon: "💬",
        title: "Promotional Chats",
        summary: "Screenshots promising 'guaranteed' returns.",
        detail: "Sam's own messages explicitly use the word 'guaranteed' — a material misrepresentation.",
        reliable: true,
      },
      {
        id: "ledger",
        icon: "📒",
        title: "Bank Ledger",
        summary: "Shows new deposits funding old payouts.",
        detail: "Classic Ponzi-style flow. Strong indicator of fraudulent structure regardless of intent.",
        reliable: true,
      },
      {
        id: "tweet",
        icon: "🐦",
        title: "Anonymous Tweet",
        summary: "An unknown account claims Sam 'always lies'.",
        detail: "Unverified, anonymous source. Not reliable evidence.",
        reliable: false,
      },
      {
        id: "loss",
        icon: "💸",
        title: "Sam's Personal Loss",
        summary: "Sam also lost personal funds.",
        detail: "Suggests possible self-deception, but does not negate misrepresentation to investors.",
        reliable: true,
      },
    ],
    categories: [
      { id: "fraud", label: "Fraud", correct: true, rationale: "Knowing misrepresentation ('guaranteed') + Ponzi-style flow meets the threshold." },
      { id: "negligence", label: "Negligence", rationale: "Understates the deliberate misrepresentation shown in the chats." },
      { id: "insufficient", label: "Insufficient Evidence", rationale: "Two independently reliable evidence streams exist — sufficient." },
    ],
    punishments: [
      { id: "fine", label: "Fine + Restitution" },
      { id: "ban", label: "Industry Ban" },
      { id: "prison", label: "Custodial Sentence" },
    ],
    correctVerdict: "guilty",
    realWorldNote:
      "Real fraud cases (e.g. investment scams) often turn on written promises and money flow patterns, not just intent.",
    standardOfProof: "Beyond reasonable doubt — met by combined documentary evidence.",
  },
];

export const getCase = (id: string) => CASES.find((c) => c.id === id);
export const casesByChapter = (chapter: "school" | "society") =>
  CASES.filter((c) => c.chapter === chapter);