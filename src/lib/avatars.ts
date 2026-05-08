import type { CSSProperties, ReactNode } from "react";

const KEY = "lawguardian.avatar.v1";

export type AvatarId =
  | "rookie"
  | "scholar"
  | "officer"
  | "advocate"
  | "detective"
  | "judge"
  | "guardian"
  | "shadow";

export type AvatarDef = {
  id: AvatarId;
  name: string;
  unlockLevel: number;
  render: (size: number) => ReactNode;
};

const px = (size: number, ratio: number) => Math.max(1, Math.round(size * ratio));

const Frame = ({
  size,
  bg,
  shadow,
  children,
}: {
  size: number;
  bg: string;
  shadow: string;
  children?: ReactNode;
}) => {
  const s: CSSProperties = {
    width: size,
    height: size,
    background: bg,
    border: `${px(size, 0.07)}px solid hsl(0 0% 0%)`,
    boxShadow: `inset 0 -${px(size, 0.11)}px 0 ${shadow}, inset 0 ${px(size, 0.11)}px 0 hsl(0 0% 100% / 0.18)`,
    position: "relative",
    flexShrink: 0,
  };
  return (
    <div style={s} aria-hidden="true">
      {children}
    </div>
  );
};

const Eyes = ({ size, color = "hsl(0 0% 0%)", top = 0.39 }: { size: number; color?: string; top?: number }) => (
  <>
    <div className="absolute avatar-blink-eye" style={{ top: px(size, top), left: px(size, 0.21), width: px(size, 0.11), height: px(size, 0.11), background: color }} />
    <div className="absolute avatar-blink-eye" style={{ top: px(size, top), right: px(size, 0.21), width: px(size, 0.11), height: px(size, 0.11), background: color }} />
  </>
);

const Mouth = ({ size, color = "hsl(0 0% 0%)", w = 0.21 }: { size: number; color?: string; w?: number }) => (
  <div className="absolute" style={{ bottom: px(size, 0.14), left: "50%", transform: "translateX(-50%)", width: px(size, w), height: px(size, 0.04), background: color }} />
);

