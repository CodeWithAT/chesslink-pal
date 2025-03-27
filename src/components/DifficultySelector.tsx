
import { GameDifficulty } from "@/utils/chess";
import { cn } from "@/lib/utils";
import { Brain } from "lucide-react";

interface DifficultySelectorProps {
  value: GameDifficulty;
  onChange: (difficulty: GameDifficulty) => void;
  className?: string;
}

export default function DifficultySelector({
  value,
  onChange,
  className,
}: DifficultySelectorProps) {
  const difficulties: { value: GameDifficulty; label: string; description: string }[] = [
    {
      value: 'easy',
      label: 'Easy',
      description: 'Casual play with basic rules',
    },
    {
      value: 'medium',
      label: 'Medium',
      description: 'Moderate challenge for regular players',
    },
    {
      value: 'hard',
      label: 'Hard',
      description: 'Strong play for experienced players',
    },
  ];
  
  return (
    <div className={cn("grid gap-2", className)}>
      <div className="text-sm font-medium mb-1 flex items-center gap-1.5">
        <Brain className="h-4 w-4" />
        Difficulty Level
      </div>
      
      <div className="grid grid-cols-3 gap-2">
        {difficulties.map((difficulty) => (
          <button
            key={difficulty.value}
            onClick={() => onChange(difficulty.value)}
            className={cn(
              "flex flex-col items-center justify-center p-3 rounded-lg border transition-all",
              value === difficulty.value
                ? "border-primary bg-primary/5"
                : "border-border hover:border-primary/30"
            )}
          >
            <div className="text-sm font-medium">{difficulty.label}</div>
            <div className="text-xs text-muted-foreground text-center mt-1">
              {difficulty.description}
            </div>
          </button>
        ))}
      </div>
    </div>
  );
}
