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
  fontSize?: number;
  onFontSizeCalculated?: (size: number) => void;
  deviceInfo: { isPhone: boolean; isTablet: boolean; isDesktop: boolean; isLandscape: boolean };
}

const SkullContainer = ({ color, children, isPhone, isLandscape }: { color: string, children: React.ReactNode, isPhone: boolean, isLandscape: boolean }) => {
  // Portrait mobile: squat aspect ratio to fit both cards stacked
  // Landscape or Desktop: taller aspect ratio
  const useSquat = isPhone && !isLandscape;
  return (
    <div 
      className={`relative ${useSquat ? 'aspect-[10/7]' : 'aspect-[1/1]'} mx-auto group`}
      style={{ 
        height: 'var(--skull-height)',
        maxWidth: '100%',
        maxHeight: '100%'
      }}
    >
      {useSquat ? (
        <svg viewBox="0 0 100 70" className="w-full h-full drop-shadow-[0_0_15px_rgba(0,0,0,0.5)]">
          <path 
            d="M50 5 C25 5 10 14 10 28 C10 38 15 42 20 46 L20 60 C20 66 30 68 50 68 C70 68 80 66 80 60 L80 46 C85 42 90 38 90 28 C90 14 75 5 50 5 Z" 
            fill="#0a0a0a"
            fillOpacity="0.6"
            stroke={color}
            strokeWidth="2.5"
            className="transition-all duration-500"
          />
          <g stroke={color} strokeWidth="1.5" opacity="0.3">
            <line x1="35" y1="56" x2="35" y2="66" />
            <line x1="42" y1="56" x2="42" y2="66" />
            <line x1="50" y1="56" x2="50" y2="66" />
            <line x1="58" y1="56" x2="58" y2="66" />
            <line x1="65" y1="56" x2="65" y2="66" />
            <line x1="30" y1="61" x2="70" y2="61" />
          </g>
        </svg>
      ) : (
        <svg viewBox="0 0 100 100" className="w-full h-full drop-shadow-[0_0_15px_rgba(0,0,0,0.5)]">
          <path 
            d="M50 5 C20 5 5 20 5 45 C5 58 15 70 20 75 L20 90 C20 98 30 100 50 100 C70 100 80 98 80 90 L80 75 C85 70 95 58 95 45 C95 20 80 5 50 5 Z" 
            fill="#0a0a0a"
            fillOpacity="0.6"
            stroke={color}
            strokeWidth="1.5"
            className="transition-all duration-500"
          />
          <g stroke={color} strokeWidth="1" opacity="0.3">
            <line x1="35" y1="85" x2="35" y2="98" />
            <line x1="42" y1="85" x2="42" y2="98" />
            <line x1="50" y1="85" x2="50" y2="98" />
            <line x1="58" y1="85" x2="58" y2="98" />
            <line x1="65" y1="85" x2="65" y2="98" />
            <line x1="30" y1="91" x2="70" y2="91" />
          </g>
        </svg>
      )}
      <div className="absolute inset-0 flex flex-col items-center">
        {children}
      </div>
    </div>
  );
};

export const ScoreCard: React.FC<ScoreCardProps> = ({
  player,
  isEditingNames,
  onNameChange,
  onIncrement,
  onDecrement,
  onTurnSelect,
  idx,
  fontSize,
  onFontSizeCalculated,
  deviceInfo
}) => {
  return (
    <div className="flex flex-col gap-2">
      <motion.div
        onClick={onTurnSelect}
        className="relative cursor-pointer transition-all duration-500"
      >
        <SkullContainer color={player.highlightColor} isPhone={deviceInfo.isPhone} isLandscape={deviceInfo.isLandscape}>
          {/* Forehead: Name - Slightly reduced region per user request */}
          <div className="absolute top-[13%] left-0 right-0 h-[16%] px-[11%] text-center z-20">
            {isEditingNames ? (
              <input
                type="text"
                value={player.name}
                onChange={(e) => onNameChange(e.target.value)}
                onClick={(e) => e.stopPropagation()}
                placeholder={`PLAYER ${idx + 1}`}
                className="w-full h-full bg-black/40 border-b border-white/20 text-center font-gothic focus:outline-none uppercase tracking-widest placeholder:text-white/20"
                style={{ 
                  color: player.highlightColor,
                  fontSize: deviceInfo.isDesktop ? '1.5rem' : (deviceInfo.isPhone ? '0.75rem' : '1.25rem')
                }}
              />
            ) : (
              player.name && (
                <FittingText 
                  text={player.name} 
                  className="font-gothic uppercase tracking-widest justify-center" 
                  maxFontSize={95}
                  minFontSize={12}
                  style={{ color: player.highlightColor }}
                  fontSize={fontSize}
                  onFontSizeCalculated={onFontSizeCalculated}
                />
              )
            )}
          </div>
 
          {/* Eye Sockets: Controls */}
          <div 
            className="absolute left-0 right-0 flex justify-center px-[15%] h-[25%]"
            style={{ 
              top: 'var(--eye-top)',
              gap: 'var(--eye-gap)'
            }}
          >
            {/* Left Eye: Minus */}
            <Tooltip text="Decrease Score" position="top">
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  onDecrement();
                }}
                className="rounded-full bg-black/40 flex items-center justify-center border-2 transition-all hover:scale-110 active:scale-90 shadow-[inset_0_0_20px_rgba(0,0,0,0.8)]"
                style={{ 
                  borderColor: `${player.highlightColor}44`, 
                  color: player.highlightColor,
                  width: 'var(--eye-size)',
                  height: 'var(--eye-size)'
                }}
              >
                <Minus style={{ width: 'var(--eye-icon-size)', height: 'var(--eye-icon-size)' }} />
              </button>
            </Tooltip>
  
            {/* Right Eye: Plus */}
            <Tooltip text="Increase Score" position="top">
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  onIncrement();
                }}
                className="rounded-full bg-black/40 flex items-center justify-center border-2 transition-all hover:scale-110 active:scale-90 shadow-[inset_0_0_20px_rgba(0,0,0,0.8)]"
                style={{ 
                  borderColor: `${player.highlightColor}44`, 
                  color: player.highlightColor,
                  width: 'var(--eye-size)',
                  height: 'var(--eye-size)'
                }}
              >
                <Plus style={{ width: 'var(--eye-icon-size)', height: 'var(--eye-icon-size)' }} />
              </button>
            </Tooltip>
          </div>
 
          {/* Center/Mouth: Score */}
          <div className="absolute bottom-[15%] left-0 right-0 flex flex-col items-center justify-center pointer-events-none">
            <span 
              className="font-sans font-black tracking-tighter leading-none" 
              style={{ 
                color: player.highlightColor,
                textShadow: `0 0 20px ${player.highlightColor}66`,
                fontSize: 'var(--score-size)'
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
