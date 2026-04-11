import React, { useEffect, useRef } from 'react';
import { motion } from 'motion/react';
import { Users, Download, Upload, Trash2, X, Plus, Trophy } from 'lucide-react';
import { Player, MatchHistoryEntry } from '../types';
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
}

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
  formatTime
}) => {
  const battlesRef = useRef<HTMLDivElement>(null);
  const scrollInitiated = useRef(false);
  const [exportFormat, setExportFormat] = React.useState<'CSV' | 'JSON'>('CSV');

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
        className="flex flex-col sm:flex-row sm:items-center justify-between gap-6 pb-8 transition-all duration-500"
        style={{ 
          borderBottom: '2px solid',
          borderImage: `linear-gradient(to right, ${player1.highlightColor} 50%, ${player2.highlightColor} 50%) 1`
        }}
      >
        <div className="space-y-1">
          <h2 className="text-4xl font-black uppercase tracking-tight text-white">Team Setup</h2>
          <p className="text-slate-500 font-bold uppercase tracking-widest text-[10px]">Configure your session players</p>
        </div>
        <div className="flex flex-wrap items-center gap-4">
          <div className="flex items-center gap-3 bg-black/40 px-3 py-1.5 rounded-xl border border-slate-800">
            <label className="flex items-center gap-2 cursor-pointer group">
              <input 
                type="radio" 
                name="exportFormat" 
                value="CSV" 
                checked={exportFormat === 'CSV'}
                onChange={() => setExportFormat('CSV')}
                className="hidden"
              />
              <div 
                className={`w-4 h-4 rounded-full border-2 flex items-center justify-center transition-all ${exportFormat === 'CSV' ? 'border-transparent' : 'border-slate-600'}`}
                style={{ backgroundColor: exportFormat === 'CSV' ? player2.highlightColor : 'transparent' }}
              >
                {exportFormat === 'CSV' && <div className="w-1.5 h-1.5 bg-black rounded-full" />}
              </div>
              <span className={`text-[10px] font-black uppercase tracking-widest transition-colors ${exportFormat === 'CSV' ? 'text-white' : 'text-slate-500'}`}>CSV</span>
            </label>
            <div className="w-px h-3 bg-slate-800" />
            <label className="flex items-center gap-2 cursor-pointer group">
              <input 
                type="radio" 
                name="exportFormat" 
                value="JSON" 
                checked={exportFormat === 'JSON'}
                onChange={() => setExportFormat('JSON')}
                className="hidden"
              />
              <div 
                className={`w-4 h-4 rounded-full border-2 flex items-center justify-center transition-all ${exportFormat === 'JSON' ? 'border-transparent' : 'border-slate-600'}`}
                style={{ backgroundColor: exportFormat === 'JSON' ? player2.highlightColor : 'transparent' }}
              >
                {exportFormat === 'JSON' && <div className="w-1.5 h-1.5 bg-black rounded-full" />}
              </div>
              <span className={`text-[10px] font-black uppercase tracking-widest transition-colors ${exportFormat === 'JSON' ? 'text-white' : 'text-slate-500'}`}>JSON</span>
            </label>
          </div>

          <button 
            onClick={exportFormat === 'CSV' ? downloadData : downloadJSON}
            className="flex items-center gap-2 px-4 py-2 bg-slate-800 hover:bg-slate-700 rounded-xl transition-all font-bold text-sm border-2"
            style={{ 
              borderColor: player2.highlightColor,
              color: player2.highlightColor,
              backgroundColor: player2.highlightColor + '11'
            }}
          >
            <Download className="w-4 h-4" style={{ color: player2.highlightColor }} />
            Export
          </button>
          <button 
            onClick={uploadData}
            className="flex items-center gap-2 px-4 py-2 bg-slate-800 hover:bg-slate-700 rounded-xl transition-all font-bold text-sm border-2"
            style={{ 
              borderColor: player2.highlightColor,
              color: player2.highlightColor,
              backgroundColor: player2.highlightColor + '11'
            }}
          >
            <Upload className="w-4 h-4" style={{ color: player2.highlightColor }} />
            Import
          </button>
          <button 
            onClick={() => setShowClearTeamsConfirm(true)}
            className="flex items-center gap-2 px-4 py-2 text-sm font-bold rounded-xl transition-all border-2"
            style={{ 
              borderColor: player2.highlightColor,
              color: player2.highlightColor,
              backgroundColor: player2.highlightColor + '11'
            }}
          >
            <Trash2 className="w-4 h-4" style={{ color: player2.highlightColor }} />
            Clear All
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
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
              className="w-full bg-black/40 border-2 rounded-2xl px-6 py-4 text-2xl font-black text-slate-100 focus:outline-none uppercase transition-all shadow-xl placeholder:text-white/10" 
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
                    className="flex-1 bg-black/50 border rounded-xl px-4 py-2 text-slate-100 focus:outline-none uppercase font-bold transition-all"
                    style={{ borderColor: player1.highlightColor + '22' }}
                    placeholder={`PLAYER ${idx + 1}`}
                  />
                  <button 
                    onClick={() => {
                      const newPlayers = team1Players.filter((_, i) => i !== idx);
                      updateTeamData(team1Name, newPlayers, team2Name, team2Players);
                    }}
                    className="p-3 text-slate-600 hover:text-red-500 hover:bg-red-500/10 rounded-xl transition-all opacity-0 group-hover:opacity-100"
                  >
                    <X className="w-5 h-5" />
                  </button>
                </div>
              ))}
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
              className="w-full bg-black/40 border-2 rounded-2xl px-6 py-4 text-2xl font-black text-slate-100 focus:outline-none uppercase transition-all shadow-xl placeholder:text-white/10" 
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
                    className="flex-1 bg-black/50 border rounded-xl px-4 py-2 text-slate-100 focus:outline-none uppercase font-bold transition-all"
                    style={{ borderColor: player2.highlightColor + '22' }}
                    placeholder={`PLAYER ${idx + 1}`}
                  />
                  <button 
                    onClick={() => {
                      const newPlayers = team2Players.filter((_, i) => i !== idx);
                      updateTeamData(team1Name, team1Players, team2Name, newPlayers);
                    }}
                    className="p-3 text-slate-600 hover:text-red-500 hover:bg-red-500/10 rounded-xl transition-all opacity-0 group-hover:opacity-100"
                  >
                    <X className="w-5 h-5" />
                  </button>
                </div>
              ))}
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
        <div className="bg-black/40 border border-slate-800 rounded-3xl overflow-hidden shadow-2xl">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-black/50 border-b border-slate-800">
                  <th className="px-6 py-4 text-[10px] font-bold uppercase tracking-widest text-slate-500">Match</th>
                  <th className="px-6 py-4 text-[10px] font-bold uppercase tracking-widest text-slate-500">{team1Name || 'TEAM A'}</th>
                  <th className="px-6 py-4 text-[10px] font-bold uppercase tracking-widest text-slate-500 text-center">VS</th>
                  <th className="px-6 py-4 text-[10px] font-bold uppercase tracking-widest text-slate-500">{team2Name || 'TEAM B'}</th>
                  <th className="px-6 py-4 text-[10px] font-bold uppercase tracking-widest text-slate-500">Last Result</th>
                  <th className="px-6 py-4 text-[10px] font-bold uppercase tracking-widest text-slate-500">Clock</th>
                  <th className="px-6 py-4 text-[10px] font-bold uppercase tracking-widest text-slate-500 text-right">Action</th>
                </tr>
              </thead>
              <tbody>
                {Math.max(team1Players.length, team2Players.length) === 0 ? (
                  <tr>
                    <td colSpan={7} className="px-6 py-12 text-center text-slate-500 italic">Add players to generate matchups.</td>
                  </tr>
                ) : (
                  <>
                    {Array.from({ length: Math.max(team1Players.length, team2Players.length) }).map((_, idx) => {
                      const p1 = team1Players[idx];
                      const p2 = team2Players[idx];
                      
                      if (!p1 && !p2) return null;

                      const p1Name = p1 || `PLAYER ${idx + 1}`;
                      const p2Name = p2 || `PLAYER ${idx + 1}`;
                      const lastMatch = getMatchResult(p1Name, p2Name);
                      
                      return (
                        <tr 
                          key={idx} 
                          onClick={() => selectTeamMatch(idx)}
                          className={`group cursor-pointer transition-colors hover:bg-emerald-500/5 ${selectedMatchIndex === idx ? 'bg-emerald-500/10' : ''}`}
                        >
                          <td className="px-6 py-4 text-xs font-black text-slate-600">#{idx + 1}</td>
                          <td className="px-6 py-4 text-slate-100 uppercase font-bold group-hover:text-emerald-400 transition-colors">
                            {p1 || <span className="text-slate-700 italic">EMPTY</span>}
                          </td>
                          <td className="px-6 py-4 text-center text-slate-700 font-black">VS</td>
                          <td className="px-6 py-4 text-slate-100 uppercase font-bold group-hover:text-emerald-400 transition-colors">
                            {p2 || <span className="text-slate-700 italic">EMPTY</span>}
                          </td>
                          <td className="px-6 py-4">
                            {lastMatch ? (
                              <div className="flex items-center gap-2">
                                <span className={`text-xs font-bold px-2 py-0.5 rounded ${lastMatch.winner === p1Name ? 'bg-emerald-500/20 text-emerald-400' : 'bg-slate-800 text-slate-400'}`}>
                                  {lastMatch.score1} - {lastMatch.score2}
                                </span>
                                <span className="text-[10px] text-slate-500 font-bold uppercase">{new Date(lastMatch.date).toLocaleDateString('en-GB')}</span>
                              </div>
                            ) : (
                              <div className="flex items-center gap-2">
                                <span className="text-xs font-bold px-2 py-0.5 rounded bg-slate-800 text-slate-600">
                                  0 - 0
                                </span>
                                <span className="text-[10px] text-slate-600 font-bold uppercase">READY</span>
                              </div>
                            )}
                          </td>
                          <td className="px-6 py-4">
                            {lastMatch && (lastMatch.shotClockSetting || lastMatch.matchClockRemaining !== undefined) ? (
                              <div className="flex flex-col gap-0.5">
                                {lastMatch.shotClockSetting && <span className="text-[9px] font-bold text-slate-500">SHOT: {lastMatch.shotClockSetting}S</span>}
                                {lastMatch.matchClockRemaining !== undefined && <span className="text-[9px] font-bold text-slate-500">MATCH: {formatTime(lastMatch.matchClockRemaining)}</span>}
                              </div>
                            ) : (
                              <span className="text-[10px] text-slate-600 font-bold uppercase">-</span>
                            )}
                          </td>
                          <td className="px-6 py-4 text-right">
                            {lastMatch && (
                              <button 
                                onClick={(e) => {
                                  e.stopPropagation();
                                  clearMatchResult(p1Name, p2Name);
                                }}
                                className="p-2 text-red-500 hover:bg-red-500/10 rounded-lg transition-colors"
                                title="Clear Result"
                              >
                                <Trash2 className="w-4 h-4" />
                              </button>
                            )}
                          </td>
                        </tr>
                      );
                    })}
                    {/* Totals Row */}
                    <tr className="bg-slate-800/80 border-t-2 border-slate-700 font-black">
                      <td className="px-6 py-5 text-[10px] uppercase tracking-[0.2em] text-emerald-500">Total Score</td>
                      <td className="px-6 py-5">
                        <div className="flex flex-col">
                          <span className="text-2xl text-emerald-400 tabular-nums">{teamTotals.t1}</span>
                          <span className="text-[8px] text-slate-500 uppercase tracking-tighter">{team1Name}</span>
                        </div>
                      </td>
                      <td className="px-6 py-5 text-center text-slate-700 font-black">SUM</td>
                      <td className="px-6 py-5">
                        <div className="flex flex-col">
                          <span className="text-2xl text-emerald-400 tabular-nums">{teamTotals.t2}</span>
                          <span className="text-[8px] text-slate-500 uppercase tracking-tighter">{team2Name}</span>
                        </div>
                      </td>
                      <td colSpan={3} className="px-6 py-5 bg-slate-900/50">
                        <div className="flex items-center justify-end gap-4">
                          <div className="flex flex-col items-end">
                            <span className="text-[10px] text-slate-500 uppercase font-bold">Overall Lead</span>
                            <span className="text-sm font-black text-slate-100">
                              {teamTotals.t1 === teamTotals.t2 ? 'TIED' : 
                               teamTotals.t1 > teamTotals.t2 ? `${team1Name} (+${teamTotals.t1 - teamTotals.t2})` : 
                               `${team2Name} (+${teamTotals.t2 - teamTotals.t1})`}
                            </span>
                          </div>
                          <div className="w-10 h-10 rounded-full bg-emerald-500/10 flex items-center justify-center border border-emerald-500/20">
                            <Trophy className="w-5 h-5 text-emerald-400" />
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
      </div>
    </motion.div>
  );
};
