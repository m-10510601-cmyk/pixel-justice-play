import { ReactNode } from "react";

interface GameFrameProps {
  children: ReactNode;
  bgImage?: string;
}

const GameFrame = ({ children, bgImage }: GameFrameProps) => {
  return (
    <div className="min-h-screen w-full flex items-center justify-center bg-background p-2 sm:p-4">
      <div className="game-frame pixel-frame">
        {bgImage && (
          <img
            src={bgImage}
            alt=""
            aria-hidden="true"
            className="absolute inset-0 w-full h-full object-cover"
          />
        )}
        <div className="absolute inset-0 bg-gradient-to-b from-background/30 via-transparent to-background/80" />
        <div className="relative z-10 w-full h-full flex flex-col">
          {children}
        </div>
      </div>
    </div>
  );
};

export default GameFrame;