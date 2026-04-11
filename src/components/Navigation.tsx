import React from 'react';
import { motion } from 'motion/react';
import { Trophy, Users, Settings, Maximize, Minimize, History } from 'lucide-react';
import { Player } from '../types';
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
  navigateToScoreboard
}) => {
  return (
    <motion.nav 
      initial={false}
      animate={{ 
        y: (!deviceInfo.isDesktop && (
          (!isNavVisible && deviceInfo.isPhone) || 
          (isKeyboardOpen && (deviceInfo.isPhone || (deviceInfo.isTablet && view === 'teams')))
        )) ? (deviceInfo.isPhone ? -54 : -82) : 0,
        opacity: 1
      }}
      transition={{ duration: 0.4, ease: "easeInOut" }}
      className="fixed top-0 left-0 right-0 h-14 md:h-20 lg:h-28 bg-black/80 z-50 flex items-center justify-between px-6 nav-zoom"
      style={{ 
        borderBottom: '2px solid',
        borderImage: `linear-gradient(to right, ${player1.highlightColor} 50%, ${player2.highlightColor} 50%) 1`
      }}
    >
      <div className="flex items-center gap-2 lg:gap-6">
        <div 
          className="w-10 h-10 lg:w-24 lg:h-24 flex items-center justify-center transition-all duration-500"
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
        <div className="h-10 lg:h-24 flex items-center">
          <img 
            src={poolDemonImg} 
            alt="Pool Demon" 
            className="h-8 lg:h-20 w-auto object-contain"
            referrerPolicy="no-referrer"
          />
        </div>
      </div>
      
      <div className="flex items-center gap-2 sm:gap-4 lg:gap-8">
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
