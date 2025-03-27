
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { loadPlayerProfile, PlayerProfile, GameHistoryEntry, updatePlayerStats } from "@/utils/storage";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Input } from "@/components/ui/input";
import { toast } from "sonner";
import { format } from "date-fns";

export default function Profile() {
  const [profile, setProfile] = useState<PlayerProfile | null>(null);
  const [isEditingName, setIsEditingName] = useState(false);
  const [newName, setNewName] = useState("");
  const navigate = useNavigate();
  
  useEffect(() => {
    const loadedProfile = loadPlayerProfile();
    setProfile(loadedProfile);
    setNewName(loadedProfile.name);
  }, []);
  
  const handleNameChange = () => {
    if (!profile) return;
    
    if (newName.trim()) {
      const updatedProfile = { ...profile, name: newName.trim() };
      updatePlayerStats('win', 'Test Opponent', 'white', 'test-id', 10);
      
      setProfile(updatedProfile);
      setIsEditingName(false);
      toast.success("Profile name updated");
    } else {
      toast.error("Name cannot be empty");
    }
  };
  
  const formatDate = (dateString: string) => {
    try {
      return format(new Date(dateString), "MMM d, yyyy");
    } catch (error) {
      return "Unknown date";
    }
  };
  
  if (!profile) {
    return (
      <div className="container mx-auto py-10 px-4 flex justify-center">
        <div>Loading profile data...</div>
      </div>
    );
  }
  
  return (
    <div className="container max-w-5xl mx-auto py-10 px-4">
      <div className="grid gap-6 md:grid-cols-3">
        {/* Player info card */}
        <Card className="md:col-span-1">
          <CardHeader>
            <CardTitle>Player Profile</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex flex-col items-center space-y-4">
              <div className="w-24 h-24 rounded-full bg-secondary flex items-center justify-center text-2xl font-medium">
                {profile.name.charAt(0).toUpperCase()}
              </div>
              
              {isEditingName ? (
                <div className="flex w-full max-w-xs">
                  <Input
                    value={newName}
                    onChange={(e) => setNewName(e.target.value)}
                    className="mr-2"
                    autoFocus
                  />
                  <Button onClick={handleNameChange}>Save</Button>
                </div>
              ) : (
                <div className="flex items-center space-x-2">
                  <h2 className="text-xl font-bold">{profile.name}</h2>
                  <Button 
                    variant="ghost" 
                    size="sm" 
                    onClick={() => setIsEditingName(true)}
                    className="h-8 px-2"
                  >
                    Edit
                  </Button>
                </div>
              )}
              
              <div className="w-full grid grid-cols-3 gap-2 mt-4">
                <div className="bg-card border rounded-lg p-3 text-center">
                  <div className="text-xl font-medium">{profile.wins}</div>
                  <div className="text-xs text-muted-foreground">Wins</div>
                </div>
                <div className="bg-card border rounded-lg p-3 text-center">
                  <div className="text-xl font-medium">{profile.losses}</div>
                  <div className="text-xs text-muted-foreground">Losses</div>
                </div>
                <div className="bg-card border rounded-lg p-3 text-center">
                  <div className="text-xl font-medium">{profile.draws}</div>
                  <div className="text-xs text-muted-foreground">Draws</div>
                </div>
              </div>
              
              <div className="w-full bg-card border rounded-lg p-4 mt-4">
                <div className="text-sm font-medium mb-2">Total Games</div>
                <div className="text-3xl font-bold">{profile.gamesPlayed}</div>
              </div>
            </div>
          </CardContent>
        </Card>
        
        {/* Game history card */}
        <Card className="md:col-span-2">
          <CardHeader>
            <CardTitle>Game History</CardTitle>
            <CardDescription>Your recent games</CardDescription>
          </CardHeader>
          <CardContent>
            {profile.history.length === 0 ? (
              <div className="text-center py-8 text-muted-foreground">
                No games played yet.
              </div>
            ) : (
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Date</TableHead>
                    <TableHead>Opponent</TableHead>
                    <TableHead>Played as</TableHead>
                    <TableHead>Result</TableHead>
                    <TableHead>Moves</TableHead>
                    <TableHead></TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {profile.history.map((game, index) => (
                    <TableRow key={index}>
                      <TableCell>{formatDate(game.date)}</TableCell>
                      <TableCell>{game.opponent}</TableCell>
                      <TableCell className="capitalize">{game.playerColor}</TableCell>
                      <TableCell className="capitalize">{game.result}</TableCell>
                      <TableCell>{game.moves}</TableCell>
                      <TableCell>
                        <Button 
                          variant="ghost" 
                          size="sm"
                          onClick={() => navigate(`/game/${game.gameId}`)}
                        >
                          View
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            )}
          </CardContent>
        </Card>
      </div>
      
      {/* Create new game button */}
      <div className="flex justify-center mt-8">
        <Button size="lg" onClick={() => navigate("/")}>
          Start New Game
        </Button>
      </div>
    </div>
  );
}
