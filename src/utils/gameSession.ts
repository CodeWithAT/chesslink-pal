
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
  
  // Simulated delayed response for online opponent
  // This is ONLY for demo purposes. A real app would use proper networking.
  if (gameState.options.type === 'online' && gameState.currentTurn !== gameState.options.playerColor) {
    setTimeout(() => {
      console.log('Simulating opponent move sync');
      // In a real app, this would be handled by receiving updates from the server
    }, 1000);
  }
}

// Generate a shareable link for the game
export function getShareableLink(gameId: string): string {
  const baseUrl = window.location.origin;
  return `${baseUrl}/game/${gameId}`;
}
