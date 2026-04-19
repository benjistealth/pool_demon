import React from 'react';
import { motion } from 'motion/react';
import { Trophy, Users, Settings, Maximize, Minimize, History, Play, Pause, RotateCcw } from 'lucide-react';
import { Player } from '../types';
import { SandTimer } from './SandTimer';
import { Tooltip } from './Tooltip';
import devilHeadImg from '../8_ball_devil_head.png';
const poolDemonImg = '/favicon.png';

interface NavigationProps {
  view: string;
  setView: (view: 'scoreboard' | 'history' | 'settings' | 'teams') => void;
  player1: Player;
  player2: Player;
  isFullscreen: boolean;
  toggleFullscreen: () => void;
  isNavVisible: boolean;
  isKeyboardOpen: boolean;
  deviceInfo: { isPhone: boolean; isTablet: boolean; isDesktop: boolean; isLandscape: boolean };
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
        opacity: isNavVisible ? 1 : 0,
        pointerEvents: isNavVisible ? 'auto' : 'none'
      }}
      transition={{ duration: 0.4, ease: "easeInOut" }}
      className="fixed top-0 left-0 right-0 bg-black/20 z-[9999] flex items-center justify-between px-4 nav-zoom backdrop-blur-md"
      style={{ 
        paddingLeft: '0.5vh',
        paddingRight: '0.5vh',
        height: 'var(--nav-height)',
        borderBottom: '2px solid',
        borderImage: `linear-gradient(to right, ${player1.highlightColor} 50%, ${player2.highlightColor} 50%) 1`
      }}
    >
      <div className="flex items-center shrink-0" style={{ gap: 'var(--nav-gap)' }}>
        <div 
          className="flex items-center justify-center transition-all duration-500"
          style={{ 
            width: 'var(--devil-head-size)',
            height: 'var(--devil-head-size)'
          }}
        >
          <div 
            className="w-full h-full transition-all duration-500"
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
        </div>
        <div className="flex items-center" style={{ height: 'var(--logo-height)', transform: 'translateY(0.2vh)' }}>
          <img 
            src={poolDemonImg} 
            alt="Pool Demon" 
            className="w-auto object-contain"
            style={{ height: 'var(--logo-height)' }}
            referrerPolicy="no-referrer"
          />
        </div>
      </div>

      <div className="flex items-center shrink overflow-hidden" style={{ gap: 'var(--nav-gap)' }}>
        {(isMatchClockEnabled || isShotClockEnabled) && (
          <div className="flex items-center" style={{ gap: 'var(--nav-gap)' }}>
            {isMatchClockEnabled && (
              <SandTimer 
                current={matchClock}
                total={matchClockDuration}
                color={player1.highlightColor}
                label="Match"
                formattedValue={formatTime(matchClock)}
                isPaused={!isTimerRunning}
                deviceInfo={deviceInfo}
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
                deviceInfo={deviceInfo}
              />
            )}
            
            <div className="flex" style={{ gap: '0.2vw' }}>
              <Tooltip text={isTimerRunning ? "Pause Timer" : "Start Timer"} position="bottom">
                <button 
                  onClick={onToggleTimer}
                  className="flex items-center justify-center bg-slate-900/80 hover:bg-slate-800 rounded-lg transition-all border border-slate-800"
                  style={{ 
                    width: 'var(--nav-btn-size)',
                    height: 'var(--nav-btn-size)',
                    color: isTimerRunning ? player2.highlightColor : player1.highlightColor 
                  }}
                >
                  {isTimerRunning ? 
                    <Pause style={{ width: 'var(--nav-icon-size)', height: 'var(--nav-icon-size)' }} /> : 
                    <Play style={{ width: 'var(--nav-icon-size)', height: 'var(--nav-icon-size)' }} />
                  }
                </button>
              </Tooltip>
              <Tooltip text="Reset Timer" position="bottom">
                <button 
                  onClick={onResetTimer}
                  className="flex items-center justify-center bg-slate-900/80 hover:bg-slate-800 rounded-lg transition-all border border-slate-800"
                  style={{ 
                    width: 'var(--nav-btn-size)',
                    height: 'var(--nav-btn-size)',
                    color: player1.highlightColor 
                  }}
                >
                  <RotateCcw style={{ width: 'var(--nav-icon-size)', height: 'var(--nav-icon-size)' }} />
                </button>
              </Tooltip>
            </div>
          </div>
        )}
      </div>
      
      <div className="flex items-center shrink-0" style={{ gap: 'var(--nav-gap)' }}>
        <Tooltip text={isFullscreen ? "Exit Fullscreen" : "Enter Fullscreen"} position="bottom">
          <button 
            onClick={toggleFullscreen}
            className="flex items-center justify-center transition-all duration-500 border border-slate-800 bg-black/50 hover:bg-slate-800/50"
            style={{
              width: 'var(--nav-btn-size)',
              height: 'var(--nav-btn-size)',
              borderRadius: deviceInfo.isDesktop ? '16px' : '4px'
            }}
          >
            {isFullscreen ? 
              <Minimize style={{ width: 'var(--nav-icon-size)', height: 'var(--nav-icon-size)', stroke: 'url(#cup-gradient)' }} /> : 
              <Maximize style={{ width: 'var(--nav-icon-size)', height: 'var(--nav-icon-size)', stroke: 'url(#cup-gradient)' }} />
            }
          </button>
        </Tooltip>
        <Tooltip text="Scoreboard" position="bottom">
          <button 
            onClick={navigateToScoreboard}
            className={`flex items-center justify-center transition-all duration-500 border ${view === 'scoreboard' ? 'border-white/20' : 'border-slate-800'} bg-black/50 hover:bg-slate-800/50`}
            style={{
              width: 'var(--nav-btn-size)',
              height: 'var(--nav-btn-size)',
              borderRadius: deviceInfo.isDesktop ? '16px' : '4px',
              backgroundColor: view === 'scoreboard' ? `${player1.highlightColor}33` : undefined
            }}
          >
            <div 
              className="transition-all duration-500"
              style={{ 
                width: 'calc(var(--nav-icon-size) * 1.1)',
                height: 'calc(var(--nav-icon-size) * 1.1)',
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
        </Tooltip>
        <Tooltip text="Matches & Teams" position="bottom">
          <button 
            onClick={() => setView('teams')}
            className={`flex items-center justify-center transition-all duration-500 border ${view === 'teams' ? 'border-white/20' : 'border-slate-800'} bg-black/50 hover:bg-slate-800/50`}
            style={{
              width: 'var(--nav-btn-size)',
              height: 'var(--nav-btn-size)',
              borderRadius: deviceInfo.isDesktop ? '16px' : '4px',
              backgroundColor: view === 'teams' ? `${player1.highlightColor}33` : undefined
            }}
          >
            <Users style={{ width: 'var(--nav-icon-size)', height: 'var(--nav-icon-size)', stroke: 'url(#cup-gradient)' }} />
          </button>
        </Tooltip>
        <Tooltip text="Settings" position="bottom">
          <button 
            onClick={() => setView('settings')}
            className={`flex items-center justify-center transition-all duration-500 border ${view === 'settings' ? 'border-white/20' : 'border-slate-800'} bg-black/50 hover:bg-slate-800/50`}
            style={{
              width: 'var(--nav-btn-size)',
              height: 'var(--nav-btn-size)',
              borderRadius: deviceInfo.isDesktop ? '16px' : '4px',
              backgroundColor: view === 'settings' ? `${player1.highlightColor}33` : undefined
            }}
          >
            <Settings style={{ width: 'var(--nav-icon-size)', height: 'var(--nav-icon-size)', stroke: 'url(#cup-gradient)' }} />
          </button>
        </Tooltip>
      </div>
    </motion.nav>
  );
};
