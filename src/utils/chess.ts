// Chess piece types
export type PieceType = 'pawn' | 'knight' | 'bishop' | 'rook' | 'queen' | 'king';
export type PieceColor = 'white' | 'black';

export interface ChessPiece {
  type: PieceType;
  color: PieceColor;
  hasMoved?: boolean; // Used for castling and pawn's first move
}

export type Position = {
  x: number;
  y: number;
};

export type ChessSquare = {
  position: Position;
  piece: ChessPiece | null;
  isSelected: boolean;
  isValidMove: boolean;
  isCheck: boolean;
};

export type ChessBoard = ChessSquare[][];

export type ChessMove = {
  from: Position;
  to: Position;
  piece: ChessPiece;
  capturedPiece?: ChessPiece;
  isCheck?: boolean;
  isCheckmate?: boolean;
  isPromotion?: boolean;
  isCastling?: boolean;
  isEnPassant?: boolean;
  notation: string; // Chess notation (e.g., "e4", "Nf3")
};

export type GameStatus = 'waiting' | 'active' | 'check' | 'checkmate' | 'stalemate' | 'draw';

export type GameDifficulty = 'easy' | 'medium' | 'hard';

export type GameType = 'local' | 'ai' | 'online';

export type GameTime = {
  minutes: number;
  increment: number; // Seconds added after each move
};

export type GameOptions = {
  type: GameType;
  difficulty?: GameDifficulty;
  time?: GameTime;
  playerColor?: PieceColor;
};

export type GameState = {
  board: ChessBoard;
  moves: ChessMove[];
  currentTurn: PieceColor;
  status: GameStatus;
  check: boolean;
  options: GameOptions;
  whiteTime?: number; // Remaining time in milliseconds
  blackTime?: number;
  joinedAt?: string; // ISO string timestamp when opponent joined
  lastUpdated?: string; // ISO string timestamp of last update
};

// Initialize a new chess board
export function initializeBoard(): ChessBoard {
  const board: ChessBoard = Array(8)
    .fill(null)
    .map((_, y) =>
      Array(8)
        .fill(null)
        .map((_, x) => ({
          position: { x, y },
          piece: null,
          isSelected: false,
          isValidMove: false,
          isCheck: false,
        }))
    );

  // Set up pawns
  for (let x = 0; x < 8; x++) {
    board[1][x].piece = { type: 'pawn', color: 'black' };
    board[6][x].piece = { type: 'pawn', color: 'white' };
  }

  // Set up other pieces
  const backRankPieces: PieceType[] = ['rook', 'knight', 'bishop', 'queen', 'king', 'bishop', 'knight', 'rook'];
  
  for (let x = 0; x < 8; x++) {
    board[0][x].piece = { type: backRankPieces[x], color: 'black' };
    board[7][x].piece = { type: backRankPieces[x], color: 'white' };
  }

  return board;
}

// Initialize a new game state
export function initializeGame(options: GameOptions): GameState {
  const defaultTimeControl = { minutes: 10, increment: 0 };
  
  return {
    board: initializeBoard(),
    moves: [],
    currentTurn: 'white',
    status: options.type === 'online' && options.playerColor === 'black' ? 'waiting' : 'active',
    check: false,
    options,
    whiteTime: options.time ? options.time.minutes * 60 * 1000 : defaultTimeControl.minutes * 60 * 1000,
    blackTime: options.time ? options.time.minutes * 60 * 1000 : defaultTimeControl.minutes * 60 * 1000,
    joinedAt: undefined,
    lastUpdated: undefined,
  };
}

