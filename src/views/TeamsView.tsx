import React, { useEffect, useRef } from 'react';
import { motion } from 'motion/react';
import { Users, Download, Upload, Trash2, X, Plus, Trophy } from 'lucide-react';
import { Player, MatchHistoryEntry } from '../types';
import { Tooltip } from '../components/Tooltip';
import { FittingText } from '../components/FittingText';
import bloodyBattlesImg from '../bloody_battles.png';

interface TeamsViewProps {
  player1: Player;
  player2: Player;
  team1Name: string;
  team2Name: string;
  team1Players: string[];
  team2Players: string[];
  matchHistory: MatchHistoryEntry[];
  selectedMatchIndex: number | null;
  teamTotals: { t1: number; t2: number };
  updateTeamData: (t1Name: string, t1Players: string[], t2Name: string, t2Players: string[]) => void;
  downloadData: () => void;
  downloadJSON: () => void;
  uploadData: () => void;
  setShowClearTeamsConfirm: (show: boolean) => void;
  selectTeamMatch: (index: number) => void;
  getMatchResult: (p1: string, p2: string) => MatchHistoryEntry | undefined;
  clearMatchResult: (p1: string, p2: string) => void;
  formatTime: (seconds: number) => string;
  deviceInfo: { isPhone: boolean; isTablet: boolean; isDesktop: boolean; isLandscape: boolean };
}

interface MatchupRowProps {
  idx: number;
  p1: string;
  p2: string;
  selectedMatchIndex: number | null;
  selectTeamMatch: (index: number) => void;
  getMatchResult: (p1: string, p2: string) => MatchHistoryEntry | undefined;
  clearMatchResult: (p1: string, p2: string) => void;
  formatTime: (seconds: number) => string;
  deviceInfo: { isPhone: boolean; isTablet: boolean; isDesktop: boolean; isLandscape: boolean };
}

