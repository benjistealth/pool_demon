import React from 'react';
import { Timer, Play, Pause, RotateCcw } from 'lucide-react';

interface TimerDisplayProps {
  isShotClockEnabled: boolean;
  isMatchClockEnabled: boolean;
  shotClock: number;
  matchClock: number;
  isTimerRunning: boolean;
  onToggleTimer: () => void;
  onResetTimer: () => void;
  formatTime: (seconds: number) => string;
  player1Color: string;
  player2Color: string;
}

export const TimerDisplay: React.FC<TimerDisplayProps> = ({
  isShotClockEnabled,
  isMatchClockEnabled,
  shotClock,
  matchClock,
  isTimerRunning,
  onToggleTimer,
  onResetTimer,
  formatTime,
  player1Color,
  player2Color
}) => {
  if (!isShotClockEnabled && !isMatchClockEnabled) return null;

  return (
    <div className="flex items-center justify-center shrink-0 mt-auto sm:mt-0">
      <div 
        className="flex items-center justify-center bg-black/20 p-1 sm:p-2 lg:p-2 rounded-2xl border-2 transition-all duration-500 w-full max-w-md"
        style={{ 
          borderImage: `linear-gradient(to right, ${player1Color} 50%, ${player2Color} 50%) 1`,
          borderRadius: '1rem'
        }}
      >
        <div className="flex items-center gap-4 sm:gap-8">
          {isMatchClockEnabled && (
            <div className="flex flex-col items-center">
              <span className="hidden sm:block text-[10px] font-gothic uppercase tracking-widest text-slate-500 mb-1">Match Clock</span>
              <div 
                className={`flex items-center gap-2 text-lg sm:text-2xl font-gothic transition-colors duration-500 ${matchClock <= 60 ? 'text-red-500 animate-pulse' : ''}`}
                style={matchClock > 60 ? { color: player1Color } : {}}
              >
                <Timer className="w-4 h-4 sm:w-5 sm:h-5" />
                {formatTime(matchClock)}
              </div>
            </div>
          )}
          
          {isShotClockEnabled && (
            <div className="flex flex-col items-center">
              <span className="hidden sm:block text-[10px] font-gothic uppercase tracking-widest text-slate-500 mb-1">Shot Clock</span>
              <div 
                className={`flex items-center gap-2 text-lg sm:text-2xl font-gothic transition-colors duration-500 ${shotClock <= 5 ? 'text-red-500 animate-pulse' : ''}`}
                style={shotClock > 5 ? { color: player2Color } : {}}
              >
                <Timer className="w-4 h-4 sm:w-5 sm:h-5" />
                {shotClock}s
              </div>
            </div>
          )}

          <div className="flex gap-2">
            <button 
              onClick={onToggleTimer}
              className="p-1 sm:p-2 bg-slate-800 hover:bg-slate-700 rounded-xl transition-all duration-500 border"
              style={{ borderColor: isTimerRunning ? player2Color : player1Color, color: isTimerRunning ? player2Color : player1Color }}
            >
              {isTimerRunning ? <Pause className="w-4 h-4 sm:w-5 sm:h-5" /> : <Play className="w-4 h-4 sm:w-5 sm:h-5" />}
            </button>
            <button 
              onClick={onResetTimer}
              className="p-1 sm:p-2 bg-slate-800 hover:bg-slate-700 rounded-xl transition-all duration-500 border border-slate-700"
              style={{ color: player1Color }}
            >
              <RotateCcw className="w-4 h-4 sm:w-5 sm:h-5" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
