
import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { 
  GameState, 
  makeMove, 
  PieceColor, 
  Position, 
  GameStatus,
  ChessMove
} from "@/utils/chess";
import { 
  getGameSession, 
  updateGameSession, 
  getShareableLink,
  joinGameSession,
  syncGameState
} from "@/utils/gameSession";
import { updatePlayerStats } from "@/utils/storage";
import { toast } from "sonner";
import ChessBoard from "@/components/ChessBoard";
import GameControls from "@/components/GameControls";
import MoveHistory from "@/components/MoveHistory";
import GameTimer from "@/components/GameTimer";
import { 
  Card, 
  CardContent, 
  CardDescription, 
  CardHeader, 
  CardTitle 
} from "@/components/ui/card";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { Button } from "@/components/ui/button";
import { ArrowLeftIcon } from "lucide-react";
import { useIsMobile } from "@/hooks/use-mobile";

export default function Game() {
  const { gameId } = useParams();
  const navigate = useNavigate();
  const isMobile = useIsMobile();
  
  const [gameState, setGameState] = useState<GameState | null>(null);
  const [isBoardFlipped, setIsBoardFlipped] = useState(false);
  const [isResigning, setIsResigning] = useState(false);
  const [isOfferingDraw, setIsOfferingDraw] = useState(false);
  const [currentMoveIndex, setCurrentMoveIndex] = useState(-1);
  const [viewingPastMove, setViewingPastMove] = useState(false);
  
  // Load the game on initial render
  useEffect(() => {
    if (!gameId) return;
    
    const loadedGame = getGameSession(gameId);
    
    if (loadedGame) {
      setGameState(loadedGame);
      setCurrentMoveIndex(loadedGame.moves.length - 1);
    } else {
      toast.error("Game not found");
      navigate("/");
    }
  }, [gameId, navigate]);
  
  // Update when viewing past moves
  useEffect(() => {
    if (!gameState) return;
    
    // If we're at the most recent move, we're not viewing past moves
    setViewingPastMove(currentMoveIndex < gameState.moves.length - 1);
  }, [currentMoveIndex, gameState]);
  
  // Join game if needed and it's online
  useEffect(() => {
    if (!gameState || !gameId || gameState.options.type !== 'online') return;
    
    if (gameState.status === 'waiting') {
      const joinedGame = joinGameSession(gameId, gameState.options.playerColor === 'white' ? 'black' : 'white');
      
      if (joinedGame) {
        setGameState(joinedGame);
        toast.success("Joined the game!");
      }
    }
  }, [gameState, gameId]);
  
  // Set up polling for online games
  useEffect(() => {
    if (!gameState || !gameId || gameState.options.type !== 'online') return;
    
    const intervalId = setInterval(() => {
      const updatedGame = getGameSession(gameId);
      
      if (updatedGame && updatedGame.moves.length !== gameState.moves.length) {
        setGameState(updatedGame);
        setCurrentMoveIndex(updatedGame.moves.length - 1);
      }
    }, 2000);
    
    return () => clearInterval(intervalId);
  }, [gameState, gameId]);
  
  if (!gameState || !gameId) {
    return (
      <div className="container mx-auto py-10 px-4 flex justify-center">
        <Card className="w-full max-w-md">
          <CardHeader>
            <CardTitle>Loading game...</CardTitle>
            <CardDescription>Please wait while we load your game</CardDescription>
          </CardHeader>
        </Card>
      </div>
    );
  }
  
  const handleFlipBoard = () => {
    setIsBoardFlipped(prev => !prev);
  };
  
  const handleShare = () => {
    const shareUrl = getShareableLink(gameId);
    navigator.clipboard.writeText(shareUrl);
    toast.success("Game link copied to clipboard!");
  };
  
  const handleResign = () => {
    setIsResigning(true);
  };
  
  const confirmResign = () => {
    const updatedGameState: GameState = {
      ...gameState,
      status: 'checkmate', // We use checkmate as the endgame status for simplicity
    };
    
    updateGameSession(gameId, updatedGameState);
    setGameState(updatedGameState);
    
    const playerColor = gameState.options.playerColor || 'white';
    
    // Update player stats
    updatePlayerStats(
      'loss',
      gameState.options.type === 'ai' ? 'Computer' : 'Opponent',
      playerColor,
      gameId,
      gameState.moves.length
    );
    
    toast.info("You resigned the game");
    setIsResigning(false);
  };
  
  const handleOfferDraw = () => {
    setIsOfferingDraw(true);
  };
  
  const confirmDraw = () => {
    const updatedGameState: GameState = {
      ...gameState,
      status: 'draw',
    };
    
    updateGameSession(gameId, updatedGameState);
    setGameState(updatedGameState);
    
    const playerColor = gameState.options.playerColor || 'white';
    
    // Update player stats
    updatePlayerStats(
      'draw',
      gameState.options.type === 'ai' ? 'Computer' : 'Opponent',
      playerColor,
      gameId,
      gameState.moves.length
    );
    
    toast.info("Game ended in a draw");
    setIsOfferingDraw(false);
  };
  
  const handleUndo = () => {
    if (gameState.moves.length === 0) return;
    
    // In online games, can only undo your own last move
    if (gameState.options.type === 'online' && gameState.currentTurn === gameState.options.playerColor) {
      toast.error("Cannot undo opponent's move");
      return;
    }
    
    // Remove the last move
    const updatedMoves = [...gameState.moves];
    updatedMoves.pop();
    
    // Update the board state
    // This is a simplified implementation for demo purposes
    // A real chess engine would need to recalculate the board state
    const updatedGameState: GameState = {
      ...gameState,
      moves: updatedMoves,
      currentTurn: gameState.currentTurn === 'white' ? 'black' : 'white',
      status: 'active',
    };
    
    updateGameSession(gameId, updatedGameState);
    setGameState(updatedGameState);
    setCurrentMoveIndex(updatedMoves.length - 1);
  };
  
  const handlePrevMove = () => {
    if (currentMoveIndex > -1) {
      setCurrentMoveIndex(currentMoveIndex - 1);
    }
  };
  
  const handleNextMove = () => {
    if (currentMoveIndex < gameState.moves.length - 1) {
      setCurrentMoveIndex(currentMoveIndex + 1);
    }
  };
  
  const handleMoveSelect = (moveIndex: number) => {
    setCurrentMoveIndex(moveIndex);
  };
  
  const handleMove = (newGameState: GameState) => {
    updateGameSession(gameId, newGameState);
    setGameState(newGameState);
    setCurrentMoveIndex(newGameState.moves.length - 1);
    
    if (gameState.options.type === 'online') {
      syncGameState(gameId, newGameState);
    }
  };
  
  const handleTimeOut = (color: PieceColor) => {
    if (gameState.status !== 'active') return;
    
    const playerColor = gameState.options.playerColor || 'white';
    const result = color === playerColor ? 'loss' : 'win';
    
    const updatedGameState: GameState = {
      ...gameState,
      status: 'checkmate', // We use checkmate as the endgame status for simplicity
    };
    
    updateGameSession(gameId, updatedGameState);
    setGameState(updatedGameState);
    
    // Update player stats
    updatePlayerStats(
      result,
      gameState.options.type === 'ai' ? 'Computer' : 'Opponent',
      playerColor,
      gameId,
      gameState.moves.length
    );
    
    toast.info(`${color === 'white' ? 'White' : 'Black'} ran out of time!`);
  };
  
  // Determine if it's the player's turn
  const isPlayerTurn = () => {
    if (gameState.options.type === 'local') return true;
    
    const playerColor = gameState.options.playerColor || 'white';
    return gameState.currentTurn === playerColor;
  };
  
  // Get opponent name based on game type
  const getOpponentName = () => {
    if (gameState.options.type === 'local') return 'Local Player';
    if (gameState.options.type === 'ai') return 'Computer';
    return 'Online Opponent';
  };
  
  return (
    <div className="container max-w-6xl mx-auto py-6 px-4">
      <div className="flex items-center mb-6">
        <Button 
          variant="outline" 
          size="sm" 
          onClick={() => navigate('/')}
          className="mr-4"
        >
          <ArrowLeftIcon className="h-4 w-4 mr-2" />
          Back
        </Button>
        
        <div>
          <h1 className="text-2xl font-bold tracking-tight">
            Chess Game
          </h1>
          <p className="text-muted-foreground">
            {gameState.options.type === 'local' ? 'Local game' : 
             gameState.options.type === 'ai' ? `Playing against ${gameState.options.difficulty} computer` :
             'Online match'}
          </p>
        </div>
      </div>
      
      {/* Game board and controls */}
      <div className="grid gap-6 lg:grid-cols-3">
        {/* Left side: opponent info, board and player info */}
        <div className="lg:col-span-2 space-y-4">
          {/* Opponent timer and info */}
          <div className="bg-card rounded-lg p-4 border flex items-center space-x-4">
            <div className="w-10 h-10 rounded-full bg-black flex items-center justify-center text-white">
              {(isBoardFlipped ? "W" : "B")}
            </div>
            
            <div className="flex-1">
              <div className="text-sm font-medium">{getOpponentName()}</div>
              {gameState.options.type === 'ai' && (
                <div className="text-xs text-muted-foreground">
                  {gameState.options.difficulty?.charAt(0).toUpperCase() + gameState.options.difficulty?.slice(1)} difficulty
                </div>
              )}
            </div>
            
            {gameState.options.time && (
              <GameTimer
                time={isBoardFlipped ? (gameState.whiteTime || 0) : (gameState.blackTime || 0)}
                isActive={gameState.status === 'active' && gameState.currentTurn === (isBoardFlipped ? 'white' : 'black')}
                playerColor={isBoardFlipped ? 'white' : 'black'}
                onTimeOut={() => handleTimeOut(isBoardFlipped ? 'white' : 'black')}
              />
            )}
          </div>
          
          {/* Chess board */}
          <div className="relative">
            <ChessBoard
              gameState={gameState}
              onMove={handleMove}
              isPlayerTurn={isPlayerTurn() && !viewingPastMove}
              flipped={isBoardFlipped}
            />
            
            {viewingPastMove && (
              <div className="absolute inset-0 bg-black/20 backdrop-blur-sm rounded-lg flex items-center justify-center">
                <Button 
                  onClick={() => setCurrentMoveIndex(gameState.moves.length - 1)}
                  className="animate-fade-up"
                >
                  Return to Current Position
                </Button>
              </div>
            )}
            
            {gameState.status !== 'active' && gameState.status !== 'waiting' && (
              <div className="absolute inset-0 bg-black/40 backdrop-blur-sm rounded-lg flex items-center justify-center">
                <Card className="w-80 animate-fade-up">
                  <CardHeader>
                    <CardTitle>
                      {gameState.status === 'checkmate' ? 'Game Over' : 'Draw'}
                    </CardTitle>
                    <CardDescription>
                      {gameState.status === 'checkmate' 
                        ? `${gameState.currentTurn === 'white' ? 'Black' : 'White'} wins!`
                        : 'The game ended in a draw'}
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <Button 
                      onClick={() => navigate('/')}
                      className="w-full"
                    >
                      Back to Home
                    </Button>
                  </CardContent>
                </Card>
              </div>
            )}
          </div>
          
          {/* Player timer and info */}
          <div className="bg-card rounded-lg p-4 border flex items-center space-x-4">
            <div className="w-10 h-10 rounded-full bg-white border flex items-center justify-center">
              {(isBoardFlipped ? "B" : "W")}
            </div>
            
            <div className="flex-1">
              <div className="text-sm font-medium">You</div>
              <div className="text-xs text-muted-foreground">
                {gameState.status === 'active'
                  ? gameState.currentTurn === (isBoardFlipped ? 'black' : 'white')
                    ? "Your turn"
                    : "Waiting for opponent"
                  : gameState.status === 'waiting'
                  ? "Waiting for opponent to join"
                  : gameState.status === 'checkmate'
                  ? `${gameState.currentTurn === 'white' ? 'Black' : 'White'} won`
                  : "Game drawn"}
              </div>
            </div>
            
            {gameState.options.time && (
              <GameTimer
                time={isBoardFlipped ? (gameState.blackTime || 0) : (gameState.whiteTime || 0)}
                isActive={gameState.status === 'active' && gameState.currentTurn === (isBoardFlipped ? 'black' : 'white')}
                playerColor={isBoardFlipped ? 'black' : 'white'}
                onTimeOut={() => handleTimeOut(isBoardFlipped ? 'black' : 'white')}
              />
            )}
          </div>
          
          {/* Game controls (mobile only) */}
          {isMobile && (
            <div className="bg-card rounded-lg p-4 border">
              <GameControls
                onFlipBoard={handleFlipBoard}
                onShare={handleShare}
                onResign={handleResign}
                onOfferDraw={handleOfferDraw}
                canUndo={gameState.moves.length > 0 && !viewingPastMove}
                onUndo={handleUndo}
                onPrevMove={handlePrevMove}
                onNextMove={handleNextMove}
                shareUrl={getShareableLink(gameId)}
              />
            </div>
          )}
        </div>
        
        {/* Right side: move history and game controls */}
        <div className="space-y-4">
          {/* Move history */}
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-lg">Move History</CardTitle>
            </CardHeader>
            <CardContent>
              <MoveHistory
                moves={gameState.moves}
                currentMoveIndex={currentMoveIndex}
                onSelectMove={handleMoveSelect}
              />
            </CardContent>
          </Card>
          
          {/* Game controls (desktop only) */}
          {!isMobile && (
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-lg">Game Controls</CardTitle>
              </CardHeader>
              <CardContent>
                <GameControls
                  onFlipBoard={handleFlipBoard}
                  onShare={handleShare}
                  onResign={handleResign}
                  onOfferDraw={handleOfferDraw}
                  canUndo={gameState.moves.length > 0 && !viewingPastMove}
                  onUndo={handleUndo}
                  onPrevMove={handlePrevMove}
                  onNextMove={handleNextMove}
                  shareUrl={getShareableLink(gameId)}
                />
              </CardContent>
            </Card>
          )}
        </div>
      </div>
      
      {/* Resign confirmation */}
      <AlertDialog open={isResigning} onOpenChange={setIsResigning}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you sure you want to resign?</AlertDialogTitle>
            <AlertDialogDescription>
              This will end the game and count as a loss.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={confirmResign}>Resign</AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
      
      {/* Draw offer confirmation */}
      <AlertDialog open={isOfferingDraw} onOpenChange={setIsOfferingDraw}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Offer a draw?</AlertDialogTitle>
            <AlertDialogDescription>
              In real multiplayer, this would be sent to your opponent. For this demo, accepting will immediately end the game as a draw.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={confirmDraw}>Offer Draw</AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
