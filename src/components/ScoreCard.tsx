import React from 'react';
import { motion } from 'motion/react';
import { Plus, Minus } from 'lucide-react';
import { Player } from '../types';

interface ScoreCardProps {
  player: Player;
  isEditingNames: boolean;
  onNameChange: (name: string) => void;
  onIncrement: () => void;
  onDecrement: () => void;
  onTurnSelect: () => void;
  idx: number;
}

const SkullContainer = ({ color, children }: { color: string, children: React.ReactNode }) => (
  <div className="relative w-full aspect-[1/1] sm:aspect-[4/5] max-w-[400px] mx-auto group">
    <svg viewBox="0 0 100 100" className="w-full h-full drop-shadow-[0_0_15px_rgba(0,0,0,0.5)] sm:hidden">
      <path 
        d="M50 5 C25 5 10 20 10 40 C10 55 15 60 20 65 L20 85 C20 92 30 95 50 95 C70 95 80 92 80 85 L80 65 C85 60 90 55 90 40 C90 20 75 5 50 5 Z" 
        fill="#0a0a0a"
        fillOpacity="0.6"
        stroke={color}
        strokeWidth="2"
        className="transition-all duration-500"
      />
      <g stroke={color} strokeWidth="1.5" opacity="0.3">
        <line x1="35" y1="80" x2="35" y2="92" />
        <line x1="42" y1="80" x2="42" y2="92" />
        <line x1="50" y1="80" x2="50" y2="92" />
        <line x1="58" y1="80" x2="58" y2="92" />
        <line x1="65" y1="80" x2="65" y2="92" />
        <line x1="30" y1="86" x2="70" y2="86" />
      </g>
    </svg>
    <svg viewBox="0 0 100 125" className="w-full h-full drop-shadow-[0_0_15px_rgba(0,0,0,0.5)] hidden sm:block">
      <path 
        d="M50 5 C20 5 5 25 5 50 C5 65 15 75 20 80 L20 105 C20 115 30 120 50 120 C70 120 80 115 80 105 L80 80 C85 75 95 65 95 50 C95 25 80 5 50 5 Z" 
        fill="#0a0a0a"
        fillOpacity="0.6"
        stroke={color}
        strokeWidth="1.5"
        className="transition-all duration-500"
      />
      <g stroke={color} strokeWidth="1" opacity="0.3">
        <line x1="35" y1="100" x2="35" y2="115" />
        <line x1="42" y1="100" x2="42" y2="115" />
        <line x1="50" y1="100" x2="50" y2="115" />
        <line x1="58" y1="100" x2="58" y2="115" />
        <line x1="65" y1="100" x2="65" y2="115" />
        <line x1="30" y1="107" x2="70" y2="107" />
      </g>
    </svg>
    <div className="absolute inset-0 flex flex-col items-center">
      {children}
    </div>
  </div>
);

export const ScoreCard: React.FC<ScoreCardProps> = ({
  player,
  isEditingNames,
  onNameChange,
  onIncrement,
  onDecrement,
  onTurnSelect,
  idx
}) => {
  return (
    <div className="flex flex-col gap-2">
      <motion.div
        onClick={onTurnSelect}
        className="relative cursor-pointer transition-all duration-500"
      >
        <SkullContainer color={player.highlightColor}>
          {/* Forehead: Name */}
          <div className="absolute top-[15%] left-0 right-0 px-8 text-center z-20">
            {isEditingNames ? (
              <input
                type="text"
                value={player.name}
                onChange={(e) => onNameChange(e.target.value)}
                onClick={(e) => e.stopPropagation()}
                placeholder={`PLAYER ${idx + 1}`}
                className="w-full bg-black/40 border-b border-white/20 text-center text-base sm:text-xl lg:text-2xl font-gothic focus:outline-none uppercase tracking-widest placeholder:text-white/20"
                style={{ color: player.highlightColor }}
              />
            ) : (
              player.name && (
                <h2 className="text-base sm:text-2xl lg:text-3xl font-gothic uppercase truncate tracking-widest" style={{ color: player.highlightColor }}>
                  {player.name}
                </h2>
              )
            )}
          </div>
 
          {/* Eye Sockets: Controls */}
          <div className="absolute top-[35%] left-0 right-0 flex justify-center gap-[10%] px-[15%] h-[25%]">
            {/* Left Eye: Minus */}
            <button
              onClick={(e) => {
                e.stopPropagation();
                onDecrement();
              }}
              className="flex-1 aspect-square rounded-full bg-black/40 flex items-center justify-center border-2 transition-all hover:scale-110 active:scale-90 shadow-[inset_0_0_20px_rgba(0,0,0,0.8)]"
              style={{ borderColor: `${player.highlightColor}44`, color: player.highlightColor }}
            >
              <Minus className="w-6 h-6 sm:w-8 sm:h-8 lg:w-10 lg:h-10" />
            </button>
 
            {/* Right Eye: Plus */}
            <button
              onClick={(e) => {
                e.stopPropagation();
                onIncrement();
              }}
              className="flex-1 aspect-square rounded-full bg-black/40 flex items-center justify-center border-2 transition-all hover:scale-110 active:scale-90 shadow-[inset_0_0_20px_rgba(0,0,0,0.8)]"
              style={{ borderColor: `${player.highlightColor}44`, color: player.highlightColor }}
            >
              <Plus className="w-6 h-6 sm:w-8 sm:h-8 lg:w-10 lg:h-10" />
            </button>
          </div>
 
          {/* Center/Mouth: Score */}
          <div className="absolute bottom-[15%] left-0 right-0 flex flex-col items-center justify-center pointer-events-none">
            <span 
              className="text-[min(18vw,60px)] sm:text-[min(10rem,20vh)] lg:text-[min(12rem,25vh)] font-sans font-black tracking-tighter leading-none" 
              style={{ 
                color: player.highlightColor,
                textShadow: `0 0 20px ${player.highlightColor}66`
              }}
            >
              {player.score}
            </span>
          </div>
        </SkullContainer>
      </motion.div>
    </div>
  );
};
