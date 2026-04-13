import React from 'react';
import { motion } from 'motion/react';
import { Player } from '../types';
import { ScoreCard } from '../components/ScoreCard';
import { Tooltip } from '../components/Tooltip';
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
  React.useLayoutEffect(() => {
    window.scrollTo(0, 0);
  }, []);

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
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="relative flex flex-col justify-center min-h-0 flex-1"
      >
        <div className="relative flex items-center justify-center w-full">
          {/* Mobile Finish Button: Positioned just below top bar, above player names */}
          <div className="absolute top-0 left-1/2 -translate-x-1/2 z-[60] md:hidden">
            <Tooltip text="Finish & Save Match" position="bottom">
              <motion.button
                onClick={finishMatch}
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                className="flex items-center justify-center cursor-pointer"
              >
                <img 
                  src={finishBattleImg} 
                  alt="Finish Battle" 
                  className="h-8 w-auto object-contain"
                  referrerPolicy="no-referrer"
                />
              </motion.button>
            </Tooltip>
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
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        transition={{ duration: 0.4, ease: "easeInOut" }}
        className="w-full flex items-center justify-center shrink-0 z-50 mt-4 sm:mt-6 lg:mt-8 mb-6 sm:mb-6 lg:mb-6 hidden md:flex"
      >
        <Tooltip text="Finish & Save Match" position="top">
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
        </Tooltip>
      </motion.div>
    </motion.div>
  );
};