// Get valid moves for a piece
export function getValidMoves(board: ChessBoard, position: Position): Position[] {
  const { x, y } = position;
  const piece = board[y][x].piece;
  
  if (!piece) return [];
  
  const validMoves: Position[] = [];
  
  // This is a simplified implementation for demo purposes
  // A real chess engine would need much more complex logic for valid moves,
  // including checking for checks, castling, en passant, etc.
  
  switch (piece.type) {
    case 'pawn':
      // Simplified pawn movement
      const direction = piece.color === 'white' ? -1 : 1;
      const startRank = piece.color === 'white' ? 6 : 1;
      
      // Move forward one square
      if (y + direction >= 0 && y + direction < 8 && !board[y + direction][x].piece) {
        validMoves.push({ x, y: y + direction });
        
        // Move forward two squares from starting position
        if (y === startRank && !board[y + 2 * direction][x].piece) {
          validMoves.push({ x, y: y + 2 * direction });
        }
      }
      
      // Capture diagonally
      for (let dx of [-1, 1]) {
        if (x + dx >= 0 && x + dx < 8 && y + direction >= 0 && y + direction < 8) {
          const targetPiece = board[y + direction][x + dx].piece;
          if (targetPiece && targetPiece.color !== piece.color) {
            validMoves.push({ x: x + dx, y: y + direction });
          }
        }
      }
      break;
      
    case 'knight':
      // Knight moves in L-shape
      const knightMoves = [
        { dx: 1, dy: 2 }, { dx: 2, dy: 1 },
        { dx: 2, dy: -1 }, { dx: 1, dy: -2 },
        { dx: -1, dy: -2 }, { dx: -2, dy: -1 },
        { dx: -2, dy: 1 }, { dx: -1, dy: 2 }
      ];
      
      for (const move of knightMoves) {
        const newX = x + move.dx;
        const newY = y + move.dy;
        
        if (newX >= 0 && newX < 8 && newY >= 0 && newY < 8) {
          const targetPiece = board[newY][newX].piece;
          if (!targetPiece || targetPiece.color !== piece.color) {
            validMoves.push({ x: newX, y: newY });
          }
        }
      }
      break;
      
    case 'bishop':
      // Bishop moves diagonally
      const bishopDirections = [
        { dx: 1, dy: 1 }, { dx: 1, dy: -1 },
        { dx: -1, dy: 1 }, { dx: -1, dy: -1 }
      ];
      
      for (const dir of bishopDirections) {
        let newX = x + dir.dx;
        let newY = y + dir.dy;
        
        while (newX >= 0 && newX < 8 && newY >= 0 && newY < 8) {
          const targetPiece = board[newY][newX].piece;
          
          if (!targetPiece) {
            validMoves.push({ x: newX, y: newY });
          } else {
            if (targetPiece.color !== piece.color) {
              validMoves.push({ x: newX, y: newY });
            }
            break;
          }
          
          newX += dir.dx;
          newY += dir.dy;
        }
      }
      break;
      
    case 'rook':
      // Rook moves horizontally and vertically
      const rookDirections = [
        { dx: 1, dy: 0 }, { dx: -1, dy: 0 },
        { dx: 0, dy: 1 }, { dx: 0, dy: -1 }
      ];
      
      for (const dir of rookDirections) {
        let newX = x + dir.dx;
        let newY = y + dir.dy;
        
        while (newX >= 0 && newX < 8 && newY >= 0 && newY < 8) {
          const targetPiece = board[newY][newX].piece;
          
          if (!targetPiece) {
            validMoves.push({ x: newX, y: newY });
          } else {
            if (targetPiece.color !== piece.color) {
              validMoves.push({ x: newX, y: newY });
            }
            break;
          }
          
          newX += dir.dx;
          newY += dir.dy;
        }
      }
      break;
      
    case 'queen':
      // Queen moves like a rook and bishop combined
      const queenDirections = [
        { dx: 1, dy: 0 }, { dx: -1, dy: 0 },
        { dx: 0, dy: 1 }, { dx: 0, dy: -1 },
        { dx: 1, dy: 1 }, { dx: 1, dy: -1 },
        { dx: -1, dy: 1 }, { dx: -1, dy: -1 }
      ];
      
      for (const dir of queenDirections) {
        let newX = x + dir.dx;
        let newY = y + dir.dy;
        
        while (newX >= 0 && newX < 8 && newY >= 0 && newY < 8) {
          const targetPiece = board[newY][newX].piece;
          
          if (!targetPiece) {
            validMoves.push({ x: newX, y: newY });
          } else {
            if (targetPiece.color !== piece.color) {
              validMoves.push({ x: newX, y: newY });
            }
            break;
          }
          
          newX += dir.dx;
          newY += dir.dy;
        }
      }
      break;
      
    case 'king':
      // King moves one square in any direction
      const kingMoves = [
        { dx: 1, dy: 0 }, { dx: -1, dy: 0 },
        { dx: 0, dy: 1 }, { dx: 0, dy: -1 },
        { dx: 1, dy: 1 }, { dx: 1, dy: -1 },
        { dx: -1, dy: 1 }, { dx: -1, dy: -1 }
      ];
      
      for (const move of kingMoves) {
        const newX = x + move.dx;
        const newY = y + move.dy;
        
        if (newX >= 0 && newX < 8 && newY >= 0 && newY < 8) {
          const targetPiece = board[newY][newX].piece;
          if (!targetPiece || targetPiece.color !== piece.color) {
            validMoves.push({ x: newX, y: newY });
          }
        }
      }
      break;
  }
  
  return validMoves;
}

