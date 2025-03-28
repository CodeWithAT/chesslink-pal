
import { nanoid } from 'nanoid';
import { GameOptions, GameState, initializeGame, PieceColor } from './chess';
import { saveGameToStorage, loadGameFromStorage } from './storage';

// Generate a unique game ID
export function generateGameId(): string {
  return nanoid(10);
}

// Create a new game session
export function createGameSession(options: GameOptions): { gameId: string; gameState: GameState } {
  const gameId = generateGameId();
  const gameState = initializeGame(options);
  
  // For online games, set status to waiting
  if (options.type === 'online') {
    gameState.status = 'waiting';
  }
  
  // Initialize times for timed games
  if (options.time) {
    const timeInMs = options.time.minutes * 60 * 1000;
    gameState.whiteTime = timeInMs;
    gameState.blackTime = timeInMs;
  }
  
  // Save the game to local storage
  saveGameToStorage(gameId, gameState);
  
  return { gameId, gameState };
}

// Join an existing game
export function joinGameSession(gameId: string, playerColor: PieceColor): GameState | null {
  const gameState = loadGameFromStorage(gameId);
  
  if (!gameState) return null;
  
  // Update the game state to reflect the joined player
  const updatedState: GameState = {
    ...gameState,
    status: 'active',
    joinedAt: new Date().toISOString(),
  };
  
  // Save the updated game state
  saveGameToStorage(gameId, updatedState);
  
  return updatedState;
}

// Get the current game state
export function getGameSession(gameId: string): GameState | null {
  return loadGameFromStorage(gameId);
}

// Update the game state
export function updateGameSession(gameId: string, gameState: GameState): void {
  saveGameToStorage(gameId, gameState);
}

// Simulate network synchronization for online play
// In a real application, this would use websockets or a similar technology
export function syncGameState(gameId: string, gameState: GameState): void {
  // For now, this just saves to local storage
  saveGameToStorage(gameId, gameState);
  
  // Add timestamp to help with polling updates
  const updatedState = {
    ...gameState,
    lastUpdated: new Date().toISOString()
  };
  
  saveGameToStorage(gameId, updatedState);
}

// Generate a shareable link for the game
export function getShareableLink(gameId: string): string {
  // Use the current window location to create an absolute URL
  // This ensures we get the correct domain, protocol, and port
  const baseUrl = window.location.origin;
  return `${baseUrl}/game/${gameId}`;
}

// Check if a game exists
export function gameExists(gameId: string): boolean {
  return loadGameFromStorage(gameId) !== null;
}
