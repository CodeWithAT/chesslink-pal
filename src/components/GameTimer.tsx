
import { useEffect, useState } from "react";
import { cn } from "@/lib/utils";
import { PieceColor } from "@/utils/chess";

interface GameTimerProps {
  time: number; // Time in milliseconds
  isActive: boolean;
  playerColor: PieceColor;
  onTimeOut: () => void;
}

export default function GameTimer({ time, isActive, playerColor, onTimeOut }: GameTimerProps) {
  const [remainingTime, setRemainingTime] = useState(time);
  
  useEffect(() => {
    setRemainingTime(time);
  }, [time]);
  
  useEffect(() => {
    if (isActive && remainingTime > 0) {
      const interval = setInterval(() => {
        setRemainingTime(prev => {
          const newTime = prev - 100;
          if (newTime <= 0) {
            clearInterval(interval);
            onTimeOut();
            return 0;
          }
          return newTime;
        });
      }, 100);
      
      return () => clearInterval(interval);
    }
  }, [isActive, remainingTime, onTimeOut]);
  
  // Format time as mm:ss.h
  const formatTime = (ms: number) => {
    const minutes = Math.floor(ms / 60000);
    const seconds = Math.floor((ms % 60000) / 1000);
    const tenths = Math.floor((ms % 1000) / 100);
    
    return `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}.${tenths}`;
  };
  
  // Calculate progress percentage
  const progressPercent = (remainingTime / time) * 100;
  
  // Determine if time is low (less than 30 seconds)
  const isLowTime = remainingTime < 30000;
  
  return (
    <div className={cn(
      "relative w-full h-12 rounded-lg overflow-hidden border",
      playerColor === 'white' ? "border-black/10" : "border-white/10"
    )}>
      <div
        className={cn(
          "absolute top-0 left-0 h-full transition-all duration-100 ease-linear",
          playerColor === 'white' ? "bg-white" : "bg-black",
          isLowTime && isActive ? "animate-pulse-subtle" : "",
          isActive ? "opacity-100" : "opacity-70"
        )}
        style={{ width: `${progressPercent}%` }}
      />
      
      <div className={cn(
        "absolute inset-0 flex items-center justify-center font-mono text-lg",
        playerColor === 'white' ? "text-black" : "text-white"
      )}>
        {formatTime(remainingTime)}
      </div>
    </div>
  );
}