// Make a move on the board
export function makeMove(gameState: GameState, from: Position, to: Position): GameState {
  const { board, moves, currentTurn } = gameState;
  const newBoard = [...board.map(row => [...row.map(square => ({ ...square }))])];
  
  const fromSquare = newBoard[from.y][from.x];
  const toSquare = newBoard[to.y][to.x];
  
  if (!fromSquare.piece) return gameState;
  
  // Capture piece if present
  const capturedPiece = toSquare.piece;
  
  // Move the piece
  toSquare.piece = { ...fromSquare.piece, hasMoved: true };
  fromSquare.piece = null;
  
  // Clear selection and valid move highlights
  for (let y = 0; y < 8; y++) {
    for (let x = 0; x < 8; x++) {
      newBoard[y][x].isSelected = false;
      newBoard[y][x].isValidMove = false;
    }
  }
  
  // Record the move
  const newMove: ChessMove = {
    from,
    to,
    piece: toSquare.piece,
    capturedPiece,
    notation: generateNotation(from, to, toSquare.piece, capturedPiece, false, false),
  };
  
  // Update game state
  const newGameState: GameState = {
    ...gameState,
    board: newBoard,
    moves: [...moves, newMove],
    currentTurn: currentTurn === 'white' ? 'black' : 'white',
  };
  
  // Update timers if time control is enabled
  if (gameState.options.time) {
    if (currentTurn === 'white') {
      newGameState.whiteTime = (gameState.whiteTime || 0) + (gameState.options.time?.increment || 0) * 1000;
    } else {
      newGameState.blackTime = (gameState.blackTime || 0) + (gameState.options.time?.increment || 0) * 1000;
    }
  }
  
  // TODO: Check for check, checkmate, stalemate, etc.
  
  return newGameState;
}

// Generate chess notation for a move
function generateNotation(
  from: Position,
  to: Position,
  piece: ChessPiece,
  capturedPiece: ChessPiece | null | undefined,
  isCheck: boolean,
  isCheckmate: boolean
): string {
  const files = ['a', 'b', 'c', 'd', 'e', 'f', 'g', 'h'];
  const ranks = ['8', '7', '6', '5', '4', '3', '2', '1'];
  
  const fromNotation = files[from.x] + ranks[from.y];
  const toNotation = files[to.x] + ranks[to.y];
  
  let notation = '';
  
  // Add piece symbol
  if (piece.type !== 'pawn') {
    notation += piece.type.charAt(0).toUpperCase();
  }
  
  // Add capture symbol
  if (capturedPiece) {
    if (piece.type === 'pawn') {
      notation += files[from.x];
    }
    notation += 'x';
  }
  
  // Add destination
  notation += toNotation;
  
  // Add check or checkmate symbol
  if (isCheckmate) {
    notation += '#';
  } else if (isCheck) {
    notation += '+';
  }
  
  return notation;
}

// Generate a simple AI move based on difficulty
export function generateAIMove(gameState: GameState): { from: Position; to: Position } | null {
  const { board, currentTurn, options } = gameState;
  
  if (currentTurn !== 'black' || options.type !== 'ai') return null;
  
  const difficultyFactor = options.difficulty === 'easy' ? 0.3 : 
                          options.difficulty === 'medium' ? 0.6 : 0.9;
  
  // Collect all possible moves
  const possibleMoves: { from: Position; to: Position; score: number }[] = [];
  
  // Find all pieces of the current player's color
  for (let y = 0; y < 8; y++) {
    for (let x = 0; x < 8; x++) {
      const piece = board[y][x].piece;
      if (piece && piece.color === currentTurn) {
        const validMoves = getValidMoves(board, { x, y });
        
        for (const move of validMoves) {
          // Calculate a score for this move
          let score = 0;
          
          // Base score: random element
          score += Math.random();
          
          // If expert level, add tactical evaluation
          if (difficultyFactor > 0.7) {
            // Prefer captures based on piece values
            const targetPiece = board[move.y][move.x].piece;
            if (targetPiece) {
              const pieceValues: Record<PieceType, number> = {
                pawn: 1,
                knight: 3,
                bishop: 3,
                rook: 5,
                queen: 9,
                king: 100
              };
              score += pieceValues[targetPiece.type] * 2;
            }
            
            // Prefer center control for weaker pieces
            if (['pawn', 'knight', 'bishop'].includes(piece.type)) {
              const centerX = Math.abs(move.x - 3.5);
              const centerY = Math.abs(move.y - 3.5);
              score += (4 - (centerX + centerY)) * 0.2;
            }
          }
          
          possibleMoves.push({
            from: { x, y },
            to: move,
            score
          });
        }
      }
    }
  }
  
  if (possibleMoves.length === 0) return null;
  
  // Sort by score
  possibleMoves.sort((a, b) => b.score - a.score);
  
  // Get a move based on difficulty
  // Easy: more random, Hard: more optimal
  const moveIndex = Math.min(
    Math.floor(Math.random() * possibleMoves.length * (1 - difficultyFactor)),
    possibleMoves.length - 1
  );
  
  return {
    from: possibleMoves[moveIndex].from,
    to: possibleMoves[moveIndex].to
  };
}
