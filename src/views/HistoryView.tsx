import React from 'react';
import { motion } from 'motion/react';
import { Trophy, Trash2, Calendar, User, Hash } from 'lucide-react';
import { Player, MatchHistoryEntry } from '../types';

interface HistoryViewProps {
  player1: Player;
  player2: Player;
  matchHistory: MatchHistoryEntry[];
  setShowClearHistoryConfirm: (show: boolean) => void;
  formatTime: (seconds: number) => string;
}

export const HistoryView: React.FC<HistoryViewProps> = ({
  player1,
  player2,
  matchHistory,
  setShowClearHistoryConfirm,
  formatTime
}) => {
  return (
    <motion.div
      key="history"
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.95 }}
      className="space-y-12 pb-20"
    >
      <div 
        className="flex flex-col sm:flex-row sm:items-center justify-between gap-6 pb-8 transition-all duration-500"
        style={{ 
          borderBottom: '2px solid',
          borderImage: `linear-gradient(to right, ${player1.highlightColor} 50%, ${player2.highlightColor} 50%) 1`
        }}
      >
        <div className="space-y-1">
          <h2 className="text-4xl font-black uppercase tracking-tight text-white">Match History</h2>
          <p className="text-slate-500 font-bold uppercase tracking-widest text-[10px]">Review past performances</p>
        </div>
        <button 
          onClick={() => setShowClearHistoryConfirm(true)}
          className="flex items-center gap-2 px-6 py-3 bg-red-500/10 hover:bg-red-500/20 text-red-500 rounded-2xl transition-all font-bold text-sm border-2 border-red-500/20"
        >
          <Trash2 className="w-4 h-4" />
          Clear All History
        </button>
      </div>

      {matchHistory.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-20 space-y-6 bg-slate-900/50 rounded-[40px] border-2 border-dashed border-slate-800">
          <div className="w-20 h-20 rounded-full bg-slate-800 flex items-center justify-center">
            <Trophy className="w-10 h-10 text-slate-600" />
          </div>
          <div className="text-center space-y-2">
            <p className="text-xl font-black text-slate-400 uppercase tracking-tight">No Matches Recorded</p>
            <p className="text-sm text-slate-600 font-bold uppercase tracking-widest">Complete a match to see it here.</p>
          </div>
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-6">
          {matchHistory.map((match) => (
            <motion.div 
              key={match.id}
              layout
              className="bg-black border border-slate-800 rounded-3xl p-6 sm:p-8 shadow-xl hover:border-slate-700 transition-all group relative overflow-hidden"
            >
              <div className="absolute top-0 left-0 w-1 h-full bg-emerald-500 opacity-0 group-hover:opacity-100 transition-opacity" />
              
              <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-8">
                <div className="flex items-center gap-6">
                  <div className="flex flex-col items-center justify-center w-16 h-16 bg-slate-900 rounded-2xl border border-slate-800">
                    <Calendar className="w-5 h-5 text-slate-500 mb-1" />
                    <span className="text-[10px] font-black text-slate-400 uppercase">
                      {new Date(match.date).toLocaleDateString('en-GB', { day: '2-digit', month: '2-digit' })}
                    </span>
                  </div>
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <Hash className="w-3 h-3 text-slate-600" />
                      <span className="text-[10px] font-black text-slate-600 uppercase tracking-widest">Match ID: {match.id.slice(-6)}</span>
                    </div>
                    <p className="text-xs font-bold text-slate-500 uppercase tracking-widest">
                      {match.team1 && match.team2 ? `${match.team1} VS ${match.team2}` : 'Single Match'}
                    </p>
                  </div>
                </div>

                <div className="flex-1 flex items-center justify-center gap-4 sm:gap-12">
                  <div className="flex flex-col items-end gap-1 flex-1">
                    <span className={`text-lg sm:text-2xl font-black uppercase tracking-tight ${match.winner === match.player1 ? 'text-emerald-400' : 'text-slate-400'}`}>
                      {match.player1}
                    </span>
                    <span className="text-[10px] font-bold text-slate-600 uppercase tracking-widest">Player 1</span>
                  </div>

                  <div className="flex items-center gap-4 sm:gap-8">
                    <span className={`text-4xl sm:text-6xl font-black tabular-nums ${match.winner === match.player1 ? 'text-white' : 'text-slate-600'}`}>
                      {match.score1}
                    </span>
                    <div className="h-12 w-px bg-slate-800" />
                    <span className={`text-4xl sm:text-6xl font-black tabular-nums ${match.winner === match.player2 ? 'text-white' : 'text-slate-600'}`}>
                      {match.score2}
                    </span>
                  </div>

                  <div className="flex flex-col items-start gap-1 flex-1">
                    <span className={`text-lg sm:text-2xl font-black uppercase tracking-tight ${match.winner === match.player2 ? 'text-emerald-400' : 'text-slate-400'}`}>
                      {match.player2}
                    </span>
                    <span className="text-[10px] font-bold text-slate-600 uppercase tracking-widest">Player 2</span>
                  </div>
                </div>

                <div className="flex items-center justify-end gap-6 lg:w-48">
                  <div className="text-right">
                    <p className="text-[10px] font-black text-slate-600 uppercase tracking-widest mb-1">Winner</p>
                    <div className="flex items-center gap-2 text-emerald-400">
                      <Trophy className="w-4 h-4" />
                      <span className="text-sm font-black uppercase tracking-tight">{match.winner}</span>
                    </div>
                  </div>
                </div>
              </div>

              {(match.shotClockSetting || match.matchClockRemaining !== undefined) && (
                <div className="mt-6 pt-6 border-t border-slate-800/50 flex flex-wrap gap-4">
                  {match.shotClockSetting && (
                    <div className="flex items-center gap-2 px-3 py-1 bg-slate-900 rounded-lg border border-slate-800">
                      <span className="text-[9px] font-black text-slate-500 uppercase">Shot Clock:</span>
                      <span className="text-[10px] font-bold text-slate-300">{match.shotClockSetting}s</span>
                    </div>
                  )}
                  {match.matchClockRemaining !== undefined && (
                    <div className="flex items-center gap-2 px-3 py-1 bg-slate-900 rounded-lg border border-slate-800">
                      <span className="text-[9px] font-black text-slate-500 uppercase">Match Clock:</span>
                      <span className="text-[10px] font-bold text-slate-300">{formatTime(match.matchClockRemaining)}</span>
                    </div>
                  )}
                </div>
              )}
            </motion.div>
          ))}
        </div>
      )}
    </motion.div>
  );
};
