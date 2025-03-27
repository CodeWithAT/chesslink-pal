
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { 
  RotateCcw,
  Share2,
  Flag,
  MoreHorizontal,
  ChevronLeft,
  ChevronRight,
  Undo,
} from "lucide-react";
import { 
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { toast } from "sonner";
import ShareModal from "./ShareModal";

interface GameControlsProps {
  onFlipBoard: () => void;
  onShare: () => void;
  onResign: () => void;
  onOfferDraw: () => void;
  canUndo: boolean;
  onUndo: () => void;
  onPrevMove: () => void;
  onNextMove: () => void;
  shareUrl: string;
}

export default function GameControls({
  onFlipBoard,
  onShare,
  onResign,
  onOfferDraw,
  canUndo,
  onUndo,
  onPrevMove,
  onNextMove,
  shareUrl,
}: GameControlsProps) {
  const [isShareModalOpen, setIsShareModalOpen] = useState(false);
  
  const handleCopyLink = () => {
    navigator.clipboard.writeText(shareUrl);
    toast.success("Game link copied to clipboard!");
  };
  
  return (
    <div className="flex flex-col space-y-4 w-full">
      <div className="flex items-center justify-between w-full">
        <div className="flex items-center space-x-2">
          <Button 
            variant="outline" 
            size="icon" 
            onClick={onPrevMove}
            className="h-8 w-8"
          >
            <ChevronLeft className="h-4 w-4" />
          </Button>
          
          <Button 
            variant="outline" 
            size="icon" 
            onClick={onNextMove}
            className="h-8 w-8"
          >
            <ChevronRight className="h-4 w-4" />
          </Button>
          
          <Button 
            variant="outline" 
            size="icon" 
            onClick={onUndo} 
            disabled={!canUndo}
            className="h-8 w-8"
          >
            <Undo className="h-4 w-4" />
          </Button>
        </div>
        
        <div className="flex items-center space-x-2">
          <Button 
            variant="outline" 
            size="icon" 
            onClick={onFlipBoard}
            className="h-8 w-8"
          >
            <RotateCcw className="h-4 w-4" />
          </Button>
          
          <Button 
            variant="outline" 
            size="icon" 
            onClick={() => setIsShareModalOpen(true)}
            className="h-8 w-8"
          >
            <Share2 className="h-4 w-4" />
          </Button>
          
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button 
                variant="outline" 
                size="icon"
                className="h-8 w-8"
              >
                <MoreHorizontal className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            
            <DropdownMenuContent align="end">
              <DropdownMenuItem onClick={onOfferDraw}>
                Offer Draw
              </DropdownMenuItem>
              <DropdownMenuItem 
                onClick={onResign}
                className="text-destructive focus:text-destructive"
              >
                <Flag className="h-4 w-4 mr-2" />
                Resign
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
      
      <ShareModal 
        isOpen={isShareModalOpen} 
        onClose={() => setIsShareModalOpen(false)} 
        shareUrl={shareUrl}
        onCopyLink={handleCopyLink}
      />
    </div>
  );
}