const MatchupRow: React.FC<MatchupRowProps> = ({ 
  idx, 
  p1, 
  p2, 
  selectedMatchIndex, 
  selectTeamMatch, 
  getMatchResult, 
  clearMatchResult, 
  formatTime,
  deviceInfo
}) => {
  const [p1FontSize, setP1FontSize] = React.useState(24);
  const [p2FontSize, setP2FontSize] = React.useState(24);
  const sharedFontSize = Math.min(p1FontSize, p2FontSize);

  const p1Name = p1 || `PLAYER ${idx + 1}`;
  const p2Name = p2 || `PLAYER ${idx + 1}`;
  const lastMatch = getMatchResult(p1Name, p2Name);

  return (
    <tr 
      onClick={() => selectTeamMatch(idx)}
      className={`group cursor-pointer transition-colors hover:bg-emerald-500/5 ${selectedMatchIndex === idx ? 'bg-emerald-500/10' : ''}`}
    >
      <td className="py-2 font-black text-slate-600 truncate" style={{ paddingLeft: deviceInfo.isPhone ? '0' : '1.5vw', paddingRight: deviceInfo.isPhone ? '0' : '1.5vw', fontSize: deviceInfo.isPhone ? '1.35vh' : '3.6vh' }}>#{idx + 1}</td>
      <td className="py-2 text-slate-100 uppercase font-bold group-hover:text-emerald-400 transition-colors truncate" style={{ paddingLeft: deviceInfo.isPhone ? '0' : '1.5vw', paddingRight: deviceInfo.isPhone ? '0' : '1.5vw', fontSize: deviceInfo.isPhone ? '1.35vh' : '5vh' }}>
        {p1 ? (
          <FittingText 
            text={p1} 
            maxFontSize={deviceInfo.isPhone ? 27 : 54} 
            minFontSize={12} 
            className="justify-start" 
            fontSize={sharedFontSize}
            onFontSizeCalculated={setP1FontSize}
          />
        ) : (
          <span className="text-slate-700 italic">EMPTY</span>
        )}
      </td>
      <td className="py-2 text-center text-slate-700 font-black" style={{ paddingLeft: deviceInfo.isPhone ? '0' : '1.5vw', paddingRight: deviceInfo.isPhone ? '0' : '1.5vw', fontSize: deviceInfo.isPhone ? '1.35vh' : '5vh' }}>VS</td>
      <td className="py-2 text-slate-100 uppercase font-bold group-hover:text-emerald-400 transition-colors truncate" style={{ paddingLeft: deviceInfo.isPhone ? '0' : '1.5vw', paddingRight: deviceInfo.isPhone ? '0' : '1.5vw', fontSize: deviceInfo.isPhone ? '1.35vh' : '5vh' }}>
        {p2 ? (
          <FittingText 
            text={p2} 
            maxFontSize={deviceInfo.isPhone ? 27 : 54} 
            minFontSize={12} 
            className="justify-start" 
            fontSize={sharedFontSize}
            onFontSizeCalculated={setP2FontSize}
          />
        ) : (
          <span className="text-slate-700 italic">EMPTY</span>
        )}
      </td>
      <td className="py-2" style={{ paddingLeft: deviceInfo.isPhone ? '0' : '1.5vw', paddingRight: deviceInfo.isPhone ? '0' : '1.5vw' }}>
        {lastMatch ? (
          <div className="flex items-center" style={{ gap: deviceInfo.isPhone ? '0.2vw' : '0.4vw' }}>
            <span className="font-bold rounded" style={{ fontSize: deviceInfo.isPhone ? '0.6vh' : '1.65vh', padding: deviceInfo.isPhone ? '0.2vh' : '0.4vh 0.4vw', backgroundColor: lastMatch.winner === p1Name ? 'rgba(16, 185, 129, 0.2)' : 'rgb(30, 41, 59)', color: lastMatch.winner === p1Name ? 'rgb(52, 211, 153)' : 'rgb(148, 163, 184)' }}>
              {lastMatch.score1}-{lastMatch.score2}
            </span>
            <span className="text-slate-500 font-bold uppercase truncate" style={{ fontSize: deviceInfo.isPhone ? '0.45vh' : '1.35vh' }}>{new Date(lastMatch.date).toLocaleDateString('en-GB', { day: '2-digit', month: '2-digit' })}</span>
          </div>
        ) : (
          <div className="flex items-center" style={{ gap: deviceInfo.isPhone ? '0.2vw' : '0.4vw' }}>
            <span className="font-bold rounded bg-slate-800 text-slate-600" style={{ fontSize: deviceInfo.isPhone ? '0.6vh' : '1.65vh', padding: deviceInfo.isPhone ? '0.2vh' : '0.4vh 0.4vw' }}>
              0-0
            </span>
            <span className="text-slate-600 font-bold uppercase" style={{ fontSize: deviceInfo.isPhone ? '0.45vh' : '1.35vh' }}>READY</span>
          </div>
        )}
      </td>
      <td className="py-2" style={{ paddingLeft: deviceInfo.isPhone ? '0' : '1.5vw', paddingRight: deviceInfo.isPhone ? '0' : '1.5vw' }}>
        {lastMatch && (lastMatch.shotClockSetting || lastMatch.matchClockRemaining !== undefined) ? (
          <div className="flex flex-col gap-0">
            {lastMatch.shotClockSetting && <span className="font-bold text-slate-500" style={{ fontSize: deviceInfo.isPhone ? '0.45vh' : '1.2vh' }}>S:{lastMatch.shotClockSetting}</span>}
            {lastMatch.matchClockRemaining !== undefined && <span className="font-bold text-slate-500" style={{ fontSize: deviceInfo.isPhone ? '0.45vh' : '1.2vh' }}>M:{formatTime(lastMatch.matchClockRemaining)}</span>}
          </div>
        ) : (
          <span className="text-slate-600 font-bold uppercase" style={{ fontSize: deviceInfo.isPhone ? '0.6vh' : '1.35vh' }}>-</span>
        )}
      </td>
      <td className="py-2 text-right" style={{ paddingLeft: deviceInfo.isPhone ? '0' : '1.5vw', paddingRight: deviceInfo.isPhone ? '0' : '1.5vw' }}>
        {lastMatch && (
          <Tooltip text="Clear Result" position="left">
            <button 
              onClick={(e) => {
                e.stopPropagation();
                clearMatchResult(p1Name, p2Name);
              }}
              className="text-red-500 hover:bg-red-500/10 rounded-lg transition-colors"
              style={{ padding: deviceInfo.isPhone ? '0.4vh' : '0.8vh' }}
            >
              <Trash2 style={{ width: deviceInfo.isPhone ? '4.5vw' : '1.2vw', height: deviceInfo.isPhone ? '4.5vw' : '1.2vw' }} />
            </button>
          </Tooltip>
        )}
      </td>
    </tr>
  );
};

