import React from 'react';
import { motion } from 'motion/react';
import { Player } from '../types';
import { ScoreCard } from '../components/ScoreCard';
import { TimerDisplay } from '../components/TimerDisplay';
import finishBattleImg from '../bloody_finish_battle.png';

interface ScoreboardViewProps {
  player1: Player;
  player2: Player;
  team1Name: string;
  team2Name: string;
  isShotClockEnabled: boolean;
  isMatchClockEnabled: boolean;
  shotClock: number;
  matchClock: number;
  isTimerRunning: boolean;
  isEditingNames: boolean;
  onToggleTimer: () => void;
  onResetTimer: () => void;
  onResetMatchClock: () => void;
  formatTime: (seconds: number) => string;
  incrementScore: (id: string) => void;
  decrementScore: (id: string) => void;
  setPlayer1: (updates: Partial<Player>) => void;
  setPlayer2: (updates: Partial<Player>) => void;
  resetTimer: () => void;
  finishMatch: () => void;
  deviceInfo: { isPhone: boolean; isTablet: boolean; isDesktop: boolean };
  isNavVisible: boolean;
}

export const ScoreboardView: React.FC<ScoreboardViewProps> = ({
  player1,
  player2,
  team1Name,
  team2Name,
  isShotClockEnabled,
  isMatchClockEnabled,
  shotClock,
  matchClock,
  isTimerRunning,
  isEditingNames,
  onToggleTimer,
  onResetTimer,
  onResetMatchClock,
  formatTime,
  incrementScore,
  decrementScore,
  setPlayer1,
  setPlayer2,
  resetTimer,
  finishMatch,
  deviceInfo,
  isNavVisible
}) => {
  return (
    <motion.div
      key="scoreboard-view"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.4, ease: "easeInOut" }}
      className="flex flex-col sm:flex-none w-full"
    >
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -20 }}
        className="relative pt-1 sm:pb-4 sm:py-2 flex flex-col gap-1 sm:gap-4 min-h-0 flex-1 sm:flex-none justify-end sm:justify-start pb-0"
      >
        <TimerDisplay 
          isShotClockEnabled={isShotClockEnabled}
          isMatchClockEnabled={isMatchClockEnabled}
          shotClock={shotClock}
          matchClock={matchClock}
          isTimerRunning={isTimerRunning}
          onToggleTimer={onToggleTimer}
          onResetTimer={() => {
            resetTimer();
            if (isMatchClockEnabled && !isShotClockEnabled) onResetMatchClock();
          }}
          formatTime={formatTime}
          player1Color={player1.highlightColor}
          player2Color={player2.highlightColor}
        />

        <div className="relative sm:flex-1 flex items-center justify-center w-full py-0 sm:py-2">
          {/* Team Names Display (Absolute to the card grid area) - Hidden on mobile portrait */}
          <div 
            className="absolute inset-y-0 -left-[var(--sidebar-width)] hidden sm:flex items-center justify-center pointer-events-none z-0 overflow-hidden"
            style={{ width: 'var(--sidebar-width)' }}
          >
            {team1Name && (
              <div 
                className="text-[min(4vw,14px)] sm:text-[28px] lg:text-[40px] font-gothic font-black uppercase tracking-[0.2em] vertical-text rotate-180 h-full flex items-center justify-center opacity-90"
                style={{ color: player1.highlightColor }}
              >
                {team1Name}
              </div>
            )}
          </div>
          <div 
            className="absolute inset-y-0 -right-[var(--sidebar-width)] hidden sm:flex items-center justify-center pointer-events-none z-0 overflow-hidden"
            style={{ width: 'var(--sidebar-width)' }}
          >
            {team2Name && (
              <div 
                className="text-[min(4vw,14px)] sm:text-[28px] lg:text-[40px] font-gothic font-black uppercase tracking-[0.2em] vertical-text h-full flex items-center justify-center opacity-90"
                style={{ color: player2.highlightColor }}
              >
                {team2Name}
              </div>
            )}
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 sm:gap-4 lg:gap-5 w-full">
            <ScoreCard 
              player={player1}
              isEditingNames={isEditingNames}
              onNameChange={(name) => setPlayer1({ name })}
              onIncrement={() => incrementScore('1')}
              onDecrement={() => decrementScore('1')}
              onTurnSelect={() => {
                if (!player1.isTurn) {
                  setPlayer1({ isTurn: true });
                  setPlayer2({ isTurn: false });
                  resetTimer();
                }
              }}
              idx={0}
            />
            <ScoreCard 
              player={player2}
              isEditingNames={isEditingNames}
              onNameChange={(name) => setPlayer2({ name })}
              onIncrement={() => incrementScore('2')}
              onDecrement={() => decrementScore('2')}
              onTurnSelect={() => {
                if (!player2.isTurn) {
                  setPlayer1({ isTurn: false });
                  setPlayer2({ isTurn: true });
                  resetTimer();
                }
              }}
              idx={1}
            />
          </div>
        </div>
      </motion.div>

      <motion.div 
        key="finish-button"
        initial={{ y: 100, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        exit={{ y: 100, opacity: 0 }}
        transition={{ duration: 0.4, ease: "easeInOut" }}
        className="w-full flex items-center justify-center shrink-0 z-50 mt-4 sm:mt-6 lg:mt-8 mb-6 sm:mb-6 lg:mb-6"
      >
        <motion.button
          onClick={finishMatch}
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
          className="flex items-center justify-center cursor-pointer"
        >
          <img 
            src={finishBattleImg} 
            alt="Finish Battle" 
            className="h-24 sm:h-32 w-auto object-contain"
            referrerPolicy="no-referrer"
          />
        </motion.button>
      </motion.div>
    </motion.div>
  );
};
