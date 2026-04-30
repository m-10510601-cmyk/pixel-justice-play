import { ReactNode } from "react";

interface GameFrameProps {
  children: ReactNode;
  bgImage?: string;
  /** Disable atmospheric overlays (god-rays, stained-glass, rim light) */
  plain?: boolean;
}

const GameFrame = ({ children, bgImage, plain = false }: GameFrameProps) => {
  return (
    <div className="min-h-screen w-full flex items-center justify-center bg-background p-2 sm:p-4">
      <div className="game-frame pixel-frame">
        {bgImage && (
          <img
            src={bgImage}
            alt=""
            aria-hidden="true"
            className="scene-parallax w-full h-full object-cover"
          />
        )}
        {!plain && (
          <>
            <div className="stained-glass" aria-hidden="true" />
            <div className="god-rays" aria-hidden="true" />
            <div className="rim-light" aria-hidden="true" />
          </>
        )}
        <div className="absolute inset-0 bg-gradient-to-b from-background/30 via-transparent to-background/80 z-[3]" />

        {/* Ornate stone frame + hibiscus corners */}
        <div className="ornate-frame" aria-hidden="true" />
        <div className="ornate-corner tl" aria-hidden="true" />
        <div className="ornate-corner tr" aria-hidden="true" />
        <div className="ornate-corner bl" aria-hidden="true" />
        <div className="ornate-corner br" aria-hidden="true" />

        <div className="relative z-10 w-full h-full flex flex-col">
          {children}
        </div>
      </div>
    </div>
  );
};

export default GameFrame;