export const AVATARS: AvatarDef[] = [
  {
    id: "rookie",
    name: "Rookie",
    unlockLevel: 1,
    render: (size) => (
      <Frame size={size} bg="hsl(28 35% 62%)" shadow="hsl(28 35% 45%)">
        <div className="absolute" style={{ top: px(size, 0.07), left: px(size, 0.07), right: px(size, 0.07), height: px(size, 0.21), background: "hsl(0 0% 92%)", boxShadow: "inset 0 0 0 1px hsl(0 0% 0%)" }} />
        <Eyes size={size} />
        <Mouth size={size} />
      </Frame>
    ),
  },
  {
    id: "scholar",
    name: "Scholar",
    unlockLevel: 1,
    render: (size) => (
      <Frame size={size} bg="hsl(32 50% 70%)" shadow="hsl(32 50% 50%)">
        {/* hair */}
        <div className="absolute" style={{ top: px(size, 0.07), left: px(size, 0.07), right: px(size, 0.07), height: px(size, 0.18), background: "hsl(28 60% 25%)" }} />
        {/* glasses bar */}
        <div className="absolute" style={{ top: px(size, 0.43), left: px(size, 0.14), right: px(size, 0.14), height: px(size, 0.04), background: "hsl(0 0% 0%)" }} />
        <Eyes size={size} top={0.39} />
        <Mouth size={size} />
      </Frame>
    ),
  },
  {
    id: "officer",
    name: "Officer",
    unlockLevel: 2,
    render: (size) => (
      <Frame size={size} bg="hsl(28 35% 62%)" shadow="hsl(28 35% 45%)">
        {/* cap */}
        <div className="absolute" style={{ top: px(size, 0.04), left: px(size, 0.04), right: px(size, 0.04), height: px(size, 0.18), background: "hsl(220 60% 25%)" }} />
        {/* badge */}
        <div className="absolute" style={{ top: px(size, 0.09), left: "50%", transform: "translateX(-50%)", width: px(size, 0.11), height: px(size, 0.11), background: "hsl(48 100% 60%)" }} />
        {/* visor */}
        <div className="absolute" style={{ top: px(size, 0.22), left: px(size, 0.04), right: px(size, 0.04), height: px(size, 0.07), background: "hsl(0 0% 0%)" }} />
        <Eyes size={size} top={0.43} />
        <Mouth size={size} />
      </Frame>
    ),
  },
  {
    id: "advocate",
    name: "Advocate",
    unlockLevel: 3,
    render: (size) => (
      <Frame size={size} bg="hsl(28 35% 62%)" shadow="hsl(28 35% 45%)">
        {/* black robe top */}
        <div className="absolute" style={{ bottom: 0, left: 0, right: 0, height: px(size, 0.32), background: "hsl(0 0% 8%)" }} />
        {/* white collar */}
        <div className="absolute" style={{ bottom: px(size, 0.07), left: "50%", transform: "translateX(-50%)", width: px(size, 0.21), height: px(size, 0.14), background: "hsl(0 0% 96%)" }} />
        {/* hair */}
        <div className="absolute" style={{ top: px(size, 0.07), left: px(size, 0.07), right: px(size, 0.07), height: px(size, 0.18), background: "hsl(0 0% 10%)" }} />
        <Eyes size={size} top={0.36} />
      </Frame>
    ),
  },
  {
    id: "detective",
    name: "Detective",
    unlockLevel: 3,
    render: (size) => (
      <Frame size={size} bg="hsl(28 35% 62%)" shadow="hsl(28 35% 45%)">
        {/* fedora top */}
        <div className="absolute" style={{ top: px(size, 0.04), left: px(size, 0.18), right: px(size, 0.18), height: px(size, 0.14), background: "hsl(20 35% 22%)" }} />
        {/* fedora brim */}
        <div className="absolute" style={{ top: px(size, 0.18), left: 0, right: 0, height: px(size, 0.07), background: "hsl(20 35% 18%)" }} />
        <Eyes size={size} top={0.43} />
        <Mouth size={size} />
      </Frame>
    ),
  },
  {
    id: "judge",
    name: "Judge",
    unlockLevel: 4,
    render: (size) => (
      <Frame size={size} bg="hsl(28 35% 62%)" shadow="hsl(28 35% 45%)">
        {/* wig */}
        <div className="absolute" style={{ top: px(size, 0.04), left: 0, right: 0, height: px(size, 0.25), background: "hsl(0 0% 96%)" }} />
        <div className="absolute" style={{ top: px(size, 0.25), left: 0, width: px(size, 0.14), height: px(size, 0.21), background: "hsl(0 0% 96%)" }} />
        <div className="absolute" style={{ top: px(size, 0.25), right: 0, width: px(size, 0.14), height: px(size, 0.21), background: "hsl(0 0% 96%)" }} />
        {/* black robe */}
        <div className="absolute" style={{ bottom: 0, left: 0, right: 0, height: px(size, 0.25), background: "hsl(0 0% 8%)" }} />
        <Eyes size={size} top={0.43} />
        <Mouth size={size} />
      </Frame>
    ),
  },
  {
    id: "guardian",
    name: "Guardian",
    unlockLevel: 5,
    render: (size) => (
      <Frame size={size} bg="hsl(28 35% 62%)" shadow="hsl(28 35% 45%)">
        {/* crown */}
        <div className="absolute" style={{ top: px(size, 0.04), left: px(size, 0.07), right: px(size, 0.07), height: px(size, 0.07), background: "hsl(48 100% 55%)" }} />
        <div className="absolute" style={{ top: 0, left: px(size, 0.14), width: px(size, 0.07), height: px(size, 0.07), background: "hsl(48 100% 55%)" }} />
        <div className="absolute" style={{ top: 0, left: "50%", transform: "translateX(-50%)", width: px(size, 0.07), height: px(size, 0.07), background: "hsl(48 100% 55%)" }} />
        <div className="absolute" style={{ top: 0, right: px(size, 0.14), width: px(size, 0.07), height: px(size, 0.07), background: "hsl(48 100% 55%)" }} />
        {/* hair */}
        <div className="absolute" style={{ top: px(size, 0.18), left: px(size, 0.07), right: px(size, 0.07), height: px(size, 0.11), background: "hsl(28 60% 30%)" }} />
        <Eyes size={size} top={0.46} />
        <Mouth size={size} />
      </Frame>
    ),
  },
  {
    id: "shadow",
    name: "Shadow",
    unlockLevel: 5,
    render: (size) => (
      <Frame size={size} bg="hsl(220 15% 18%)" shadow="hsl(220 15% 8%)">
        {/* hood */}
        <div className="absolute" style={{ top: 0, left: 0, right: 0, height: px(size, 0.39), background: "hsl(220 15% 10%)" }} />
        <div className="absolute" style={{ top: px(size, 0.32), left: 0, width: px(size, 0.14), height: px(size, 0.32), background: "hsl(220 15% 10%)" }} />
        <div className="absolute" style={{ top: px(size, 0.32), right: 0, width: px(size, 0.14), height: px(size, 0.32), background: "hsl(220 15% 10%)" }} />
        {/* glowing eyes */}
        <Eyes size={size} top={0.43} color="hsl(0 90% 60%)" />
      </Frame>
    ),
  },
];

export const getAvatar = (id: AvatarId): AvatarDef =>
  AVATARS.find((a) => a.id === id) ?? AVATARS[0];

export const isAvatarUnlocked = (id: AvatarId, level: number): boolean => {
  const a = getAvatar(id);
  return level >= a.unlockLevel;
};

export const loadAvatar = (): AvatarId => {
  try {
    const v = localStorage.getItem(KEY);
    if (v && AVATARS.some((a) => a.id === v)) return v as AvatarId;
  } catch {}
  return "rookie";
};

export const saveAvatar = (id: AvatarId) => {
  try {
    localStorage.setItem(KEY, id);
  } catch {}
};