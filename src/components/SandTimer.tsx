import React from 'react';
import { motion } from 'motion/react';

interface SandTimerProps {
  current: number;
  total: number;
  color: string;
  label: string;
  formattedValue: string;
  isPaused?: boolean;
}

export const SandTimer: React.FC<SandTimerProps> = ({ current, total, color, label, formattedValue, isPaused = false }) => {
  const percentage = Math.max(0, Math.min(100, (current / total) * 100));
  const bloodColor = "#ff0000"; // Bright red liquid
  
  // Top chamber: y goes from 5 to 30 as percentage goes from 100 to 0
  const topY = 30 - (25 * (percentage / 100));
  const topHeight = 25 * (percentage / 100);
  
  // Bottom chamber: y goes from 55 to 30 as percentage goes from 100 to 0
  const bottomY = 55 - (25 * (1 - (percentage / 100)));
  const bottomHeight = 25 * (1 - (percentage / 100));

  return (
    <div className="flex items-center gap-2 lg:gap-3">
      <div className="relative w-6 h-9 lg:w-10 lg:h-14">
        <svg viewBox="0 0 40 60" className="w-full h-full drop-shadow-[0_0_8px_rgba(255,0,0,0.4)]">
          {/* Glass container */}
          <path 
            d="M5,5 L35,5 L35,10 C35,25 22,28 20,30 C18,28 5,25 5,10 Z M5,55 L35,55 L35,50 C35,35 22,32 20,30 C18,32 5,35 5,50 Z" 
            fill="rgba(255,255,255,0.03)" 
            stroke="rgba(255,255,255,0.15)" 
            strokeWidth="1.5"
          />
          
          {/* Top Blood */}
          <g clipPath={`url(#top-clip-${label.replace(/\s+/g, '-')})`}>
            <path d="M5,5 L35,5 C35,20 22,28 20,30 C18,28 5,20 5,5 Z" fill={bloodColor} opacity="0.9" />
          </g>
          
          {/* Bottom Blood */}
          <g clipPath={`url(#bottom-clip-${label.replace(/\s+/g, '-')})`}>
            <path d="M5,55 L35,55 C35,40 22,32 20,30 C18,32 5,40 5,55 Z" fill={bloodColor} opacity="0.9" />
          </g>

          {/* Drip line */}
          {current > 0 && percentage < 100 && (
            <motion.line 
              x1="20" y1="30" x2="20" y2="55" 
              stroke={bloodColor} 
              strokeWidth="1.5" 
              strokeDasharray="2 4"
              animate={isPaused ? { strokeDashoffset: 0 } : { strokeDashoffset: [0, -20] }}
              transition={{ repeat: isPaused ? 0 : Infinity, duration: 0.8, ease: "linear" }}
            />
          )}

          <defs>
            <clipPath id={`top-clip-${label.replace(/\s+/g, '-')}`}>
              <rect x="0" y={topY} width="40" height={topHeight} />
            </clipPath>
            <clipPath id={`bottom-clip-${label.replace(/\s+/g, '-')}`}>
              <rect x="0" y={bottomY} width="40" height={bottomHeight} />
            </clipPath>
          </defs>
        </svg>
      </div>
      <div className="flex flex-col justify-center">
        <span className="text-[16px] lg:text-[24px] font-black font-gothic leading-none tracking-tight" style={{ color }}>
          {formattedValue}
        </span>
        <span className="text-[7px] lg:text-[9px] uppercase tracking-widest text-slate-500 font-black">{label}</span>
      </div>
    </div>
  );
};
