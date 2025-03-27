
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/components/ui/tabs";
import { GameOptions, GameDifficulty, PieceColor } from "@/utils/chess";
import { createGameSession, getShareableLink } from "@/utils/gameSession";
import { toast } from "sonner";
import { UserRound, Cpu, Globe, Clock } from "lucide-react";
import DifficultySelector from "./DifficultySelector";
import { cn } from "@/lib/utils";

interface TimeOption {
  minutes: number;
  increment: number;
  label: string;
}

export default function CreateGameForm() {
  const [gameType, setGameType] = useState<"local" | "ai" | "online">("ai");
  const [difficulty, setDifficulty] = useState<GameDifficulty>("medium");
  const [playerColor, setPlayerColor] = useState<PieceColor>("white");
  const [selectedTime, setSelectedTime] = useState<TimeOption>({ minutes: 10, increment: 0, label: "10 min" });
  
  const navigate = useNavigate();
  
  const timeOptions: TimeOption[] = [
    { minutes: 1, increment: 0, label: "1 min" },
    { minutes: 3, increment: 0, label: "3 min" },
    { minutes: 5, increment: 0, label: "5 min" },
    { minutes: 10, increment: 0, label: "10 min" },
    { minutes: 15, increment: 10, label: "15 | 10" },
    { minutes: 30, increment: 0, label: "30 min" },
  ];
  
  const handleCreateGame = () => {
    const options: GameOptions = {
      type: gameType,
      difficulty: gameType === "ai" ? difficulty : undefined,
      playerColor: gameType === "local" ? "white" : playerColor,
      time: {
        minutes: selectedTime.minutes,
        increment: selectedTime.increment,
      },
    };
    
    const { gameId, gameState } = createGameSession(options);
    
    if (gameType === "online") {
      const shareableLink = getShareableLink(gameId);
      toast.success("Game created! Share this link with your opponent", {
        description: "Tap to copy",
        action: {
          label: "Copy Link",
          onClick: () => {
            navigator.clipboard.writeText(shareableLink);
            toast.success("Link copied to clipboard!");
          },
        },
      });
    }
    
    navigate(`/game/${gameId}`);
  };
  
  return (
    <Card className="w-full max-w-lg mx-auto">
      <CardHeader>
        <CardTitle>Create New Game</CardTitle>
        <CardDescription>
          Set up a new chess game with your preferred settings
        </CardDescription>
      </CardHeader>
      
      <CardContent className="space-y-6">
        <Tabs defaultValue="ai" onValueChange={(value) => setGameType(value as any)}>
          <TabsList className="grid grid-cols-3 mb-4">
            <TabsTrigger value="local" className="flex items-center gap-1.5">
              <UserRound className="h-4 w-4" />
              Local
            </TabsTrigger>
            <TabsTrigger value="ai" className="flex items-center gap-1.5">
              <Cpu className="h-4 w-4" />
              Computer
            </TabsTrigger>
            <TabsTrigger value="online" className="flex items-center gap-1.5">
              <Globe className="h-4 w-4" />
              Online
            </TabsTrigger>
          </TabsList>
          
          <TabsContent value="local">
            <div className="text-sm text-muted-foreground">
              Play chess on this device with a friend
            </div>
          </TabsContent>
          
          <TabsContent value="ai">
            <DifficultySelector 
              value={difficulty} 
              onChange={setDifficulty} 
            />
          </TabsContent>
          
          <TabsContent value="online">
            <div className="space-y-4">
              <div className="text-sm text-muted-foreground mb-2">
                Play with a friend online. We'll generate a link you can share.
              </div>
              
              <div className="space-y-2">
                <div className="text-sm font-medium">Play as</div>
                <div className="grid grid-cols-2 gap-2">
                  <button
                    onClick={() => setPlayerColor("white")}
                    className={cn(
                      "flex items-center justify-center gap-2 p-3 rounded-lg border transition-all",
                      playerColor === "white"
                        ? "border-primary bg-primary/5"
                        : "border-border hover:border-primary/30"
                    )}
                  >
                    <div className="w-6 h-6 bg-white rounded-full border"></div>
                    <span>White</span>
                  </button>
                  
                  <button
                    onClick={() => setPlayerColor("black")}
                    className={cn(
                      "flex items-center justify-center gap-2 p-3 rounded-lg border transition-all",
                      playerColor === "black"
                        ? "border-primary bg-primary/5"
                        : "border-border hover:border-primary/30"
                    )}
                  >
                    <div className="w-6 h-6 bg-black rounded-full border"></div>
                    <span>Black</span>
                  </button>
                </div>
              </div>
            </div>
          </TabsContent>
        </Tabs>
        
        <div className="space-y-2">
          <div className="text-sm font-medium flex items-center gap-1.5">
            <Clock className="h-4 w-4" />
            Time Control
          </div>
          
          <div className="grid grid-cols-3 gap-2">
            {timeOptions.map((option) => (
              <button
                key={option.label}
                onClick={() => setSelectedTime(option)}
                className={cn(
                  "p-3 rounded-lg border transition-all",
                  selectedTime.label === option.label
                    ? "border-primary bg-primary/5"
                    : "border-border hover:border-primary/30"
                )}
              >
                <div className="text-sm font-medium">{option.label}</div>
                {option.increment > 0 && (
                  <div className="text-xs text-muted-foreground">
                    +{option.increment}s increment
                  </div>
                )}
              </button>
            ))}
          </div>
        </div>
      </CardContent>
      
      <CardFooter>
        <Button onClick={handleCreateGame} className="w-full">
          Start Game
        </Button>
      </CardFooter>
    </Card>
  );
}
