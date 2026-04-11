import React from 'react';
import { motion } from 'motion/react';
import { Trophy, Users, Settings, Maximize, Minimize, History, Play, Pause, RotateCcw } from 'lucide-react';
import { Player } from '../types';
import { SandTimer } from './SandTimer';
import devilHeadImg from '../8_ball_devil_head.png';
import poolDemonImg from '../bloody_pool_demon.png';

interface NavigationProps {
  view: string;
  setView: (view: 'scoreboard' | 'history' | 'settings' | 'teams') => void;
  player1: Player;
  player2: Player;
  isFullscreen: boolean;
  toggleFullscreen: () => void;
  isNavVisible: boolean;
  isKeyboardOpen: boolean;
  deviceInfo: { isPhone: boolean; isTablet: boolean; isDesktop: boolean };
  navigateToScoreboard: () => void;
  isShotClockEnabled: boolean;
  isMatchClockEnabled: boolean;
  shotClock: number;
  shotClockDuration: number;
  matchClock: number;
  matchClockDuration: number;
  isTimerRunning: boolean;
  onToggleTimer: () => void;
  onResetTimer: () => void;
  formatTime: (seconds: number) => string;
}

export const Navigation: React.FC<NavigationProps> = ({
  view,
  setView,
  player1,
  player2,
  isFullscreen,
  toggleFullscreen,
  isNavVisible,
  isKeyboardOpen,
  deviceInfo,
  navigateToScoreboard,
  isShotClockEnabled,
  isMatchClockEnabled,
  shotClock,
  shotClockDuration,
  matchClock,
  matchClockDuration,
  isTimerRunning,
  onToggleTimer,
  onResetTimer,
  formatTime
}) => {
  return (
    <motion.nav 
      initial={false}
      animate={{ 
        y: (isKeyboardOpen && (deviceInfo.isPhone || (deviceInfo.isTablet && view === 'teams'))) ? (deviceInfo.isPhone ? -54 : -82) : 0,
        opacity: 1
      }}
      transition={{ duration: 0.4, ease: "easeInOut" }}
      className="fixed top-0 left-0 right-0 h-14 md:h-20 lg:h-24 bg-black/90 z-50 flex items-center justify-between px-4 md:px-6 nav-zoom backdrop-blur-md"
      style={{ 
        borderBottom: '2px solid',
        borderImage: `linear-gradient(to right, ${player1.highlightColor} 50%, ${player2.highlightColor} 50%) 1`
      }}
    >
      <div className="flex items-center gap-2 lg:gap-4 shrink-0">
        <div 
          className="w-8 h-6 md:w-12 md:h-12 lg:w-16 lg:h-16 flex items-center justify-center transition-all duration-500"
        >
          <div 
            className="w-full h-full transition-all duration-500"
            style={{ 
              backgroundColor: player1.highlightColor,
              backgroundImage: `linear-gradient(to bottom, ${player1.highlightColor}, ${player2.highlightColor})`,
              WebkitMaskImage: `url(${devilHeadImg})`,
              maskImage: `url(${devilHeadImg})`,
              WebkitMaskSize: '100% 100%',
              maskSize: '100% 100%',
              WebkitMaskRepeat: 'no-repeat',
              maskRepeat: 'no-repeat',
              WebkitMaskPosition: 'center'
            }}
          />
        </div>
        <div className="h-8 md:h-12 lg:h-16 flex items-center hidden sm:flex">
          <img 
            src={poolDemonImg} 
            alt="Pool Demon" 
            className="h-6 md:h-10 lg:h-14 w-auto object-contain"
            referrerPolicy="no-referrer"
          />
        </div>
      </div>

      {/* Central Timers */}
      <div className="flex items-center gap-4 md:gap-8 lg:gap-12">
        {(isMatchClockEnabled || isShotClockEnabled) && (
          <div className="flex items-center gap-3 md:gap-6">
            {isMatchClockEnabled && (
              <SandTimer 
                current={matchClock}
                total={matchClockDuration}
                color={player1.highlightColor}
                label="Match"
                formattedValue={formatTime(matchClock)}
                isPaused={!isTimerRunning}
              />
            )}
            {isShotClockEnabled && (
              <SandTimer 
                current={shotClock}
                total={shotClockDuration}
                color={player2.highlightColor}
                label="Shot"
                formattedValue={`${shotClock}s`}
                isPaused={!isTimerRunning}
              />
            )}
            
            <div className="flex gap-1.5 ml-1">
              <button 
                onClick={onToggleTimer}
                className="w-8 h-8 md:w-10 md:h-10 lg:w-12 lg:h-12 flex items-center justify-center bg-slate-900/80 hover:bg-slate-800 rounded-lg transition-all border border-slate-800"
                style={{ color: isTimerRunning ? player2.highlightColor : player1.highlightColor }}
              >
                {isTimerRunning ? <Pause className="w-4 h-4 md:w-5 md:h-5" /> : <Play className="w-4 h-4 md:w-5 md:h-5" />}
              </button>
              <button 
                onClick={onResetTimer}
                className="w-8 h-8 md:w-10 md:h-10 lg:w-12 lg:h-12 flex items-center justify-center bg-slate-900/80 hover:bg-slate-800 rounded-lg transition-all border border-slate-800"
                style={{ color: player1.highlightColor }}
              >
                <RotateCcw className="w-4 h-4 md:w-5 md:h-5" />
              </button>
            </div>
          </div>
        )}
      </div>
      
      <div className="flex items-center gap-1.5 md:gap-3 lg:gap-4 shrink-0">
        <button 
          onClick={toggleFullscreen}
          className="w-9 h-9 lg:w-[72px] lg:h-[72px] rounded-lg lg:rounded-2xl flex items-center justify-center transition-all duration-500 border border-slate-800 bg-black/50 hover:bg-slate-800/50 hidden sm:flex"
          title="Toggle Fullscreen"
        >
          {isFullscreen ? 
            <Minimize className="w-5 h-5 lg:w-10 lg:h-10" style={{ stroke: 'url(#cup-gradient)' }} /> : 
            <Maximize className="w-5 h-5 lg:w-10 lg:h-10" style={{ stroke: 'url(#cup-gradient)' }} />
          }
        </button>
        <button 
          onClick={navigateToScoreboard}
          className={`w-9 h-9 lg:w-[72px] lg:h-[72px] rounded-lg lg:rounded-2xl flex items-center justify-center transition-all duration-500 border ${view === 'scoreboard' ? 'border-white/20' : 'border-slate-800'} bg-black/50 hover:bg-slate-800/50`}
          style={view === 'scoreboard' ? { backgroundColor: `${player1.highlightColor}33` } : {}}
        >
          <div 
            className="w-5 h-5 lg:w-10 lg:h-10 transition-all duration-500"
            style={{ 
              backgroundColor: player1.highlightColor,
              backgroundImage: `linear-gradient(to bottom, ${player1.highlightColor}, ${player2.highlightColor})`,
              WebkitMaskImage: `url(${devilHeadImg})`,
              maskImage: `url(${devilHeadImg})`,
              WebkitMaskSize: 'contain',
              maskSize: 'contain',
              WebkitMaskRepeat: 'no-repeat',
              maskRepeat: 'no-repeat',
              WebkitMaskPosition: 'center'
            }}
          />
        </button>
        <button 
          onClick={() => setView('teams')}
          className={`w-9 h-9 lg:w-[72px] lg:h-[72px] rounded-lg lg:rounded-2xl flex items-center justify-center transition-all duration-500 border ${view === 'teams' ? 'border-white/20' : 'border-slate-800'} bg-black/50 hover:bg-slate-800/50`}
          style={view === 'teams' ? { backgroundColor: `${player1.highlightColor}33` } : {}}
        >
          <Users className="w-5 h-5 lg:w-10 lg:h-10" style={{ stroke: 'url(#cup-gradient)' }} />
        </button>
        <button 
          onClick={() => setView('settings')}
          className={`w-9 h-9 lg:w-[72px] lg:h-[72px] rounded-lg lg:rounded-2xl flex items-center justify-center transition-all duration-500 border ${view === 'settings' ? 'border-white/20' : 'border-slate-800'} bg-black/50 hover:bg-slate-800/50`}
          style={view === 'settings' ? { backgroundColor: `${player2.highlightColor}33` } : {}}
        >
          <Settings className="w-5 h-5 lg:w-10 lg:h-10" style={{ stroke: 'url(#cup-gradient)' }} />
        </button>
      </div>
    </motion.nav>
  );
};
