
import { GameState } from './chess';

const STORAGE_PREFIX = 'chesspal_';

// Save a game to local storage
export function saveGameToStorage(gameId: string, gameState: GameState): void {
  localStorage.setItem(`${STORAGE_PREFIX}game_${gameId}`, JSON.stringify(gameState));
}

// Load a game from local storage
export function loadGameFromStorage(gameId: string): GameState | null {
  const data = localStorage.getItem(`${STORAGE_PREFIX}game_${gameId}`);
  return data ? JSON.parse(data) : null;
}

// Delete a game from local storage
export function deleteGameFromStorage(gameId: string): void {
  localStorage.removeItem(`${STORAGE_PREFIX}game_${gameId}`);
}

// Get the player profile
export interface PlayerProfile {
  name: string;
  gamesPlayed: number;
  wins: number;
  losses: number;
  draws: number;
  history: GameHistoryEntry[];
}

export interface GameHistoryEntry {
  gameId: string;
  opponent: string;
  playerColor: 'white' | 'black';
  result: 'win' | 'loss' | 'draw';
  date: string;
  moves: number;
}

// Save player profile
export function savePlayerProfile(profile: PlayerProfile): void {
  localStorage.setItem(`${STORAGE_PREFIX}profile`, JSON.stringify(profile));
}

// Load player profile
export function loadPlayerProfile(): PlayerProfile {
  const data = localStorage.getItem(`${STORAGE_PREFIX}profile`);
  
  if (data) {
    return JSON.parse(data);
  }
  
  // Default profile
  return {
    name: 'Player',
    gamesPlayed: 0,
    wins: 0,
    losses: 0,
    draws: 0,
    history: [],
  };
}

// Update player profile with game result
export function updatePlayerStats(
  result: 'win' | 'loss' | 'draw',
  opponent: string,
  playerColor: 'white' | 'black',
  gameId: string,
  moves: number
): void {
  const profile = loadPlayerProfile();
  
  profile.gamesPlayed += 1;
  
  if (result === 'win') {
    profile.wins += 1;
  } else if (result === 'loss') {
    profile.losses += 1;
  } else {
    profile.draws += 1;
  }
  
  profile.history.unshift({
    gameId,
    opponent,
    playerColor,
    result,
    date: new Date().toISOString(),
    moves,
  });
  
  // Limit history to last 50 games
  if (profile.history.length > 50) {
    profile.history = profile.history.slice(0, 50);
  }
  
  savePlayerProfile(profile);
}

// Get all saved games
export function getAllSavedGames(): { id: string; state: GameState }[] {
  const games: { id: string; state: GameState }[] = [];
  
  for (let i = 0; i < localStorage.length; i++) {
    const key = localStorage.key(i);
    
    if (key && key.startsWith(`${STORAGE_PREFIX}game_`)) {
      const gameId = key.replace(`${STORAGE_PREFIX}game_`, '');
      const gameState = loadGameFromStorage(gameId);
      
      if (gameState) {
        games.push({ id: gameId, state: gameState });
      }
    }
  }
  
  return games;
}
