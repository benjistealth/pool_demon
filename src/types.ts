export interface Player {
  id: string;
  name: string;
  score: number;
  isTurn: boolean;
  highlightColor: string;
}

export interface MatchHistoryEntry {
  id: string;
  date: string;
  player1: string;
  player2: string;
  team1?: string;
  team2?: string;
  score1: number;
  score2: number;
  winner: string;
  shotClockSetting?: number;
  matchClockRemaining?: number;
}

export interface AppState {
  settings: {
    player1: Player;
    player2: Player;
    shotClockDuration: number;
    isShotClockEnabled: boolean;
    matchClockDuration: number;
    isMatchClockEnabled: boolean;
  };
  teams: {
    team1Name: string;
    team2Name: string;
    team1Players: string[];
    team2Players: string[];
    selectedMatchIndex: number | null;
    totals: { t1: number; t2: number };
  };
  playerPreferences?: Record<string, string>;
  history: MatchHistoryEntry[];
  lastUpdated: string;
}
