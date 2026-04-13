import React from 'react';
import { motion } from 'motion/react';
import { Plus, Minus } from 'lucide-react';
import { Player } from '../types';
import { FittingText } from './FittingText';
import { Tooltip } from './Tooltip';

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
  <div className="relative w-full aspect-[10/8] md:aspect-[4/5] max-w-[400px] mx-auto group">
    <svg viewBox="0 0 100 80" className="w-full h-full drop-shadow-[0_0_15px_rgba(0,0,0,0.5)] md:hidden">
      <path 
        d="M50 5 C25 5 10 16 10 32 C10 44 15 48 20 52 L20 68 C20 74 30 77 50 77 C70 77 80 74 80 68 L80 52 C85 48 90 44 90 32 C90 16 75 5 50 5 Z" 
        fill="#0a0a0a"
        fillOpacity="0.6"
        stroke={color}
        strokeWidth="2"
        className="transition-all duration-500"
      />
      <g stroke={color} strokeWidth="1.5" opacity="0.3">
        <line x1="35" y1="64" x2="35" y2="74" />
        <line x1="42" y1="64" x2="42" y2="74" />
        <line x1="50" y1="64" x2="50" y2="74" />
        <line x1="58" y1="64" x2="58" y2="74" />
        <line x1="65" y1="64" x2="65" y2="74" />
        <line x1="30" y1="69" x2="70" y2="69" />
      </g>
    </svg>
    <svg viewBox="0 0 100 125" className="w-full h-full drop-shadow-[0_0_15px_rgba(0,0,0,0.5)] hidden md:block">
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
                <div className="h-6 sm:h-10 lg:h-12 w-full flex justify-center">
                  <FittingText 
                    text={player.name} 
                    className="font-gothic uppercase tracking-widest justify-center" 
                    maxFontSize={32}
                    minFontSize={12}
                  />
                </div>
              )
            )}
          </div>
 
          {/* Eye Sockets: Controls */}
          <div className="absolute top-[35%] left-0 right-0 flex justify-center gap-[10%] px-[15%] h-[25%]">
            {/* Left Eye: Minus */}
            <Tooltip text="Decrease Score" position="top">
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  onDecrement();
                }}
                className="w-12 h-12 sm:w-16 sm:h-16 lg:w-24 lg:h-24 rounded-full bg-black/40 flex items-center justify-center border-2 transition-all hover:scale-110 active:scale-90 shadow-[inset_0_0_20px_rgba(0,0,0,0.8)]"
                style={{ borderColor: `${player.highlightColor}44`, color: player.highlightColor }}
              >
                <Minus className="w-6 h-6 sm:w-8 sm:h-8 lg:w-10 lg:h-10" />
              </button>
            </Tooltip>
 
            {/* Right Eye: Plus */}
            <Tooltip text="Increase Score" position="top">
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  onIncrement();
                }}
                className="w-12 h-12 sm:w-16 sm:h-16 lg:w-24 lg:h-24 rounded-full bg-black/40 flex items-center justify-center border-2 transition-all hover:scale-110 active:scale-90 shadow-[inset_0_0_20px_rgba(0,0,0,0.8)]"
                style={{ borderColor: `${player.highlightColor}44`, color: player.highlightColor }}
              >
                <Plus className="w-6 h-6 sm:w-8 sm:h-8 lg:w-10 lg:h-10" />
              </button>
            </Tooltip>
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
