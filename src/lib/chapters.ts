import { STORY as SilentFall } from "@/pages/story/SilentFall";
import { STORY as GreenTrade } from "@/pages/story/GreenTrade";
import { STORY as SilentDormitory } from "@/pages/story/SilentDormitory";
import { STORY as TheRunner } from "@/pages/story/TheRunner";
import { STORY as SilentRoom } from "@/pages/story/SilentRoom";
import { STORY as MaskOfAuthority } from "@/pages/story/MaskOfAuthority";
import { STORY as RitualOfPower } from "@/pages/story/RitualOfPower";
import { STORY as HighPayTrap } from "@/pages/story/HighPayTrap";
import { STORY as DarkNight } from "@/pages/story/DarkNight";
import { isChapterUnlockEarned, computeMaxStars, getChapterBest } from "@/lib/rewards";

export type ChapterDef = {
  slug: string;
  to: string;
  chapter: string;
  title: string;
  tag: string;
  story: any[];
};

export const CHAPTERS: ChapterDef[] = [
  { slug: "silent-fall", to: "/story/silent-fall", chapter: "Chapter 1", title: "Silent Fall", tag: "Real-case inspired · multi-ending", story: SilentFall },
  { slug: "green-trade", to: "/story/green-trade", chapter: "Chapter 2", title: "The Green Trade", tag: "Campus drug trafficking · syndicate hook", story: GreenTrade },
  { slug: "silent-dormitory", to: "/story/silent-dormitory", chapter: "Chapter 3", title: "The Silent Dormitory", tag: "Mob mentality · §302 vs §304", story: SilentDormitory },
  { slug: "the-runner", to: "/story/the-runner", chapter: "Chapter 4", title: "The Runner", tag: "Cross-border impersonation scam", story: TheRunner },
  { slug: "silent-room", to: "/story/silent-room", chapter: "Chapter 5", title: "The Silent Room", tag: "Child protection · systemic failure", story: SilentRoom },
  { slug: "mask-of-authority", to: "/story/mask-of-authority", chapter: "Chapter 6", title: "The Mask of Authority", tag: "Impersonation scam · syndicate hook", story: MaskOfAuthority },
  { slug: "ritual-of-power", to: "/story/ritual-of-power", chapter: "Chapter 7", title: "The Ritual of Power", tag: "Cult manipulation · consent vs legality", story: RitualOfPower },
  { slug: "high-pay-trap", to: "/story/high-pay-trap", chapter: "Chapter 8", title: "The High-Pay Trap", tag: "Trafficking by deception · ATIPSOM 2007", story: HighPayTrap },
  { slug: "dark-night", to: "/story/dark-night", chapter: "Chapter 9", title: "Responsibility of the Dark Night", tag: "Negligence vs. unforeseeability · public bias", story: DarkNight },
];

export const isChapterUnlocked = (index: number): boolean => {
  if (index <= 0) return true;
  const prev = CHAPTERS[index - 1];
  return isChapterUnlockEarned(prev.slug, prev.story);
};

export { computeMaxStars, getChapterBest };