import React from 'react';
import { motion } from 'motion/react';
import { Player } from '../types';
import { ScoreCard } from '../components/ScoreCard';
import { Tooltip } from '../components/Tooltip';
import { FittingText } from '../components/FittingText';
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
  deviceInfo: { isPhone: boolean; isTablet: boolean; isDesktop: boolean; isLandscape: boolean };
  isNavVisible: boolean;
  sharedPlayerFontSize: number;
  setP1FontSize: (size: number) => void;
  setP2FontSize: (size: number) => void;
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
  isNavVisible,
  sharedPlayerFontSize,
  setP1FontSize,
  setP2FontSize
}) => {
  const [t1FontSize, setT1FontSize] = React.useState(180);
  const [t2FontSize, setT2FontSize] = React.useState(180);
  const sharedTeamFontSize = Math.min(t1FontSize, t2FontSize);

  // Reset when names change
  React.useEffect(() => {
    setT1FontSize(180);
    setT2FontSize(180);
  }, [team1Name, team2Name]);

  React.useLayoutEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  const isTwoColumn = !deviceInfo.isPhone || deviceInfo.isLandscape;

  return (
    <motion.div
      key="scoreboard-view"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.4, ease: "easeInOut" }}
      className="flex flex-col items-center justify-center w-full flex-1"
    >
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="relative flex flex-col justify-center min-h-0 flex-1 overflow-hidden"
      >
        <div 
          className="relative flex items-center justify-between w-full h-[var(--skull-height)]"
        >
          {/* Left Region: Centered Team Name */}
          <div className="flex-1 h-full min-w-0 pointer-events-none">
            {team1Name && (
              <motion.div 
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 0.9, x: 0 }}
                className="h-full w-full"
              >
                <FittingText 
                  text={team1Name} 
                  vertical={true}
                  maxFontSize={180}
                  minFontSize={12}
                  className="vertical-text rotate-180 font-gothic font-black uppercase tracking-[0.2em]"
                  style={{ color: player1.highlightColor }}
                  fontSize={sharedTeamFontSize}
                  onFontSizeCalculated={setT1FontSize}
                />
              </motion.div>
            )}
          </div>

          <div 
            className="grid justify-center justify-items-center shrink-0"
            style={{ 
              gridTemplateColumns: 'auto auto',
              gap: '1.5vw',
              maxWidth: '85vw'
            }}
          >
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
              fontSize={sharedPlayerFontSize}
              onFontSizeCalculated={setP1FontSize}
              deviceInfo={deviceInfo}
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
              fontSize={sharedPlayerFontSize}
              onFontSizeCalculated={setP2FontSize}
              deviceInfo={deviceInfo}
            />
          </div>

          {/* Right Region: Centered Team Name */}
          <div className="flex-1 h-full min-w-0 pointer-events-none">
            {team2Name && (
              <motion.div 
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 0.9, x: 0 }}
                className="h-full w-full"
              >
                <FittingText 
                  text={team2Name} 
                  vertical={true}
                  maxFontSize={180}
                  minFontSize={12}
                  className="vertical-text font-gothic font-black uppercase tracking-[0.2em]"
                  style={{ color: player2.highlightColor }}
                  fontSize={sharedTeamFontSize}
                  onFontSizeCalculated={setT2FontSize}
                />
              </motion.div>
            )}
          </div>

          <div 
            className="absolute left-1/2 -translate-x-1/2 z-50 flex items-center justify-center pointer-events-auto"
            style={{ 
              bottom: 'var(--finish-bottom)',
            }}
          >
            <Tooltip text="Finish Match" position="top">
              <motion.button
                onClick={finishMatch}
                whileHover={{ scale: 2.2 }}
                whileTap={{ scale: 1.8 }}
                className="cursor-pointer transition-transform origin-center"
                style={{ scale: 'var(--finish-scale)' }}
              >
                <img 
                  src={finishBattleImg} 
                  alt="Finish Battle" 
                  className="w-[6.6vw] h-auto object-contain drop-shadow-[0_0_15px_rgba(255,0,0,0.5)]"
                  referrerPolicy="no-referrer"
                />
              </motion.button>
            </Tooltip>
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
};
