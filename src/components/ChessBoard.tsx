
import { useEffect, useState } from "react";
import { ChessBoard as ChessBoardType, ChessSquare, Position, GameState, PieceColor, getValidMoves, makeMove, generateAIMove } from "@/utils/chess";
import { cn } from "@/lib/utils";
import ChessPiece from "./ChessPiece";

interface ChessBoardProps {
  gameState: GameState;
  onMove: (newGameState: GameState) => void;
  isPlayerTurn: boolean;
  flipped?: boolean;
}

export default function ChessBoard({ gameState, onMove, isPlayerTurn, flipped = false }: ChessBoardProps) {
  const [board, setBoard] = useState<ChessBoardType>(gameState.board);
  const [selectedPosition, setSelectedPosition] = useState<Position | null>(null);
  
  // Update board when game state changes
  useEffect(() => {
    setBoard(gameState.board);
  }, [gameState]);
  
  // Handle AI moves
  useEffect(() => {
    if (gameState.options.type === 'ai' && gameState.currentTurn === 'black' && !isPlayerTurn) {
      const timer = setTimeout(() => {
        const aiMove = generateAIMove(gameState);
        if (aiMove) {
          const { from, to } = aiMove;
          const newGameState = makeMove(gameState, from, to);
          onMove(newGameState);
        }
      }, 500);
      
      return () => clearTimeout(timer);
    }
  }, [gameState, isPlayerTurn, onMove]);
  
  const handleSquareClick = (position: Position) => {
    if (!isPlayerTurn) return;
    
    const square = board[position.y][position.x];
    
    // If no square is selected and clicked square has a piece of the current player's color
    if (!selectedPosition && square.piece && square.piece.color === gameState.currentTurn) {
      // Select the square and show valid moves
      setSelectedPosition(position);
      
      const validMoves = getValidMoves(board, position);
      const newBoard = [...board.map(row => [...row.map(s => ({ ...s }))])];
      
      // Highlight the selected square
      newBoard[position.y][position.x].isSelected = true;
      
      // Highlight valid move squares
      validMoves.forEach(move => {
        newBoard[move.y][move.x].isValidMove = true;
      });
      
      setBoard(newBoard);
    } 
    // If a square is already selected
    else if (selectedPosition) {
      // If clicking the same square, deselect it
      if (selectedPosition.x === position.x && selectedPosition.y === position.y) {
        setSelectedPosition(null);
        
        // Clear highlights
        const newBoard = [...board.map(row => [...row.map(s => ({ ...s, isSelected: false, isValidMove: false }))])];
        setBoard(newBoard);
      } 
      // If clicking a valid move square, make the move
      else if (square.isValidMove) {
        const newGameState = makeMove(gameState, selectedPosition, position);
        onMove(newGameState);
        setSelectedPosition(null);
      } 
      // If clicking another piece of the same color, select that piece instead
      else if (square.piece && square.piece.color === gameState.currentTurn) {
        setSelectedPosition(position);
        
        const validMoves = getValidMoves(board, position);
        const newBoard = [...board.map(row => [...row.map(s => ({ ...s, isSelected: false, isValidMove: false }))])];
        
        // Highlight the selected square
        newBoard[position.y][position.x].isSelected = true;
        
        // Highlight valid move squares
        validMoves.forEach(move => {
          newBoard[move.y][move.x].isValidMove = true;
        });
        
        setBoard(newBoard);
      }
    }
  };
  
  // Get coordinate labels
  const files = ['a', 'b', 'c', 'd', 'e', 'f', 'g', 'h'];
  const ranks = ['8', '7', '6', '5', '4', '3', '2', '1'];
  
  // Flip the board if needed
  const displayRanks = flipped ? [...ranks].reverse() : ranks;
  const displayFiles = flipped ? [...files].reverse() : files;
  
  return (
    <div className="relative chess-board-shadow rounded-lg overflow-hidden w-full max-w-md mx-auto">
      <div className="grid grid-cols-8 w-full">
        {board.map((row, y) => 
          row.map((square, x) => {
            const isLight = (x + y) % 2 === 0;
            const file = flipped ? 7 - x : x;
            const rank = flipped ? 7 - y : y;
            
            return (
              <div
                key={`${x}-${y}`}
                className={cn(
                  "aspect-square relative",
                  isLight ? "bg-chess-light" : "bg-chess-dark",
                  square.isSelected && "ring-4 ring-chess-selected ring-inset",
                  square.isValidMove && "after:absolute after:inset-0 after:bg-chess-validMove after:rounded-full after:w-1/3 after:h-1/3 after:m-auto"
                )}
                onClick={() => handleSquareClick({ x: file, y: rank })}
              >
                {/* Coordinate labels */}
                {x === 0 && (
                  <span className="absolute left-1 top-1 text-xs opacity-70 z-10">
                    {displayRanks[y]}
                  </span>
                )}
                {y === 7 && (
                  <span className="absolute right-1 bottom-1 text-xs opacity-70 z-10">
                    {displayFiles[x]}
                  </span>
                )}
                
                {/* Chess piece */}
                {square.piece && (
                  <ChessPiece 
                    piece={square.piece} 
                    isSelected={square.isSelected} 
                  />
                )}
              </div>
            );
          })
        )}
      </div>
    </div>
  );
}
