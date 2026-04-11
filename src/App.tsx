import React, { useState, useEffect, useCallback, useRef, useMemo } from 'react';
import { 
  Trophy, 
  Settings, 
  Timer, 
  RotateCcw, 
  User, 
  Play, 
  Pause, 
  Plus, 
  Minus, 
  Trash2,
  CheckCircle2,
  Circle,
  Palette,
  Maximize,
  Minimize,
  Layout,
  Users,
  Download,
  Upload,
  X,
  PlusCircle,
  History
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { Player, MatchHistoryEntry, AppState } from './types';
import { THEME_COLORS, DEFAULT_P1_COLOR, DEFAULT_P2_COLOR } from './constants';
import { Navigation } from './components/Navigation';
import background from './background.png';
import { ScoreboardView } from './views/ScoreboardView';
import { TeamsView } from './views/TeamsView';
import { SettingsView } from './views/SettingsView';
import { HistoryView } from './views/HistoryView';
import { ConfirmModal } from './components/ConfirmModal';

const SHOT_CLOCK_DEFAULT = 30;

export default function App() {
  // --- State ---
  const [player1, setPlayer1] = useState<Player>({ id: '1', name: '', score: 0, isTurn: true, highlightColor: DEFAULT_P1_COLOR });
  const [player2, setPlayer2] = useState<Player>({ id: '2', name: '', score: 0, isTurn: false, highlightColor: DEFAULT_P2_COLOR });
  const [team1Name, setTeam1Name] = useState<string>('');
  const [team2Name, setTeam2Name] = useState<string>('');
  const [team1Players, setTeam1Players] = useState<string[]>([]);
  const [team2Players, setTeam2Players] = useState<string[]>([]);
  const [matchHistory, setMatchHistory] = useState<MatchHistoryEntry[]>([]);
  const [selectedMatchIndex, setSelectedMatchIndex] = useState<number | null>(null);
  const [view, setView] = useState<'scoreboard' | 'history' | 'settings' | 'teams'>('scoreboard');
  const [isNavVisible, setIsNavVisible] = useState(true);
  const [isKeyboardOpen, setIsKeyboardOpen] = useState(false);
  const navTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  // Robust device detection based on User-Agent and screen width
  const deviceInfo = useMemo(() => {
    const ua = navigator.userAgent.toLowerCase();
    const isTabletUA = ua.includes("ipad") || (ua.includes("android") && !ua.includes("mobile"));
    const isMobileUA = /iphone|ipod|android|iemobile|blackberry|opera mini|palm|windows ce/.test(ua);
    
    // A device is a phone if it's mobile but NOT a tablet, or if the screen is very narrow
    const isPhone = (isMobileUA && !isTabletUA) || window.innerWidth < 768;
    // A device is a tablet if it matches the tablet UA or falls in the tablet width range
    const isTablet = isTabletUA || (window.innerWidth >= 768 && window.innerWidth < 1024);
    const isDesktop = !isPhone && !isTablet;

    return { isPhone, isTablet, isDesktop };
  }, [view]); // Re-evaluate on view change as a proxy for layout shifts, but mostly static

  // Keyboard detection for mobile
  useEffect(() => {
    const handleFocusIn = (e: FocusEvent) => {
      const target = e.target as HTMLElement;
      if (target.tagName === 'INPUT' || target.tagName === 'TEXTAREA') {
        setIsKeyboardOpen(true);
        setIsNavVisible(false);
      }
    };

    const handleFocusOut = () => {
      setIsKeyboardOpen(false);
    };

    window.addEventListener('focusin', handleFocusIn);
    window.addEventListener('focusout', handleFocusOut);

    return () => {
      window.removeEventListener('focusin', handleFocusIn);
      window.removeEventListener('focusout', handleFocusOut);
    };
  }, []);

  // Unified Navigation Logic
  useEffect(() => {
    const { isPhone, isTablet, isDesktop } = deviceInfo;
    
    const startHideTimer = () => {
      if (navTimeoutRef.current) clearTimeout(navTimeoutRef.current);
      // Auto-hide on ALL views for phones when nav is visible
      if (isPhone && isNavVisible && !isKeyboardOpen) {
        navTimeoutRef.current = setTimeout(() => {
          setIsNavVisible(false);
        }, 3000);
      }
    };

    const showNav = () => {
      if (isKeyboardOpen) return;
      setIsNavVisible(true);
      startHideTimer();
    };

    const handleInteraction = (e: Event) => {
      if (isKeyboardOpen) return;
      
      // If nav is already visible, reset the timer on any interaction
      if (isNavVisible) {
        startHideTimer();
      }

      // Specific triggers to SHOW the nav if it's hidden
      if (!isNavVisible && (e.type === 'click' || e.type === 'touchstart' || e.type === 'scroll')) {
        if (e.type === 'click' || e.type === 'touchstart') {
          const clientY = e.type === 'click' 
            ? (e as MouseEvent).clientY 
            : (e as TouchEvent).touches[0].clientY;
          
          // Show if tap in top 8% of screen
          if (clientY <= window.innerHeight * 0.08) {
            showNav();
          }
        }
      }
    };

    let touchStartY = 0;
    const handleTouchStart = (e: TouchEvent) => {
      touchStartY = e.touches[0].clientY;
      handleInteraction(e);
    };

    const handleTouchEnd = (e: TouchEvent) => {
      const touchEndY = e.changedTouches[0].clientY;
      // Swipe down from top area (top 100px) to show nav
      if (touchStartY < 100 && touchEndY > touchStartY + 30) {
        showNav();
      }
    };

    // Initial timer setup
    startHideTimer();

    // Ensure nav is visible on tablet/desktop or non-phone devices
    if (!isNavVisible && !isPhone) {
      setIsNavVisible(true);
    }

    window.addEventListener('click', handleInteraction, { passive: true });
    window.addEventListener('touchstart', handleTouchStart, { passive: true });
    window.addEventListener('touchend', handleTouchEnd, { passive: true });
    window.addEventListener('scroll', handleInteraction, { passive: true });
    
    if (isDesktop) {
      window.addEventListener('mousemove', (e) => {
        if (e.clientY <= window.innerHeight * 0.08) showNav();
        else if (isNavVisible) startHideTimer();
      }, { passive: true });
    }

    return () => {
      window.removeEventListener('click', handleInteraction);
      window.removeEventListener('touchstart', handleTouchStart);
      window.removeEventListener('touchend', handleTouchEnd);
      window.removeEventListener('scroll', handleInteraction);
      if (navTimeoutRef.current) clearTimeout(navTimeoutRef.current);
    };
  }, [isNavVisible, isKeyboardOpen, view, deviceInfo]);
  const [activePicker, setActivePicker] = useState<string | null>(null);
  const [shotClock, setShotClock] = useState(SHOT_CLOCK_DEFAULT);
  const [shotClockDuration, setShotClockDuration] = useState(SHOT_CLOCK_DEFAULT);
  const [isShotClockEnabled, setIsShotClockEnabled] = useState(false);
  const [matchClock, setMatchClock] = useState(600);
  const [matchClockDuration, setMatchClockDuration] = useState(600);
  const [isMatchClockEnabled, setIsMatchClockEnabled] = useState(false);
  const [isTimerRunning, setIsTimerRunning] = useState(false);
  const [isEditingNames, setIsEditingNames] = useState(false);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [showClearTeamsConfirm, setShowClearTeamsConfirm] = useState(false);
  const [showClearHistoryConfirm, setShowClearHistoryConfirm] = useState(false);
  const [showTeamTotals, setShowTeamTotals] = useState(false);
  const [showRestoreDefaultsConfirm, setShowRestoreDefaultsConfirm] = useState(false);
  const [playerPreferences, setPlayerPreferences] = useState<Record<string, string>>({});
  const [isInitialized, setIsInitialized] = useState(false);

  // --- Refs ---
  const timerRef = useRef<NodeJS.Timeout | null>(null);

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const getMatchResult = (p1: string, p2: string) => {
    if (!p1 || !p2) return null;
    return matchHistory.find(m => 
      (m.player1 === p1 && m.player2 === p2) || 
      (m.player1 === p2 && m.player2 === p1)
    );
  };

  const teamTotals = useMemo(() => {
    let t1 = 0;
    let t2 = 0;
    const maxMatches = Math.max(team1Players.length, team2Players.length);
    
    for (let i = 0; i < maxMatches; i++) {
      const p1Name = team1Players[i] || '';
      const p2Name = team2Players[i] || '';
      
      if (selectedMatchIndex === i) {
        t1 += player1.score;
        t2 += player2.score;
      } else {
        const match = getMatchResult(p1Name, p2Name);
        if (match) {
          if (match.player1 === p1Name) {
            t1 += match.score1;
            t2 += match.score2;
          } else {
            t1 += match.score2;
            t2 += match.score1;
          }
        }
      }
    }
    return { t1, t2 };
  }, [team1Players, team2Players, matchHistory, selectedMatchIndex, player1.score, player2.score, getMatchResult]);

  // --- Initialization ---
  useEffect(() => {
    try {
      const savedData = localStorage.getItem('pool_app_data');
      if (savedData) {
        const data: AppState = JSON.parse(savedData);
        
        // Player Preferences - Load first to ensure sync works
        if (data.playerPreferences) setPlayerPreferences(data.playerPreferences);

        // Settings
        if (data.settings) {
          if (data.settings.player1) {
            setPlayer1(data.settings.player1);
          }
          if (data.settings.player2) {
            setPlayer2(data.settings.player2);
          }
          if (data.settings.shotClockDuration !== undefined) setShotClockDuration(data.settings.shotClockDuration);
          if (data.settings.isShotClockEnabled !== undefined) setIsShotClockEnabled(data.settings.isShotClockEnabled);
          if (data.settings.matchClockDuration !== undefined) setMatchClockDuration(data.settings.matchClockDuration);
          if (data.settings.isMatchClockEnabled !== undefined) setIsMatchClockEnabled(data.settings.isMatchClockEnabled);
        }

        // Teams
        if (data.teams) {
          setTeam1Name(data.teams.team1Name || '');
          setTeam2Name(data.teams.team2Name || '');
          setTeam1Players(data.teams.team1Players || []);
          setTeam2Players(data.teams.team2Players || []);
          setSelectedMatchIndex(data.teams.selectedMatchIndex ?? null);
        }

        // History
        if (data.history) setMatchHistory(data.history);
      }
      setIsInitialized(true);
    } catch (error) {
      console.error('Failed to load data from localStorage:', error);
      setIsInitialized(true);
    }
  }, []);

  // --- Persistence ---
  useEffect(() => {
    if (!isInitialized) return;

    const appData: AppState = {
      settings: {
        player1,
        player2,
        shotClockDuration,
        isShotClockEnabled,
        matchClockDuration,
        isMatchClockEnabled,
      },
      teams: {
        team1Name,
        team2Name,
        team1Players,
        team2Players,
        selectedMatchIndex,
        totals: teamTotals,
      },
      playerPreferences,
      history: matchHistory,
      lastUpdated: new Date().toISOString(),
    };
    localStorage.setItem('pool_app_data', JSON.stringify(appData));
  }, [
    player1, player2, 
    shotClockDuration, isShotClockEnabled, 
    matchClockDuration, isMatchClockEnabled,
    team1Name, team2Name, team1Players, team2Players, selectedMatchIndex,
    matchHistory, teamTotals, playerPreferences, isInitialized
  ]);

  // --- Player State Helpers ---
  const updatePlayer1 = useCallback((updates: Partial<Player>) => {
    setPlayer1(prev => {
      const next = { ...prev, ...updates };
      
      // If name or color changed, update preferences
      const trimmedName = next.name.trim();
      if (trimmedName && (updates.name !== undefined || updates.highlightColor !== undefined)) {
        setPlayerPreferences(prefs => ({
          ...prefs,
          [trimmedName]: next.highlightColor
        }));
      }
      
      return next;
    });
  }, []);

  const updatePlayer2 = useCallback((updates: Partial<Player>) => {
    setPlayer2(prev => {
      const next = { ...prev, ...updates };
      
      // If name or color changed, update preferences
      const trimmedName = next.name.trim();
      if (trimmedName && (updates.name !== undefined || updates.highlightColor !== undefined)) {
        setPlayerPreferences(prefs => ({
          ...prefs,
          [trimmedName]: next.highlightColor
        }));
      }
      
      return next;
    });
  }, []);

  // Sync color when name changes (only when name changes to avoid loops)
  useEffect(() => {
    const name = player1.name.trim();
    if (name && playerPreferences[name]) {
      if (player1.highlightColor !== playerPreferences[name]) {
        setPlayer1(prev => ({ ...prev, highlightColor: playerPreferences[name] }));
      }
    }
  }, [player1.name]); // Only depend on name

  useEffect(() => {
    const name = player2.name.trim();
    if (name && playerPreferences[name]) {
      if (player2.highlightColor !== playerPreferences[name]) {
        setPlayer2(prev => ({ ...prev, highlightColor: playerPreferences[name] }));
      }
    }
  }, [player2.name]); // Only depend on name

  // --- Timer Logic ---
  const startTimer = useCallback(() => {
    if (timerRef.current) clearInterval(timerRef.current);
    setIsTimerRunning(true);
    timerRef.current = setInterval(() => {
      if (isShotClockEnabled) {
        setShotClock((prev) => Math.max(0, prev - 1));
      }
      if (isMatchClockEnabled) {
        setMatchClock((prev) => Math.max(0, prev - 1));
      }
    }, 1000);
  }, [isShotClockEnabled, isMatchClockEnabled]);

  const pauseTimer = useCallback(() => {
    setIsTimerRunning(false);
    if (timerRef.current) clearInterval(timerRef.current);
  }, []);

  useEffect(() => {
    if (isTimerRunning) {
      const shotClockFinished = isShotClockEnabled && shotClock === 0;
      const matchClockFinished = isMatchClockEnabled && matchClock === 0;
      
      if (shotClockFinished || matchClockFinished) {
        pauseTimer();
      }
    }
  }, [shotClock, matchClock, isTimerRunning, isShotClockEnabled, isMatchClockEnabled, pauseTimer]);

  const resetTimer = useCallback(() => {
    setShotClock(shotClockDuration);
    if (isTimerRunning && (isShotClockEnabled || isMatchClockEnabled)) startTimer();
  }, [isTimerRunning, startTimer, shotClockDuration, isShotClockEnabled, isMatchClockEnabled]);

  const resetMatchClock = useCallback(() => {
    setMatchClock(matchClockDuration);
  }, [matchClockDuration]);

  // --- Game Actions ---
  const updateMatchHistoryRealtime = useCallback((p1: Player, p2: Player) => {
    if (selectedMatchIndex === null) return;
    if (!p1.name && !p2.name) return;

    setMatchHistory(prev => {
      const winner = p1.score > p2.score ? p1.name : p2.name;
      const existingIndex = prev.findIndex(m => 
        (m.player1 === p1.name && m.player2 === p2.name) || 
        (m.player1 === p2.name && m.player2 === p1.name)
      );

      const newEntry: MatchHistoryEntry = {
        id: existingIndex !== -1 ? prev[existingIndex].id : Date.now().toString(),
        date: existingIndex !== -1 ? prev[existingIndex].date : new Date().toISOString(),
        player1: p1.name,
        player2: p2.name,
        team1: team1Name || undefined,
        team2: team2Name || undefined,
        score1: p1.score,
        score2: p2.score,
        winner,
        shotClockSetting: isShotClockEnabled ? shotClockDuration : undefined,
        matchClockRemaining: isMatchClockEnabled ? matchClock : undefined
      };

      let updated;
      if (existingIndex !== -1) {
        updated = [...prev];
        updated[existingIndex] = newEntry;
      } else {
        updated = [newEntry, ...prev];
      }
      localStorage.setItem('pool_match_history', JSON.stringify(updated));
      return updated;
    });
  }, [selectedMatchIndex, team1Name, team2Name, isShotClockEnabled, shotClockDuration, isMatchClockEnabled, matchClock]);

  const incrementScore = (playerId: string) => {
    if (playerId === '1') {
      setPlayer1(prev => {
        const next = { ...prev, score: prev.score + 1 };
        updateMatchHistoryRealtime(next, player2);
        return next;
      });
    } else {
      setPlayer2(prev => {
        const next = { ...prev, score: prev.score + 1 };
        updateMatchHistoryRealtime(player1, next);
        return next;
      });
    }
    resetTimer();
  };

  const decrementScore = (playerId: string) => {
    if (playerId === '1') {
      setPlayer1(prev => {
        const next = { ...prev, score: Math.max(0, prev.score - 1) };
        updateMatchHistoryRealtime(next, player2);
        return next;
      });
    } else {
      setPlayer2(prev => {
        const next = { ...prev, score: Math.max(0, prev.score - 1) };
        updateMatchHistoryRealtime(player1, next);
        return next;
      });
    }
  };

  const finishMatch = () => {
    // Final sync before moving on
    updateMatchHistoryRealtime(player1, player2);
    
    // Move to next matchup if available
    if (selectedMatchIndex !== null) {
      const nextIndex = selectedMatchIndex + 1;
      const maxMatches = Math.max(team1Players.length, team2Players.length);
      
      if (nextIndex < maxMatches) {
        selectTeamMatch(nextIndex);
      } else {
        // Show team totals if it was the last match
        setShowTeamTotals(true);
        
        // Reset game if no more matches
        setPlayer1(prev => ({ ...prev, score: 0 }));
        setPlayer2(prev => ({ ...prev, score: 0 }));
        setSelectedMatchIndex(null);
        resetTimer();
      }
    } else {
      // Reset game for non-team matches
      setPlayer1(prev => ({ ...prev, score: 0 }));
      setPlayer2(prev => ({ ...prev, score: 0 }));
      resetTimer();
    }
  };

  const clearMatchResult = (p1: string, p2: string) => {
    const updatedHistory = matchHistory.filter(m => 
      !((m.player1 === p1 && m.player2 === p2) || (m.player1 === p2 && m.player2 === p1))
    );
    setMatchHistory(updatedHistory);
    localStorage.setItem('pool_match_history', JSON.stringify(updatedHistory));
  };

  const selectTeamMatch = (index: number) => {
    const p1Name = team1Players[index] || '';
    const p2Name = team2Players[index] || '';
    
    // Load existing score if available
    const existingMatch = matchHistory.find(m => 
      (m.player1 === p1Name && m.player2 === p2Name) || 
      (m.player1 === p2Name && m.player2 === p1Name)
    );

    const s1 = existingMatch ? (existingMatch.player1 === p1Name ? existingMatch.score1 : existingMatch.score2) : 0;
    const s2 = existingMatch ? (existingMatch.player1 === p2Name ? existingMatch.score1 : existingMatch.score2) : 0;

    const c1 = playerPreferences[p1Name.trim()] || DEFAULT_P1_COLOR;
    const c2 = playerPreferences[p2Name.trim()] || DEFAULT_P2_COLOR;

    setPlayer1(prev => ({ ...prev, name: p1Name, score: s1, highlightColor: c1 }));
    setPlayer2(prev => ({ ...prev, name: p2Name, score: s2, highlightColor: c2 }));
    
    if (existingMatch && existingMatch.matchClockRemaining !== undefined) {
      setMatchClock(existingMatch.matchClockRemaining);
    } else {
      resetMatchClock();
    }

    setSelectedMatchIndex(index);
    setView('scoreboard');
    resetTimer();
  };

  const navigateToScoreboard = () => {
    const maxMatches = Math.max(team1Players.length, team2Players.length);
    
    // If we already have a selected match, just go to it
    if (selectedMatchIndex !== null) {
      setView('scoreboard');
      return;
    }

    if (maxMatches > 0) {
      // Find the first match with no data
      let firstUnplayedIndex = -1;
      for (let i = 0; i < maxMatches; i++) {
        const p1Name = team1Players[i] || '';
        const p2Name = team2Players[i] || '';
        if (!getMatchResult(p1Name, p2Name)) {
          firstUnplayedIndex = i;
          break;
        }
      }
      
      // If all matches have data, just select the first one (top row)
      const indexToSelect = firstUnplayedIndex !== -1 ? firstUnplayedIndex : 0;
      selectTeamMatch(indexToSelect);
    } else {
      setView('scoreboard');
    }
  };

  const clearTeams = () => {
    setTeam1Name('');
    setTeam2Name('');
    setTeam1Players([]);
    setTeam2Players([]);
    setPlayer1(prev => ({ ...prev, name: '', score: 0 }));
    setPlayer2(prev => ({ ...prev, name: '', score: 0 }));
    setSelectedMatchIndex(null);
    localStorage.removeItem('pool_team1_name');
    localStorage.removeItem('pool_team2_name');
    localStorage.removeItem('pool_team1_players');
    localStorage.removeItem('pool_team2_players');
    setShowClearTeamsConfirm(false);
  };

  const updateTeamData = (
    t1Name: string, 
    t1Players: string[], 
    t2Name: string, 
    t2Players: string[]
  ) => {
    setTeam1Name(t1Name);
    setTeam1Players(t1Players);
    setTeam2Name(t2Name);
    setTeam2Players(t2Players);
    
    localStorage.setItem('pool_team1_name', t1Name);
    localStorage.setItem('pool_team2_name', t2Name);
    localStorage.setItem('pool_team1_players', JSON.stringify(t1Players));
    localStorage.setItem('pool_team2_players', JSON.stringify(t2Players));
  };

  const parseTime = (timeStr: string) => {
    if (!timeStr || timeStr === 'OFF') return undefined;
    const parts = timeStr.split(':');
    if (parts.length === 2) {
      return parseInt(parts[0]) * 60 + parseInt(parts[1]);
    }
    return parseInt(timeStr);
  };

  const downloadData = () => {
    if (matchHistory.length === 0 && team1Players.length === 0 && team2Players.length === 0) {
      alert('No data to export.');
      return;
    }

    // Comprehensive CSV Export
    let csvContent = '\uFEFF'; // UTF-8 BOM
    
    // Section 1: Team Setup
    csvContent += 'SECTION: TEAM SETUP\n';
    csvContent += 'Team,Player Name,Highlight Color\n';
    team1Players.forEach(p => {
      const color = playerPreferences[p.trim()] || DEFAULT_P1_COLOR;
      csvContent += `"${team1Name}","${p}","${color}"\n`;
    });
    team2Players.forEach(p => {
      const color = playerPreferences[p.trim()] || DEFAULT_P2_COLOR;
      csvContent += `"${team2Name}","${p}","${color}"\n`;
    });
    csvContent += '\n';

    // Section 2: Match History
    csvContent += 'SECTION: MATCH HISTORY\n';
    const headers = ['Date', 'Team 1', 'Player 1', 'Score 1', 'Team 2', 'Player 2', 'Score 2', 'Winner', 'Shot Clock Setting', 'Match Clock Remaining'];
    csvContent += headers.join(',') + '\n';
    
    matchHistory.forEach(entry => {
      const row = [
        new Date(entry.date).toLocaleString('en-GB'),
        entry.team1 || 'N/A',
        entry.player1,
        entry.score1,
        entry.team2 || 'N/A',
        entry.player2,
        entry.score2,
        entry.winner,
        entry.shotClockSetting ? `${entry.shotClockSetting}s` : 'OFF',
        entry.matchClockRemaining !== undefined ? formatTime(entry.matchClockRemaining) : 'OFF'
      ];
      csvContent += row.map(val => `"${val}"`).join(',') + '\n';
    });

    // Section 3: Team Totals
    csvContent += '\nSECTION: TEAM TOTALS\n';
    csvContent += `Team,Total Score\n`;
    csvContent += `"${team1Name}","${teamTotals.t1}"\n`;
    csvContent += `"${team2Name}","${teamTotals.t2}"\n`;

    // Section 4: Settings
    csvContent += '\nSECTION: SETTINGS\n';
    csvContent += `Setting,Value\n`;
    csvContent += `Shot Clock Enabled,"${isShotClockEnabled}"\n`;
    csvContent += `Shot Clock Duration,"${shotClockDuration}s"\n`;
    csvContent += `Match Clock Enabled,"${isMatchClockEnabled}"\n`;
    csvContent += `Match Clock Duration,"${formatTime(matchClockDuration)}"\n`;
    csvContent += `Player 1 Highlight Color,"${player1.highlightColor}"\n`;
    csvContent += `Player 2 Highlight Color,"${player2.highlightColor}"\n`;
    csvContent += `Selected Match Index,"${selectedMatchIndex !== null ? selectedMatchIndex : 'NONE'}"\n`;

    // Section 5: Player Preferences
    csvContent += '\nSECTION: PLAYER PREFERENCES\n';
    csvContent += `Player Name,Highlight Color\n`;
    Object.entries(playerPreferences).forEach(([name, color]) => {
      csvContent += `"${name}","${color}"\n`;
    });

    const now = new Date();
    const ukDate = `${String(now.getDate()).padStart(2, '0')}-${String(now.getMonth() + 1).padStart(2, '0')}-${now.getFullYear()}`;
    const fileName = `${(team1Name || 'TEAM1').replace(/\s+/g, '_')}_V_${(team2Name || 'TEAM2').replace(/\s+/g, '_')}_${ukDate}.csv`;

    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.setAttribute('href', url);
    link.setAttribute('download', fileName);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  const downloadJSON = () => {
    const appData: AppState = {
      settings: {
        player1,
        player2,
        shotClockDuration,
        isShotClockEnabled,
        matchClockDuration,
        isMatchClockEnabled,
      },
      teams: {
        team1Name,
        team2Name,
        team1Players,
        team2Players,
        selectedMatchIndex,
        totals: teamTotals,
      },
      playerPreferences,
      history: matchHistory,
      lastUpdated: new Date().toISOString(),
    };

    const blob = new Blob([JSON.stringify(appData, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const now = new Date();
    const ukDate = `${String(now.getDate()).padStart(2, '0')}-${String(now.getMonth() + 1).padStart(2, '0')}-${now.getFullYear()}`;
    const fileName = `POOL_DATA_${ukDate}.json`;
    
    const link = document.createElement('a');
    link.setAttribute('href', url);
    link.setAttribute('download', fileName);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  const uploadData = () => {
    const input = document.createElement('input');
    input.type = 'file';
    input.accept = '.csv,.json';
    input.onchange = (e: any) => {
      const file = e.target.files[0];
      if (!file) return;

      const reader = new FileReader();
      reader.onload = (event) => {
        const content = event.target?.result as string;
        if (!content) return;

        if (file.name.endsWith('.json')) {
          try {
            const data: AppState = JSON.parse(content);
            if (data.settings) {
              setPlayer1(data.settings.player1);
              setPlayer2(data.settings.player2);
              setShotClockDuration(data.settings.shotClockDuration);
              setIsShotClockEnabled(data.settings.isShotClockEnabled);
              setMatchClockDuration(data.settings.matchClockDuration);
              setIsMatchClockEnabled(data.settings.isMatchClockEnabled);
            }
            if (data.teams) {
              setTeam1Name(data.teams.team1Name);
              setTeam2Name(data.teams.team2Name);
              setTeam1Players(data.teams.team1Players);
              setTeam2Players(data.teams.team2Players);
              setSelectedMatchIndex(data.teams.selectedMatchIndex);
            }
            if (data.history) {
              setMatchHistory(data.history);
            }
            if (data.playerPreferences) {
              setPlayerPreferences(data.playerPreferences);
            }
            alert('Data loaded successfully from JSON!');
          } catch (error) {
            console.error('Failed to parse JSON:', error);
            alert('Invalid JSON file.');
          }
          return;
        }

        try {
          const lines = content.split('\n').map(l => l.trim()).filter(l => l);
          if (lines.length < 2) return;

          const parseCSVLine = (line: string) => {
            const values: string[] = [];
            let current = '';
            let inQuotes = false;
            for (let i = 0; i < line.length; i++) {
              const char = line[i];
              if (char === '"') {
                inQuotes = !inQuotes;
              } else if (char === ',' && !inQuotes) {
                values.push(current.trim());
                current = '';
              } else {
                current += char;
              }
            }
            values.push(current.trim());
            return values;
          };

          // Check if it's a multi-section CSV or a simple one
          const hasSections = lines.some(l => l.startsWith('SECTION:'));
          
          if (hasSections) {
            let currentSection = '';
            const t1Players: string[] = [];
            const t2Players: string[] = [];
            let t1Name = 'TEAM 1';
            let t2Name = 'TEAM 2';
            const history: MatchHistoryEntry[] = [];
            const prefs: Record<string, string> = {};
            let headers: string[] = [];

            lines.forEach(line => {
              if (line.startsWith('SECTION:')) {
                currentSection = line.replace('SECTION:', '').trim();
                headers = [];
                return;
              }

              const values = parseCSVLine(line);
              if (headers.length === 0) {
                headers = values;
                return;
              }

              if (currentSection === 'TEAM SETUP') {
                const team = values[0];
                const player = values[1];
                const color = values[2];
                if (team && player) {
                  if (t1Players.length === 0) {
                    t1Name = team;
                    t1Players.push(player);
                  } else if (team === t1Name) {
                    t1Players.push(player);
                  } else {
                    t2Name = team;
                    t2Players.push(player);
                  }
                  if (color) prefs[player.trim()] = color;
                }
              } else if (currentSection === 'MATCH HISTORY') {
                const entry: any = {};
                headers.forEach((h, i) => {
                  entry[h] = values[i];
                });

                let date = new Date().toISOString();
                if (entry['Date']) {
                  const d = new Date(entry['Date']);
                  if (!isNaN(d.getTime())) date = d.toISOString();
                }

                history.push({
                  id: `imported-${history.length}-${Date.now()}`,
                  date: date,
                  team1: entry['Team 1'],
                  player1: entry['Player 1'],
                  score1: parseInt(entry['Score 1']) || 0,
                  team2: entry['Team 2'],
                  player2: entry['Player 2'],
                  score2: parseInt(entry['Score 2']) || 0,
                  winner: entry['Winner'],
                  shotClockSetting: entry['Shot Clock Setting'] && entry['Shot Clock Setting'] !== 'OFF' ? parseInt(entry['Shot Clock Setting'].replace('s', '')) : undefined,
                  matchClockRemaining: entry['Match Clock Remaining'] && entry['Match Clock Remaining'] !== 'OFF' ? parseTime(entry['Match Clock Remaining']) : undefined
                });
              } else if (currentSection === 'PLAYER PREFERENCES') {
                const player = values[0];
                const color = values[1];
                if (player && color) prefs[player.trim()] = color;
              } else if (currentSection === 'SETTINGS') {
                const setting = values[0];
                const value = values[1];
                if (setting === 'Shot Clock Enabled') setIsShotClockEnabled(value === 'true');
                if (setting === 'Shot Clock Duration') setShotClockDuration(parseInt(value.replace('s', '')) || 30);
                if (setting === 'Match Clock Enabled') setIsMatchClockEnabled(value === 'true');
                if (setting === 'Match Clock Duration') setMatchClockDuration(parseTime(value) || 600);
                if (setting === 'Selected Match Index') setSelectedMatchIndex(value === 'NONE' ? null : parseInt(value));
              }
            });

            updateTeamData(t1Name, t1Players, t2Name, t2Players);
            setMatchHistory(history);
            setPlayerPreferences(prev => ({ ...prev, ...prefs }));
            alert('Data loaded successfully from CSV!');
            return;
          }

          // Fallback for simple CSVs (no sections)
          const headers = parseCSVLine(lines[0]);
          
          if (headers[0] === 'Team' && headers[1] === 'Player Name') {
            const t1Players: string[] = [];
            const t2Players: string[] = [];
            let t1Name = 'TEAM 1';
            let t2Name = 'TEAM 2';

            lines.slice(1).forEach(line => {
              const values = parseCSVLine(line);
              const team = values[0];
              const player = values[1];
              if (team && player) {
                if (t1Players.length === 0) {
                  t1Name = team;
                  t1Players.push(player);
                } else if (team === t1Name) {
                  t1Players.push(player);
                } else {
                  t2Name = team;
                  t2Players.push(player);
                }
              }
            });
            
            updateTeamData(t1Name, t1Players, t2Name, t2Players);
            setMatchHistory([]);
            setSelectedMatchIndex(null);
            alert('Teams loaded successfully!');
          } else if (headers.includes('Team 1') && headers.includes('Player 1')) {
            const history: MatchHistoryEntry[] = [];
            const t1PlayersSet = new Set<string>();
            const t2PlayersSet = new Set<string>();
            let t1Name = 'TEAM 1';
            let t2Name = 'TEAM 2';

            lines.slice(1).forEach((line, idx) => {
              const values = parseCSVLine(line);
              const entry: any = {};
              headers.forEach((h, i) => {
                entry[h] = values[i];
              });

              if (idx === 0) {
                t1Name = entry['Team 1'];
                t2Name = entry['Team 2'];
              }

              if (entry['Player 1']) t1PlayersSet.add(entry['Player 1']);
              if (entry['Player 2']) t2PlayersSet.add(entry['Player 2']);

              let date = new Date().toISOString();
              if (entry['Date']) {
                const d = new Date(entry['Date']);
                if (!isNaN(d.getTime())) {
                  date = d.toISOString();
                }
              }

              history.push({
                id: `imported-${idx}-${Date.now()}`,
                date: date,
                team1: entry['Team 1'],
                player1: entry['Player 1'],
                score1: parseInt(entry['Score 1']) || 0,
                team2: entry['Team 2'],
                player2: entry['Player 2'],
                score2: parseInt(entry['Score 2']) || 0,
                winner: entry['Winner'],
                shotClockSetting: entry['Shot Clock Setting'] && entry['Shot Clock Setting'] !== 'OFF' ? parseInt(entry['Shot Clock Setting'].replace('s', '')) : undefined,
                matchClockRemaining: entry['Match Clock Remaining'] && entry['Match Clock Remaining'] !== 'OFF' ? parseTime(entry['Match Clock Remaining']) : undefined
              });
            });

            setMatchHistory(history);
            updateTeamData(t1Name, Array.from(t1PlayersSet), t2Name, Array.from(t2PlayersSet));
            setSelectedMatchIndex(null);
            alert('Match history and teams loaded successfully!');
          } else {
            alert('Unrecognized CSV format. Please use a file exported from this app.');
          }
        } catch (err) {
          console.error('Error parsing CSV:', err);
          alert('Failed to parse CSV file. Please ensure it is in the correct format.');
        }
      };
      reader.readAsText(file);
    };
    input.click();
  };

  const clearHistory = () => {
    setMatchHistory([]);
    localStorage.removeItem('pool_match_history');
  };

  const toggleFullscreen = () => {
    if (!document.fullscreenElement) {
      document.documentElement.requestFullscreen().catch((err) => {
        console.error(`Error attempting to enable full-screen mode: ${err.message}`);
      });
      setIsFullscreen(true);
    } else {
      if (document.exitFullscreen) {
        document.exitFullscreen();
        setIsFullscreen(false);
      }
    }
  };

  useEffect(() => {
    const handleFullscreenChange = () => {
      setIsFullscreen(!!document.fullscreenElement);
    };
    document.addEventListener('fullscreenchange', handleFullscreenChange);
    return () => document.removeEventListener('fullscreenchange', handleFullscreenChange);
  }, []);

  return (
    <div className="relative min-h-screen text-slate-100 font-sans selection:bg-emerald-500/30 overflow-x-hidden bg-transparent">
      {/* Backdrop Image Layer (User's Fire Frame) */}
      <img 
        src={background}
        className="fixed inset-0 w-full h-full object-cover pointer-events-none"
        style={{ zIndex: 0 }}
        alt=""
      />

      <div className="relative z-10">
        {/* SVG Gradient Definitions & Filters */}
        <svg width="0" height="0" className="absolute pointer-events-none">
          <defs>
            <linearGradient id="cup-gradient" x1="0%" y1="0%" x2="0%" y2="100%">
              <stop offset="0%" stopColor={player1.highlightColor} />
              <stop offset="100%" stopColor={player2.highlightColor} />
            </linearGradient>
          </defs>
        </svg>

        <Navigation 
          view={view}
          setView={setView}
          player1={player1}
          player2={player2}
          isFullscreen={isFullscreen}
          toggleFullscreen={toggleFullscreen}
          isNavVisible={isNavVisible}
          isKeyboardOpen={isKeyboardOpen}
          deviceInfo={deviceInfo}
          navigateToScoreboard={navigateToScoreboard}
        />

        <motion.main 
          initial={false}
          animate={{ 
            paddingTop: (view === 'teams' || view === 'settings')
              ? `calc(${deviceInfo.isPhone ? '56px' : '80px'} + 8vh)`
              : (view === 'scoreboard' 
                  ? (!deviceInfo.isDesktop ? (deviceInfo.isPhone ? 56 : 80) : 16) 
                  : 0),
            y: (deviceInfo.isPhone && !isNavVisible && view === 'scoreboard') ? -54 : 0,
            paddingBottom: 0 
          }}
          transition={{ duration: 0.4, ease: "easeInOut" }}
          className={`relative z-10 min-h-[100dvh] flex flex-col ${view === 'scoreboard' ? 'justify-start sm:justify-center sm:gap-4 lg:gap-6' : 'justify-start pb-24'} px-4 sm:px-6 mx-auto w-full responsive-zoom`}
          style={{ maxWidth: view === 'scoreboard' ? 'var(--gameplay-width)' : 'min(90vw, 985px)' }}
        >
        <AnimatePresence mode="wait">
          {view === 'scoreboard' && (
            <ScoreboardView 
              player1={player1}
              player2={player2}
              team1Name={team1Name}
              team2Name={team2Name}
              isShotClockEnabled={isShotClockEnabled}
              isMatchClockEnabled={isMatchClockEnabled}
              shotClock={shotClock}
              matchClock={matchClock}
              isTimerRunning={isTimerRunning}
              isEditingNames={isEditingNames}
              onToggleTimer={isTimerRunning ? pauseTimer : startTimer}
              onResetTimer={resetTimer}
              onResetMatchClock={resetMatchClock}
              formatTime={formatTime}
              incrementScore={incrementScore}
              decrementScore={decrementScore}
              setPlayer1={updatePlayer1}
              setPlayer2={updatePlayer2}
              resetTimer={resetTimer}
              finishMatch={finishMatch}
              deviceInfo={deviceInfo}
              isNavVisible={isNavVisible}
            />
          )}

          {view === 'teams' && (
            <TeamsView 
              player1={player1}
              player2={player2}
              team1Name={team1Name}
              team2Name={team2Name}
              team1Players={team1Players}
              team2Players={team2Players}
              matchHistory={matchHistory}
              selectedMatchIndex={selectedMatchIndex}
              teamTotals={teamTotals}
              updateTeamData={updateTeamData}
              downloadData={downloadData}
              downloadJSON={downloadJSON}
              uploadData={uploadData}
              setShowClearTeamsConfirm={setShowClearTeamsConfirm}
              selectTeamMatch={selectTeamMatch}
              getMatchResult={getMatchResult}
              clearMatchResult={clearMatchResult}
              formatTime={formatTime}
            />
          )}

          {view === 'settings' && (
            <SettingsView 
              player1={player1}
              player2={player2}
              setPlayer1={updatePlayer1}
              setPlayer2={updatePlayer2}
              activePicker={activePicker}
              setActivePicker={setActivePicker}
              isMatchClockEnabled={isMatchClockEnabled}
              setIsMatchClockEnabled={setIsMatchClockEnabled}
              matchClockDuration={matchClockDuration}
              setMatchClockDuration={setMatchClockDuration}
              setMatchClock={setMatchClock}
              resetMatchClock={resetMatchClock}
              isShotClockEnabled={isShotClockEnabled}
              setIsShotClockEnabled={setIsShotClockEnabled}
              shotClockDuration={shotClockDuration}
              setShotClockDuration={setShotClockDuration}
              setShotClock={setShotClock}
              pauseTimer={pauseTimer}
              setShowRestoreDefaultsConfirm={setShowRestoreDefaultsConfirm}
            />
          )}
        </AnimatePresence>

        {/* Global Modals */}
        <ConfirmModal 
          isOpen={showClearTeamsConfirm}
          onClose={() => setShowClearTeamsConfirm(false)}
          onConfirm={clearTeams}
          title="Clear All Team Data?"
          message="This will permanently delete team names and all player lists. This action cannot be undone."
          confirmText="Clear All"
          type="danger"
          themeColor={player1.highlightColor}
        />
 
        <ConfirmModal 
          isOpen={showRestoreDefaultsConfirm}
          onClose={() => setShowRestoreDefaultsConfirm(false)}
          onConfirm={() => {
            updatePlayer1({ highlightColor: DEFAULT_P1_COLOR });
            updatePlayer2({ highlightColor: DEFAULT_P2_COLOR });
            setShowRestoreDefaultsConfirm(false);
          }}
          title="Restore Defaults?"
          message="This will reset all player colors to their original defaults. Your scores and history will not be affected."
          confirmText="Restore"
          type="info"
          themeColor={player1.highlightColor}
        />
 
        <ConfirmModal 
          isOpen={showClearHistoryConfirm}
          onClose={() => setShowClearHistoryConfirm(false)}
          onConfirm={() => {
            clearHistory();
            setShowClearHistoryConfirm(false);
          }}
          title="Clear Match History?"
          message="This will permanently delete all saved match results. This action cannot be undone."
          confirmText="Clear All"
          type="danger"
          themeColor={player1.highlightColor}
        />
          {showTeamTotals && (
            <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/90 backdrop-blur-md">
              <motion.div 
                initial={{ scale: 0.8, opacity: 0, y: 20 }}
                animate={{ scale: 1, opacity: 1, y: 0 }}
                exit={{ scale: 0.8, opacity: 0, y: 20 }}
                className="bg-black border-2 p-10 rounded-[40px] max-w-2xl w-full space-y-10 text-center"
                style={{ 
                  borderImage: `linear-gradient(to right, ${player1.highlightColor} 50%, ${player2.highlightColor} 50%) 1`,
                  boxShadow: `0 0 50px ${player1.highlightColor}11`
                }}
              >
                <div className="space-y-2">
                  <div className="flex justify-center">
                    <div className="p-4 rounded-full" style={{ backgroundColor: `${player1.highlightColor}11` }}>
                      <Trophy className="w-12 h-12" style={{ color: player1.highlightColor }} />
                    </div>
                  </div>
                  <h2 className="text-5xl font-black uppercase tracking-tighter text-white">Team Totals</h2>
                  <p className="text-slate-500 font-bold uppercase tracking-widest text-xs">Final Session Results</p>
                </div>
 
                <div className="grid grid-cols-2 gap-8 items-center">
                  <div className="space-y-4">
                    <p className="text-xl font-black uppercase tracking-tight truncate" style={{ color: player1.highlightColor }}>{team1Name}</p>
                    <p className="text-8xl font-black text-white tabular-nums">
                      {teamTotals.t1}
                    </p>
                  </div>
                  <div className="space-y-4">
                    <p className="text-xl font-black uppercase tracking-tight truncate" style={{ color: player2.highlightColor }}>{team2Name}</p>
                    <p className="text-8xl font-black text-white tabular-nums">
                      {teamTotals.t2}
                    </p>
                  </div>
                </div>
 
                <button 
                  onClick={() => {
                    setShowTeamTotals(false);
                    setView('teams');
                  }}
                  className="w-full h-20 text-slate-950 rounded-3xl font-black text-2xl uppercase tracking-widest transition-all active:scale-95"
                  style={{ 
                    backgroundImage: `linear-gradient(to right, ${player1.highlightColor}, ${player2.highlightColor})`,
                    boxShadow: `0 10px 20px ${player1.highlightColor}33`
                  }}
                >
                  Close Results
                </button>
              </motion.div>
            </div>
          )}
      </motion.main>

      {/* Navigation Bar Spacing for history view */}
      {view !== 'scoreboard' && <div className="h-16 lg:h-32" />}

      {/* Quick Actions Floating Bar (Mobile) */}
      <AnimatePresence>
        {view !== 'scoreboard' && (
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 20 }}
            className="fixed bottom-6 left-1/2 -translate-x-1/2 flex items-center gap-2 bg-black/90 backdrop-blur-xl border-2 p-2 rounded-2xl shadow-2xl md:hidden z-50 bar-zoom"
            style={{ borderImage: `linear-gradient(to right, ${player1.highlightColor} 50%, ${player2.highlightColor} 50%) 1` }}
          >
            <button 
              onClick={navigateToScoreboard}
              className={`px-4 py-2 rounded-xl text-sm font-bold transition-all ${view === 'scoreboard' ? 'text-slate-950' : 'text-slate-400'}`}
              style={view === 'scoreboard' ? { backgroundColor: player1.highlightColor } : {}}
            >
              Score
            </button>
            <button 
              onClick={() => setView('teams')}
              className={`px-4 py-2 rounded-xl text-sm font-bold transition-all ${view === 'teams' ? 'text-slate-950' : 'text-slate-400'}`}
              style={view === 'teams' ? { backgroundColor: player1.highlightColor } : {}}
            >
              Teams
            </button>
            <button 
              onClick={() => setView('settings')}
              className={`px-4 py-2 rounded-xl text-sm font-bold transition-all ${view === 'settings' ? 'text-slate-950' : 'text-slate-400'}`}
              style={view === 'settings' ? { backgroundColor: player2.highlightColor } : {}}
            >
              Settings
            </button>
          </motion.div>
        )}
      </AnimatePresence>
      </div>
    </div>
  );
}
