import React, { useEffect } from 'react';
import { motion } from 'motion/react';
import { Palette, Layout, Maximize, RotateCcw } from 'lucide-react';
import { Player } from '../types';
import { ColorPicker } from '../components/ColorPicker';
import { Tooltip } from '../components/Tooltip';
import { THEME_COLORS } from '../constants';

interface SettingsViewProps {
  player1: Player;
  player2: Player;
  setPlayer1: (updates: Partial<Player>) => void;
  setPlayer2: (updates: Partial<Player>) => void;
  activePicker: string | null;
  setActivePicker: (picker: string | null) => void;
  isMatchClockEnabled: boolean;
  setIsMatchClockEnabled: (enabled: boolean) => void;
  matchClockDuration: number;
  setMatchClockDuration: (duration: number) => void;
  setMatchClock: (clock: number) => void;
  resetMatchClock: () => void;
  isShotClockEnabled: boolean;
  setIsShotClockEnabled: (enabled: boolean) => void;
  shotClockDuration: number;
  setShotClockDuration: (duration: number) => void;
  setShotClock: (clock: number) => void;
  pauseTimer: () => void;
  setShowRestoreDefaultsConfirm: (show: boolean) => void;
  deviceInfo: { 
    isPhone: boolean; 
    isTablet: boolean; 
    isDesktop: boolean; 
    isLandscape: boolean; 
    estimatedInches: number;
    forcedMode: 'auto' | 'phone' | 'tablet' | 'desktop';
  };
  setForcedMode: (mode: 'auto' | 'phone' | 'tablet' | 'desktop') => void;
}

