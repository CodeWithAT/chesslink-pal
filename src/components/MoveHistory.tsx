
import { ChessMove, PieceColor } from "@/utils/chess";
import { cn } from "@/lib/utils";
import { ScrollArea } from "@/components/ui/scroll-area";

interface MoveHistoryProps {
  moves: ChessMove[];
  currentMoveIndex: number;
  onSelectMove: (index: number) => void;
}

export default function MoveHistory({ 
  moves, 
  currentMoveIndex,
  onSelectMove
}: MoveHistoryProps) {
  // Group moves by pairs (white and black)
  const moveGroups: { number: number; white?: ChessMove; black?: ChessMove }[] = [];
  
  for (let i = 0; i < moves.length; i += 2) {
    moveGroups.push({
      number: Math.floor(i / 2) + 1,
      white: moves[i],
      black: i + 1 < moves.length ? moves[i + 1] : undefined,
    });
  }
  
  const getMoveClassName = (moveIndex: number) => {
    return cn(
      "px-2 py-1 rounded transition-colors cursor-pointer",
      moveIndex === currentMoveIndex
        ? "bg-primary text-primary-foreground font-medium"
        : "hover:bg-secondary"
    );
  };
  
  if (moves.length === 0) {
    return (
      <div className="h-full flex items-center justify-center text-muted-foreground italic">
        No moves yet
      </div>
    );
  }
  
  return (
    <ScrollArea className="h-[280px] w-full">
      <div className="space-y-1 p-1">
        {moveGroups.map((group, groupIndex) => (
          <div key={group.number} className="flex items-center text-sm">
            <div className="w-8 text-muted-foreground text-center">
              {group.number}.
            </div>
            
            <div className="flex-1 grid grid-cols-2 gap-1">
              {group.white && (
                <div 
                  className={getMoveClassName(groupIndex * 2)}
                  onClick={() => onSelectMove(groupIndex * 2)}
                >
                  {group.white.notation}
                </div>
              )}
              
              {group.black && (
                <div 
                  className={getMoveClassName(groupIndex * 2 + 1)}
                  onClick={() => onSelectMove(groupIndex * 2 + 1)}
                >
                  {group.black.notation}
                </div>
              )}
            </div>
          </div>
        ))}
      </div>
    </ScrollArea>
  );
}
