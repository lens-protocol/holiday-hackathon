'use client';

import { FC } from 'react';

interface GameControlsProps {
  onMove?: (direction: string) => void;
}

const ArrowSvg: FC<{ path: string }> = ({ path }) => (
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-6 h-6">
    <path fillRule="evenodd" d={path} clipRule="evenodd" />
  </svg>
);

export default function GameControls({ onMove }: GameControlsProps) {
  const handleClick = (direction: string) => {
    if (onMove) {
      onMove(direction);
    }
  };

  return (
    <div className="grid fixed bottom-8 left-1/2 grid-cols-3 gap-2 self-center p-4 bg-cyber-black/80 border border-neon-pink/30 rounded-none -translate-x-1/2 shadow-[0_0_15px_rgba(255,0,255,0.2)] z-50">
      <div /> {/* Empty cell for spacing */}
      <button 
        onClick={() => handleClick('up')}
        className="p-2 rounded-none border transition-all duration-300 bg-cyber-black border-neon-blue/30 hover:bg-neon-blue/20 hover:border-neon-blue active:bg-neon-blue/30 text-neon-blue"
      >
        <ArrowSvg path="M11.47 7.72a.75.75 0 011.06 0l7.5 7.5a.75.75 0 11-1.06 1.06L12 9.31l-6.97 6.97a.75.75 0 01-1.06-1.06l7.5-7.5z" />
      </button>
      <div /> {/* Empty cell for spacing */}
      <button 
        onClick={() => handleClick('left')}
        className="p-2 rounded-none border transition-all duration-300 bg-cyber-black border-neon-blue/30 hover:bg-neon-blue/20 hover:border-neon-blue active:bg-neon-blue/30 text-neon-blue"
      >
        <ArrowSvg path="M7.72 12.53a.75.75 0 010-1.06l7.5-7.5a.75.75 0 111.06 1.06L9.31 12l6.97 6.97a.75.75 0 11-1.06 1.06l-7.5-7.5z" />
      </button>
      <button 
        onClick={() => handleClick('down')}
        className="p-2 rounded-none border transition-all duration-300 bg-cyber-black border-neon-blue/30 hover:bg-neon-blue/20 hover:border-neon-blue active:bg-neon-blue/30 text-neon-blue"
      >
        <ArrowSvg path="M12.53 16.28a.75.75 0 01-1.06 0l-7.5-7.5a.75.75 0 011.06-1.06L12 14.69l6.97-6.97a.75.75 0 111.06 1.06l-7.5 7.5z" />
      </button>
      <button 
        onClick={() => handleClick('right')}
        className="p-2 rounded-none border transition-all duration-300 bg-cyber-black border-neon-blue/30 hover:bg-neon-blue/20 hover:border-neon-blue active:bg-neon-blue/30 text-neon-blue"
      >
        <ArrowSvg path="M16.28 11.47a.75.75 0 010 1.06l-7.5 7.5a.75.75 0 01-1.06-1.06L14.69 12 7.72 5.03a.75.75 0 011.06-1.06l7.5 7.5z" />
      </button>
    </div>
  );
}