export const TeamsView: React.FC<TeamsViewProps> = ({
  player1,
  player2,
  team1Name,
  team2Name,
  team1Players,
  team2Players,
  matchHistory,
  selectedMatchIndex,
  teamTotals,
  updateTeamData,
  downloadData,
  downloadJSON,
  uploadData,
  setShowClearTeamsConfirm,
  selectTeamMatch,
  getMatchResult,
  clearMatchResult,
  formatTime,
  deviceInfo
}) => {
  const battlesRef = useRef<HTMLDivElement>(null);
  const scrollInitiated = useRef(false);
  const [exportFormat, setExportFormat] = React.useState<'CSV' | 'JSON'>('CSV');
  const [headerT1FontSize, setHeaderT1FontSize] = React.useState(deviceInfo.isPhone ? 12 : 29);
  const [headerT2FontSize, setHeaderT2FontSize] = React.useState(deviceInfo.isPhone ? 12 : 29);
  const sharedHeaderFontSize = Math.min(headerT1FontSize, headerT2FontSize);

  // Reset scroll to top immediately on mount to prevent jumps
  React.useLayoutEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  useEffect(() => {
    const hasPlayers = team1Players.some(p => p.trim() !== '') || team2Players.some(p => p.trim() !== '');
    
    if (hasPlayers && !scrollInitiated.current) {
      // Wait for layout and App.tsx transitions to fully stabilize
      const timer = setTimeout(() => {
        if (battlesRef.current) {
          const element = battlesRef.current;
          
          // Ensure we are starting from a clean state
          window.scrollTo(0, 0);
          
          // Use getBoundingClientRect for the most accurate absolute position
          const rect = element.getBoundingClientRect();
          const absoluteY = rect.top + window.pageYOffset;
          
          // Refined offset: We adjust the targetY to be 11% of viewport height.
          // This conserves more vertical space while keeping the title visible below the top bar.
          const targetY = absoluteY - (window.innerHeight * 0.11);
          
          const startY = 0;
          const distance = targetY - startY;
          
          if (Math.abs(distance) < 10) return;

          scrollInitiated.current = true;
          const duration = 1200;
          let startTime: number | null = null;

          const animation = (currentTime: number) => {
            if (startTime === null) startTime = currentTime;
            const timeElapsed = currentTime - startTime;
            const progress = Math.min(timeElapsed / duration, 1);
            
            const ease = progress < 0.5 
              ? 4 * progress * progress * progress 
              : 1 - Math.pow(-2 * progress + 2, 3) / 2;

            window.scrollTo(0, startY + distance * ease);

            if (timeElapsed < duration) {
              requestAnimationFrame(animation);
            }
          };

          requestAnimationFrame(animation);
        }
      }, 600);
      return () => clearTimeout(timer);
    } else if (!hasPlayers) {
      window.scrollTo(0, 0);
    }
  }, [team1Players, team2Players]);

  return (
    <motion.div
      key="teams"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="space-y-12 pb-20 min-h-screen"
    >
      <div 
        className="flex flex-col justify-between gap-6 pb-8 transition-all duration-500"
        style={{ 
          flexDirection: deviceInfo.isPhone ? 'column' : 'row',
          alignItems: deviceInfo.isPhone ? 'stretch' : 'center',
          borderBottom: '2px solid',
          borderImage: `linear-gradient(to right, ${player1.highlightColor} 50%, ${player2.highlightColor} 50%) 1`
        }}
      >
        <div className="space-y-1">
          <h2 className="text-4xl font-black uppercase tracking-tight text-white">Team Setup</h2>
          <p className="text-slate-500 font-bold uppercase tracking-widest text-[10px]">Configure your session players</p>
        </div>
        <div className="flex flex-wrap items-center gap-3">
          <div className="flex items-center gap-2 bg-black/40 px-2 py-1 rounded-lg border border-slate-800">
            <label className="flex items-center gap-1.5 cursor-pointer group">
              <input 
                type="radio" 
                name="exportFormat" 
                value="CSV" 
                checked={exportFormat === 'CSV'}
                onChange={() => setExportFormat('CSV')}
                className="hidden"
              />
              <div 
                className={`w-3.5 h-3.5 rounded-full border-2 flex items-center justify-center transition-all ${exportFormat === 'CSV' ? 'border-transparent' : 'border-slate-600'}`}
                style={{ backgroundColor: exportFormat === 'CSV' ? player2.highlightColor : 'transparent' }}
              >
                {exportFormat === 'CSV' && <div className="w-1 h-1 bg-black rounded-full" />}
              </div>
              <span className={`text-[9px] font-black uppercase tracking-widest transition-colors ${exportFormat === 'CSV' ? 'text-white' : 'text-slate-500'}`}>CSV</span>
            </label>
            <div className="w-px h-2.5 bg-slate-800" />
            <label className="flex items-center gap-1.5 cursor-pointer group">
              <input 
                type="radio" 
                name="exportFormat" 
                value="JSON" 
                checked={exportFormat === 'JSON'}
                onChange={() => setExportFormat('JSON')}
                className="hidden"
              />
              <div 
                className={`w-3.5 h-3.5 rounded-full border-2 flex items-center justify-center transition-all ${exportFormat === 'JSON' ? 'border-transparent' : 'border-slate-600'}`}
                style={{ backgroundColor: exportFormat === 'JSON' ? player2.highlightColor : 'transparent' }}
              >
                {exportFormat === 'JSON' && <div className="w-1 h-1 bg-black rounded-full" />}
              </div>
              <span className={`text-[9px] font-black uppercase tracking-widest transition-colors ${exportFormat === 'JSON' ? 'text-white' : 'text-slate-500'}`}>JSON</span>
            </label>
          </div>

          <div className="flex items-center gap-2">
            <Tooltip text="Export Match History" position="bottom">
              <button 
                onClick={exportFormat === 'CSV' ? downloadData : downloadJSON}
                className="flex items-center gap-1.5 bg-slate-800 hover:bg-slate-700 transition-all font-bold"
                style={{ 
                  borderColor: player2.highlightColor,
                  color: player2.highlightColor,
                  backgroundColor: player2.highlightColor + '11',
                  padding: deviceInfo.isPhone ? '6px 12px' : '8px 16px',
                  borderRadius: deviceInfo.isPhone ? '8px' : '12px',
                  borderWidth: deviceInfo.isPhone ? '1px' : '2px',
                  fontSize: deviceInfo.isPhone ? '12px' : '14px'
                }}
              >
                <Download style={{ width: deviceInfo.isPhone ? '14px' : '16px', height: deviceInfo.isPhone ? '14px' : '16px', color: player2.highlightColor }} />
                Export
              </button>
            </Tooltip>
            <Tooltip text="Import Match History" position="bottom">
              <button 
                onClick={uploadData}
                className="flex items-center gap-1.5 bg-slate-800 hover:bg-slate-700 transition-all font-bold"
                style={{ 
                  borderColor: player2.highlightColor,
                  color: player2.highlightColor,
                  backgroundColor: player2.highlightColor + '11',
                  padding: deviceInfo.isPhone ? '6px 12px' : '8px 16px',
                  borderRadius: deviceInfo.isPhone ? '8px' : '12px',
                  borderWidth: deviceInfo.isPhone ? '1px' : '2px',
                  fontSize: deviceInfo.isPhone ? '12px' : '14px'
                }}
              >
                <Upload style={{ width: deviceInfo.isPhone ? '14px' : '16px', height: deviceInfo.isPhone ? '14px' : '16px', color: player2.highlightColor }} />
                Import
              </button>
            </Tooltip>
            <Tooltip text="Clear All Data" position="bottom">
              <button 
                onClick={() => setShowClearTeamsConfirm(true)}
                className="items-center gap-2 font-bold transition-all border-2"
                style={{ 
                  display: deviceInfo.isPhone ? 'none' : 'flex',
                  borderColor: player2.highlightColor,
                  color: player2.highlightColor,
                  backgroundColor: player2.highlightColor + '11',
                  padding: '8px 16px',
                  borderRadius: '12px',
                  fontSize: '14px'
                }}
              >
                <Trash2 className="w-4 h-4" style={{ color: player2.highlightColor }} />
                Clear All
              </button>
            </Tooltip>
          </div>
        </div>
      </div>

      <div 
        className="grid gap-6"
        style={{ 
          gridTemplateColumns: (!deviceInfo.isPhone || deviceInfo.isLandscape) ? '1fr 1fr' : '1fr',
          gap: deviceInfo.isPhone ? '1.5rem' : '2.5rem'
        }}
      >
        {/* Team 1 Setup */}
        <div className="space-y-8">
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <label className="text-[10px] font-black uppercase tracking-widest text-slate-500">Team 1 Name</label>
              <Users className="w-4 h-4 text-slate-600" />
            </div>
            <input 
              value={team1Name} 
              onChange={(e) => updateTeamData(e.target.value.toUpperCase(), team1Players, team2Name, team2Players)}
              onFocus={(e) => e.target.select()}
              className="w-full bg-black border-2 rounded-2xl px-6 py-4 text-2xl font-black text-slate-100 focus:outline-none uppercase transition-all shadow-xl placeholder:text-white/10" 
              style={{ borderColor: player1.highlightColor }}
              placeholder="TEAM 1 NAME"
            />
          </div>
          <div className="space-y-4">
            <label className="text-[10px] font-black uppercase tracking-widest text-slate-500">Team 1 Players (In Order)</label>
            <div className="space-y-3">
              {team1Players.map((player, idx) => (
                <div key={idx} className="flex gap-3 group">
                  <div 
                    className="w-10 h-12 flex items-center justify-center text-xs font-black bg-black border-2 rounded-xl"
                    style={{ borderColor: player1.highlightColor + '33', color: player1.highlightColor }}
                  >
                    {idx + 1}
                  </div>
                  <input 
                    value={player}
                    onChange={(e) => {
                      const newPlayers = [...team1Players];
                      newPlayers[idx] = e.target.value.toUpperCase();
                      updateTeamData(team1Name, newPlayers, team2Name, team2Players);
                    }}
                    onFocus={(e) => e.target.select()}
                    className="flex-1 bg-black border rounded-xl px-4 py-2 text-slate-100 focus:outline-none uppercase font-bold transition-all"
                    style={{ borderColor: player1.highlightColor + '22' }}
                    placeholder={`PLAYER ${idx + 1}`}
                  />
                  <Tooltip text="Remove Player" position="left">
                    <button 
                      onClick={() => {
                        const newPlayers = team1Players.filter((_, i) => i !== idx);
                        updateTeamData(team1Name, newPlayers, team2Name, team2Players);
                      }}
                      className="p-3 text-red-500 hover:text-red-600 hover:bg-red-500/10 rounded-xl transition-all relative left-[-5vw]"
                    >
                      <Trash2 style={{ width: deviceInfo.isPhone ? '4.5vw' : '1.2vw', height: deviceInfo.isPhone ? '4.5vw' : '1.2vw' }} />
                    </button>
                  </Tooltip>
                </div>
              ))}
              <div className="flex gap-3">
                <div className="w-10 opacity-0" aria-hidden="true" />
                <Tooltip text="Add New Player to Team 1" position="top" className="flex-1">
                  <button 
                    onClick={() => updateTeamData(team1Name, [...team1Players, ''], team2Name, team2Players)}
                    className="w-full py-4 border-2 border-dashed rounded-2xl text-slate-500 transition-all flex items-center justify-center gap-2 text-sm font-black uppercase tracking-widest"
                    style={{ 
                      borderColor: player1.highlightColor + '33', 
                      color: player1.highlightColor,
                      backgroundColor: 'transparent'
                    }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.backgroundColor = player1.highlightColor + '11';
                      e.currentTarget.style.borderColor = player1.highlightColor + '66';
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.backgroundColor = 'transparent';
                      e.currentTarget.style.borderColor = player1.highlightColor + '33';
                    }}
                  >
                    <Plus className="w-4 h-4" />
                    Add Player
                  </button>
                </Tooltip>
                <div className="w-[44px] opacity-0" aria-hidden="true" />
              </div>
            </div>
          </div>
        </div>

        {/* Team 2 Setup */}
        <div className="space-y-8">
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <label className="text-[10px] font-black uppercase tracking-widest text-slate-500">Team 2 Name</label>
              <Users className="w-4 h-4 text-slate-600" />
            </div>
            <input 
              value={team2Name} 
              onChange={(e) => updateTeamData(team1Name, team1Players, e.target.value.toUpperCase(), team2Players)}
              onFocus={(e) => e.target.select()}
              className="w-full bg-black border-2 rounded-2xl px-6 py-4 text-2xl font-black text-slate-100 focus:outline-none uppercase transition-all shadow-xl placeholder:text-white/10" 
              style={{ borderColor: player2.highlightColor }}
              placeholder="TEAM 2 NAME"
            />
          </div>
          <div className="space-y-4">
            <label className="text-[10px] font-black uppercase tracking-widest text-slate-500">Team 2 Players (In Order)</label>
            <div className="space-y-3">
              {team2Players.map((player, idx) => (
                <div key={idx} className="flex gap-3 group">
                  <div 
                    className="w-10 h-12 flex items-center justify-center text-xs font-black bg-black border-2 rounded-xl"
                    style={{ borderColor: player2.highlightColor + '33', color: player2.highlightColor }}
                  >
                    {idx + 1}
                  </div>
                  <input 
                    value={player}
                    onChange={(e) => {
                      const newPlayers = [...team2Players];
                      newPlayers[idx] = e.target.value.toUpperCase();
                      updateTeamData(team1Name, team1Players, team2Name, newPlayers);
                    }}
                    onFocus={(e) => e.target.select()}
                    className="flex-1 bg-black border rounded-xl px-4 py-2 text-slate-100 focus:outline-none uppercase font-bold transition-all"
                    style={{ borderColor: player2.highlightColor + '22' }}
                    placeholder={`PLAYER ${idx + 1}`}
                  />
                  <Tooltip text="Remove Player" position="left">
                    <button 
                      onClick={() => {
                        const newPlayers = team2Players.filter((_, i) => i !== idx);
                        updateTeamData(team1Name, team1Players, team2Name, newPlayers);
                      }}
                      className="p-3 text-red-500 hover:text-red-600 hover:bg-red-500/10 rounded-xl transition-all relative left-[-5vw]"
                    >
                      <Trash2 style={{ width: deviceInfo.isPhone ? '4.5vw' : '1.2vw', height: deviceInfo.isPhone ? '4.5vw' : '1.2vw' }} />
                    </button>
                  </Tooltip>
                </div>
              ))}
              <div className="flex gap-3">
                <div className="w-10 opacity-0" aria-hidden="true" />
                <Tooltip text="Add New Player to Team 2" position="top" className="flex-1">
                  <button 
                    onClick={() => updateTeamData(team1Name, team1Players, team2Name, [...team2Players, ''])}
                    className="w-full py-4 border-2 border-dashed rounded-2xl text-slate-500 transition-all flex items-center justify-center gap-2 text-sm font-black uppercase tracking-widest"
                    style={{ 
                      borderColor: player2.highlightColor + '33', 
                      color: player2.highlightColor,
                      backgroundColor: 'transparent'
                    }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.backgroundColor = player2.highlightColor + '11';
                      e.currentTarget.style.borderColor = player2.highlightColor + '66';
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.backgroundColor = 'transparent';
                      e.currentTarget.style.borderColor = player2.highlightColor + '33';
                    }}
                  >
                    <Plus className="w-4 h-4" />
                    Add Player
                  </button>
                </Tooltip>
                <div className="w-[44px] opacity-0" aria-hidden="true" />
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Matchups Table */}
      <div 
        ref={battlesRef}
        className="space-y-4 pt-4 border-t-2" 
        style={{ borderImage: `linear-gradient(to right, ${player1.highlightColor} 50%, ${player2.highlightColor} 50%) 1` }}
      >
        <div className="flex flex-col items-center text-center min-h-[160px] justify-center">
          <img 
            src={bloodyBattlesImg} 
            alt="Bloody Battles" 
            className="h-36 w-auto object-contain"
            referrerPolicy="no-referrer"
          />
          <p className="text-slate-500 font-bold uppercase tracking-widest text-[10px]">Session schedule and results</p>
        </div>
        <div className="bg-black border border-slate-800 rounded-3xl overflow-hidden shadow-2xl">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse min-w-[150px] table-fixed">
              <colgroup>
                <col className="w-[10%]" />
                <col className="w-[22%]" />
                <col className="w-[6%]" />
                <col className="w-[22%]" />
                <col className="w-[18%]" />
                <col className="w-[12%]" />
                <col className="w-[10%]" />
              </colgroup>
              <thead>
                <tr className="bg-blue-600/20 border-b border-slate-800">
                  <th className="py-2 font-bold uppercase" style={{ paddingLeft: deviceInfo.isPhone ? '0' : '1.5rem', paddingRight: deviceInfo.isPhone ? '0' : '1.5rem', fontSize: deviceInfo.isPhone ? '9px' : '22px', letterSpacing: deviceInfo.isPhone ? '-0.05em' : '0.1em' }}>MATCH (V5)</th>
                  <th className="py-2 font-bold uppercase" style={{ paddingLeft: deviceInfo.isPhone ? '0' : '1.5rem', paddingRight: deviceInfo.isPhone ? '0' : '1.5rem', fontSize: deviceInfo.isPhone ? '12px' : '29px', letterSpacing: deviceInfo.isPhone ? '-0.05em' : '0.1em' }}>
                    <FittingText 
                      text={team1Name || 'TEAM A'} 
                      maxFontSize={deviceInfo.isPhone ? 12 : 29} 
                      minFontSize={6} 
                      className="justify-start" 
                      fontSize={sharedHeaderFontSize}
                      onFontSizeCalculated={setHeaderT1FontSize}
                    />
                  </th>
                  <th className="py-2 font-bold uppercase text-center" style={{ paddingLeft: deviceInfo.isPhone ? '0' : '1.5rem', paddingRight: deviceInfo.isPhone ? '0' : '1.5rem', fontSize: deviceInfo.isPhone ? '9px' : '22px', letterSpacing: deviceInfo.isPhone ? '-0.05em' : '0.1em' }}>VS</th>
                  <th className="py-2 font-bold uppercase" style={{ paddingLeft: deviceInfo.isPhone ? '0' : '1.5rem', paddingRight: deviceInfo.isPhone ? '0' : '1.5rem', fontSize: deviceInfo.isPhone ? '12px' : '29px', letterSpacing: deviceInfo.isPhone ? '-0.05em' : '0.1em' }}>
                    <FittingText 
                      text={team2Name || 'TEAM B'} 
                      maxFontSize={deviceInfo.isPhone ? 12 : 29} 
                      minFontSize={6} 
                      className="justify-start" 
                      fontSize={sharedHeaderFontSize}
                      onFontSizeCalculated={setHeaderT2FontSize}
                    />
                  </th>
                  <th className="py-2 font-bold uppercase" style={{ paddingLeft: deviceInfo.isPhone ? '0' : '1.5rem', paddingRight: deviceInfo.isPhone ? '0' : '1.5rem', fontSize: deviceInfo.isPhone ? '9px' : '22px', letterSpacing: deviceInfo.isPhone ? '-0.05em' : '0.1em' }}>Last Result</th>
                  <th className="py-2 font-bold uppercase" style={{ paddingLeft: deviceInfo.isPhone ? '0' : '1.5rem', paddingRight: deviceInfo.isPhone ? '0' : '1.5rem', fontSize: deviceInfo.isPhone ? '9px' : '22px', letterSpacing: deviceInfo.isPhone ? '-0.05em' : '0.1em' }}>Clock</th>
                  <th className="py-2 font-bold uppercase text-right" style={{ paddingLeft: deviceInfo.isPhone ? '0' : '1.5rem', paddingRight: deviceInfo.isPhone ? '0' : '1.5rem', fontSize: deviceInfo.isPhone ? '9px' : '22px', letterSpacing: deviceInfo.isPhone ? '-0.05em' : '0.1em' }}>Action</th>
                </tr>
              </thead>
              <tbody>
                {Math.max(team1Players.length, team2Players.length) === 0 ? (
                  <tr>
                    <td 
                      colSpan={7} 
                      className="text-center text-slate-500 italic"
                      style={{ 
                        padding: deviceInfo.isPhone ? '1rem 0.5rem' : '3rem 1.5rem',
                        fontSize: deviceInfo.isPhone ? '10px' : '16px'
                      }}
                    >
                      Add players to generate matchups.
                    </td>
                  </tr>
                ) : (
                  <>
                    {Array.from({ length: Math.max(team1Players.length, team2Players.length) }).map((_, idx) => {
                      const p1 = team1Players[idx];
                      const p2 = team2Players[idx];
                      
                      if (!p1 && !p2) return null;

                      return (
                        <MatchupRow 
                          key={idx}
                          idx={idx}
                          p1={p1}
                          p2={p2}
                          selectedMatchIndex={selectedMatchIndex}
                          selectTeamMatch={selectTeamMatch}
                          getMatchResult={getMatchResult}
                          clearMatchResult={clearMatchResult}
                          formatTime={formatTime}
                          deviceInfo={deviceInfo}
                        />
                      );
                    })}
                    {/* Totals Row */}
                    <tr className="bg-slate-800/80 border-t-2 border-slate-700 font-black">
                      <td className="py-3 uppercase text-emerald-500" style={{ paddingLeft: deviceInfo.isPhone ? '8px' : '1.5rem', paddingRight: deviceInfo.isPhone ? '8px' : '1.5rem', fontSize: deviceInfo.isPhone ? '11px' : '15px', letterSpacing: '0.2em' }}>Total Score</td>
                      <td className="py-3" style={{ paddingLeft: deviceInfo.isPhone ? '8px' : '1.5rem', paddingRight: deviceInfo.isPhone ? '8px' : '1.5rem' }}>
                        <div className="flex flex-col">
                          <span className="text-emerald-400 tabular-nums" style={{ fontSize: deviceInfo.isPhone ? '27px' : '36px' }}>{teamTotals.t1}</span>
                          <span className="text-slate-500 uppercase tracking-tighter" style={{ fontSize: deviceInfo.isPhone ? '11px' : '12px' }}>{team1Name}</span>
                        </div>
                      </td>
                      <td className="py-3 text-center text-slate-700 font-black" style={{ paddingLeft: deviceInfo.isPhone ? '8px' : '1.5rem', paddingRight: deviceInfo.isPhone ? '8px' : '1.5rem', fontSize: deviceInfo.isPhone ? '15px' : '24px' }}>SUM</td>
                      <td className="py-3" style={{ paddingLeft: deviceInfo.isPhone ? '8px' : '1.5rem', paddingRight: deviceInfo.isPhone ? '8px' : '1.5rem' }}>
                        <div className="flex flex-col">
                          <span className="text-emerald-400 tabular-nums" style={{ fontSize: deviceInfo.isPhone ? '27px' : '36px' }}>{teamTotals.t2}</span>
                          <span className="text-slate-500 uppercase tracking-tighter" style={{ fontSize: deviceInfo.isPhone ? '11px' : '12px' }}>{team2Name}</span>
                        </div>
                      </td>
                      <td colSpan={3} className="py-3 bg-slate-900/50" style={{ paddingLeft: deviceInfo.isPhone ? '8px' : '1.5rem', paddingRight: deviceInfo.isPhone ? '8px' : '1.5rem' }}>
                        <div className="flex items-center justify-end" style={{ gap: deviceInfo.isPhone ? '8px' : '16px' }}>
                          <div className="flex flex-col items-end">
                            <span className="text-slate-500 uppercase font-bold" style={{ fontSize: deviceInfo.isPhone ? '11px' : '15px' }}>Overall Lead</span>
                            <span className="font-black text-slate-100" style={{ fontSize: deviceInfo.isPhone ? '15px' : '21px' }}>
                              {teamTotals.t1 === teamTotals.t2 ? 'TIED' : 
                               teamTotals.t1 > teamTotals.t2 ? `${team1Name} (+${teamTotals.t1 - teamTotals.t2})` : 
                               `${team2Name} (+${teamTotals.t2 - teamTotals.t1})`}
                            </span>
                          </div>
                          <div className="rounded-full bg-emerald-500/10 flex items-center justify-center border border-emerald-500/20" style={{ width: deviceInfo.isPhone ? '24px' : '40px', height: deviceInfo.isPhone ? '24px' : '40px' }}>
                            <Trophy className="text-emerald-400" style={{ width: deviceInfo.isPhone ? '12px' : '20px', height: deviceInfo.isPhone ? '12px' : '20px' }} />
                          </div>
                        </div>
                      </td>
                    </tr>
                  </>
                )}
              </tbody>
            </table>
          </div>
        </div>
        <div className={`flex justify-center pt-4 ${!deviceInfo.isPhone ? 'hidden' : ''}`}>
          <Tooltip text="Clear All Data" position="top">
            <button 
              onClick={() => setShowClearTeamsConfirm(true)}
              className="flex items-center gap-2 px-6 py-3 text-sm font-black rounded-2xl transition-all border-2 uppercase tracking-widest shadow-xl"
              style={{ 
                borderColor: player2.highlightColor,
                color: player2.highlightColor,
                backgroundColor: player2.highlightColor + '11'
              }}
            >
              <Trash2 className="w-5 h-5" style={{ color: player2.highlightColor }} />
              Clear All Data
            </button>
          </Tooltip>
        </div>
      </div>
    </motion.div>
  );
};