export const SettingsView: React.FC<SettingsViewProps> = ({
  player1,
  player2,
  setPlayer1,
  setPlayer2,
  activePicker,
  setActivePicker,
  isMatchClockEnabled,
  setIsMatchClockEnabled,
  matchClockDuration,
  setMatchClockDuration,
  setMatchClock,
  resetMatchClock,
  isShotClockEnabled,
  setIsShotClockEnabled,
  shotClockDuration,
  setShotClockDuration,
  setShotClock,
  pauseTimer,
  setShowRestoreDefaultsConfirm,
  deviceInfo,
  setForcedMode
}) => {
  React.useLayoutEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  return (
    <motion.div
      key="settings"
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: 20 }}
      className="space-y-12 pb-20"
    >
      <div 
        className="space-y-1 pb-8 transition-all duration-500"
        style={{ 
          borderBottom: '2px solid',
          borderImage: `linear-gradient(to right, ${player1.highlightColor} 50%, ${player2.highlightColor} 50%) 1`
        }}
      >
        <h2 className="text-4xl font-black uppercase tracking-tight text-white">Settings</h2>
        <p className="text-slate-500 font-bold uppercase tracking-widest text-[10px]">Customize your scoring experience</p>
      </div>

      <div className="space-y-12">
        <section className="space-y-6">
          <h3 
            className="text-[10px] font-black uppercase tracking-widest pb-2 border-b-2"
            style={{ borderImage: `linear-gradient(to right, ${player1.highlightColor} 50%, ${player2.highlightColor} 50%) 1`, color: player1.highlightColor }}
          >
            Player Customization
          </h3>
          <div 
            className="grid gap-10"
            style={{ gridTemplateColumns: deviceInfo.isPhone ? '1fr' : '1fr 1fr' }}
          >
            {[player1, player2].map((p, idx) => (
              <div 
                key={p.id} 
                className="relative p-8 rounded-[32px] border-2 space-y-6 shadow-xl transition-all duration-500 bg-black/40 backdrop-blur-sm"
                style={{ 
                  borderColor: p.highlightColor,
                  boxShadow: `0 20px 50px -20px ${p.highlightColor}33`,
                  zIndex: activePicker === `p${idx + 1}-theme` ? 50 : 1
                }}
              >
                <div className="flex items-center justify-between">
                  <label className="text-[10px] font-black uppercase tracking-widest text-slate-500">Player {idx + 1} Name</label>
                  <Palette className="w-4 h-4" style={{ color: p.highlightColor }} />
                </div>
                <input
                  type="text"
                  value={p.name}
                  placeholder={`PLAYER ${idx + 1}`}
                  onChange={(e) => idx === 0 ? setPlayer1({ name: e.target.value }) : setPlayer2({ name: e.target.value })}
                  className="w-full bg-slate-950/30 border border-white/10 rounded-2xl px-6 py-3 text-2xl font-black focus:outline-none uppercase transition-all placeholder:text-white/10"
                  style={{ 
                    borderColor: 'transparent',
                    outline: 'none',
                    boxShadow: 'none'
                  }}
                  onFocus={(e) => {
                    e.target.style.borderColor = p.highlightColor;
                    e.target.style.boxShadow = `0 0 0 2px ${p.highlightColor}33`;
                  }}
                  onBlur={(e) => {
                    e.target.style.borderColor = 'transparent';
                    e.target.style.boxShadow = 'none';
                  }}
                />
                <div className="space-y-6">
                  <ColorPicker
                    label="Skull Vibe"
                    value={p.highlightColor}
                    onChange={(color) => idx === 0 ? setPlayer1({ highlightColor: color }) : setPlayer2({ highlightColor: color })}
                    colors={THEME_COLORS}
                    icon={<Palette className="w-4 h-4" />}
                    isOpen={activePicker === `p${idx + 1}-theme`}
                    onToggle={(isOpen) => setActivePicker(isOpen ? `p${idx + 1}-theme` : null)}
                    themeColor={p.highlightColor}
                  />
                </div>
              </div>
            ))}
          </div>
        </section>

        <section className="space-y-6">
          <h3 
            className="text-[10px] font-black uppercase tracking-widest pb-2 border-b-2"
            style={{ borderImage: `linear-gradient(to right, ${player1.highlightColor} 50%, ${player2.highlightColor} 50%) 1`, color: player1.highlightColor }}
          >
            Master Match Clock
          </h3>
          <div 
            className="bg-black/40 backdrop-blur-sm border-2 rounded-[32px] p-8 space-y-8 shadow-xl" 
            style={{ borderColor: player1.highlightColor }}
          >
            <div className="flex items-center justify-between">
              <div className="space-y-1">
                <p className="text-xl font-black text-slate-200 uppercase tracking-tight">Enable Match Clock</p>
                <p className="text-xs text-slate-500 font-bold uppercase tracking-widest">A master countdown for the entire match.</p>
              </div>
              <Tooltip text={isMatchClockEnabled ? "Disable Match Clock" : "Enable Match Clock"} position="left">
                <button 
                  onClick={() => {
                    setIsMatchClockEnabled(!isMatchClockEnabled);
                    if (isMatchClockEnabled) pauseTimer();
                  }}
                  className={`w-14 h-7 rounded-full transition-colors relative`}
                  style={{ backgroundColor: isMatchClockEnabled ? player1.highlightColor : '#334155' }}
                >
                  <div className={`absolute top-1 w-5 h-5 bg-white rounded-full transition-all ${isMatchClockEnabled ? 'left-8' : 'left-1'}`} />
                </button>
              </Tooltip>
            </div>
 
            {isMatchClockEnabled && (
              <div className="space-y-6 pt-8 border-t border-slate-800">
                <div className="flex items-center justify-between">
                  <label className="text-sm font-black text-slate-400 uppercase tracking-widest">Match Duration</label>
                  <span className="text-3xl font-mono font-black" style={{ color: player1.highlightColor }}>{Math.floor(matchClockDuration / 60)}m</span>
                </div>
                <input 
                  type="range" 
                  min="300" 
                  max="3600" 
                  step="300"
                  value={matchClockDuration}
                  onChange={(e) => {
                    const val = parseInt(e.target.value);
                    setMatchClockDuration(val);
                    setMatchClock(val);
                  }}
                  className="w-full h-2 bg-slate-800 rounded-lg appearance-none cursor-pointer"
                  style={{ accentColor: player1.highlightColor }}
                />
                <div className="flex justify-between text-[10px] font-black text-slate-600 uppercase tracking-[0.2em]">
                  <span>5m</span>
                  <span>30m</span>
                  <span>60m</span>
                </div>
                <Tooltip text="Reset Match Clock to Start" position="top">
                  <button 
                    onClick={resetMatchClock}
                    className="w-full py-4 bg-slate-800 hover:bg-slate-700 rounded-2xl text-xs font-black uppercase tracking-widest transition-all flex items-center justify-center gap-2 border border-slate-700"
                  >
                    <RotateCcw className="w-4 h-4" />
                    Reset Match Clock
                  </button>
                </Tooltip>
              </div>
            )}
          </div>
        </section>

        <section className="space-y-6">
          <h3 
            className="text-[10px] font-black uppercase tracking-widest pb-2 border-b-2"
            style={{ borderImage: `linear-gradient(to right, ${player1.highlightColor} 50%, ${player2.highlightColor} 50%) 1`, color: player2.highlightColor }}
          >
            Shot Clock Settings
          </h3>
          <div 
            className="bg-black/40 backdrop-blur-sm border-2 rounded-[32px] p-8 space-y-8 shadow-xl" 
            style={{ borderColor: player2.highlightColor }}
          >
            <div className="flex items-center justify-between">
              <div className="space-y-1">
                <p className="text-xl font-black text-slate-200 uppercase tracking-tight">Enable Shot Clock</p>
                <p className="text-xs text-slate-500 font-bold uppercase tracking-widest">Toggle the visibility and timer on the scoreboard.</p>
              </div>
              <Tooltip text={isShotClockEnabled ? "Disable Shot Clock" : "Enable Shot Clock"} position="left">
                <button 
                  onClick={() => {
                    setIsShotClockEnabled(!isShotClockEnabled);
                    if (isShotClockEnabled) pauseTimer();
                  }}
                  className={`w-14 h-7 rounded-full transition-colors relative`}
                  style={{ backgroundColor: isShotClockEnabled ? player2.highlightColor : '#334155' }}
                >
                  <div className={`absolute top-1 w-5 h-5 bg-white rounded-full transition-all ${isShotClockEnabled ? 'left-8' : 'left-1'}`} />
                </button>
              </Tooltip>
            </div>
 
            {isShotClockEnabled && (
              <div className="space-y-6 pt-8 border-t-2" style={{ borderImage: `linear-gradient(to right, ${player1.highlightColor} 50%, ${player2.highlightColor} 50%) 1` }}>
                <div className="flex items-center justify-between">
                  <label className="text-sm font-black text-slate-400 uppercase tracking-widest">Timer Duration</label>
                  <span className="text-3xl font-mono font-black" style={{ color: player2.highlightColor }}>{shotClockDuration}s</span>
                </div>
                <input 
                  type="range" 
                  min="10" 
                  max="120" 
                  step="5"
                  value={shotClockDuration}
                  onChange={(e) => {
                    const val = parseInt(e.target.value);
                    setShotClockDuration(val);
                    setShotClock(val);
                  }}
                  className="w-full h-2 bg-slate-800 rounded-lg appearance-none cursor-pointer"
                  style={{ accentColor: player2.highlightColor }}
                />
                <div className="flex justify-between text-[10px] font-black text-slate-600 uppercase tracking-[0.2em]">
                  <span>10s</span>
                  <span>60s</span>
                  <span>120s</span>
                </div>
              </div>
            )}
          </div>
        </section>

        <section className="space-y-6">
          <h3 
            className="text-[10px] font-black uppercase tracking-widest pb-2 border-b-2"
            style={{ borderImage: `linear-gradient(to right, ${player1.highlightColor} 50%, ${player2.highlightColor} 50%) 1`, color: player1.highlightColor }}
          >
            System Settings
          </h3>
          <div className="grid grid-cols-1 gap-6">
            <div 
              className="bg-black/40 backdrop-blur-sm border-2 rounded-[1.66vw] p-[0.4vw] flex flex-col items-center justify-between gap-6 shadow-xl"
              style={{ 
                borderColor: player1.highlightColor,
                flexDirection: deviceInfo.isPhone ? 'column' : 'row'
              }}
            >
              <div className="space-y-1" style={{ textAlign: deviceInfo.isPhone ? 'center' : 'left' }}>
                <p className="text-xl font-black text-slate-200 uppercase tracking-tight">System Diagnostics</p>
                <div className="space-y-1">
                  <p className="text-xs text-slate-500 font-bold uppercase tracking-widest">
                    Diagonal: <span className="text-white">{deviceInfo.estimatedInches.toFixed(1)}"</span>
                  </p>
                  <p className="text-xs text-slate-500 font-bold uppercase tracking-widest">
                    Resolution: <span className="text-white">{deviceInfo.width} x {deviceInfo.height}</span>
                  </p>
                  <p className="text-xs text-slate-500 font-bold uppercase tracking-widest">
                    UA Mobile: <span className="text-white">{navigator.userAgent.toLowerCase().includes('mobi') ? 'YES' : 'NO'}</span>
                  </p>
                  <p className="text-xs text-slate-500 font-bold uppercase tracking-widest">
                    Touch: <span className="text-white">{'ontouchstart' in window || navigator.maxTouchPoints > 0 ? 'YES' : 'NO'}</span>
                  </p>
                </div>
                <p className="text-[1.1vh] font-bold uppercase tracking-[0.2em] mt-2" style={{ color: player2.highlightColor }}>
                  Active Mode: Universal Scaled View
                </p>
              </div>
              <div className="flex items-center gap-2 px-6 py-3 bg-slate-800/50 rounded-2xl border border-slate-700">
                <Layout className="w-4 h-4 text-slate-400" />
                <span className="text-xs font-black uppercase tracking-widest text-slate-300">
                  {window.innerWidth} x {window.innerHeight} UNITS
                </span>
              </div>
            </div>

            <div 
              className="bg-black/40 backdrop-blur-sm border-2 rounded-[32px] p-8 flex flex-col items-center justify-between gap-6 shadow-xl"
              style={{ 
                borderColor: player1.highlightColor,
                flexDirection: deviceInfo.isPhone ? 'column' : 'row'
              }}
            >
              <div className="space-y-1" style={{ textAlign: deviceInfo.isPhone ? 'center' : 'left' }}>
                <p className="text-xl font-black text-slate-200 uppercase tracking-tight">Restore Default Settings</p>
                <p className="text-xs text-slate-500 font-bold uppercase tracking-widest">Resets all color selections to default.</p>
              </div>
              <Tooltip text="Reset Colors to Default" position="top">
                <button 
                  onClick={() => setShowRestoreDefaultsConfirm(true)}
                  className="px-8 py-4 bg-slate-800 hover:bg-slate-700 rounded-2xl text-xs font-black uppercase tracking-widest transition-all flex items-center justify-center gap-2 border border-slate-700"
                >
                  <RotateCcw className="w-4 h-4" />
                  Restore Defaults
                </button>
              </Tooltip>
            </div>
          </div>
        </section>

        <section className="pt-12">
          <div 
            className="bg-slate-900/80 backdrop-blur-md border border-slate-800 rounded-3xl p-8 space-y-4 shadow-xl"
          >
            <div className="flex items-center justify-between text-xs font-bold uppercase tracking-widest">
              <span className="text-slate-500">Version</span>
              <span className="font-mono" style={{ color: player1.highlightColor }}>1.0.0-pro</span>
            </div>
            <div className="flex items-center justify-between text-xs font-bold uppercase tracking-widest">
              <span className="text-slate-500">Developer</span>
              <span className="font-mono" style={{ color: player2.highlightColor }}>Stealthton</span>
            </div>
          </div>
        </section>
      </div>
    </motion.div>
  );
};
