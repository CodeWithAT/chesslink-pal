
import { ChessPiece as ChessPieceType, PieceType, PieceColor } from "@/utils/chess";
import { cn } from "@/lib/utils";

interface ChessPieceProps {
  piece: ChessPieceType;
  isSelected?: boolean;
  className?: string;
}

export default function ChessPiece({ piece, isSelected, className }: ChessPieceProps) {
  const { type, color } = piece;
  
  const getPieceSymbol = (type: PieceType, color: PieceColor) => {
    const symbols: Record<PieceColor, Record<PieceType, string>> = {
      white: {
        king: '♔',
        queen: '♕',
        rook: '♖',
        bishop: '♗',
        knight: '♘',
        pawn: '♙'
      },
      black: {
        king: '♚',
        queen: '♛',
        rook: '♜',
        bishop: '♝',
        knight: '♞',
        pawn: '♟'
      }
    };
    
    return symbols[color][type];
  };
  
  return (
    <div 
      className={cn(
        "w-full h-full flex items-center justify-center text-4xl select-none transition-transform",
        color === 'white' ? 'text-chess-pieceWhite' : 'text-chess-pieceBlack',
        isSelected ? 'scale-110' : '',
        className
      )}
      style={{
        filter: `drop-shadow(0 2px 2px rgba(0, 0, 0, 0.2))`
      }}
    >
      {getPieceSymbol(type, color)}
    </div>
  );
}
