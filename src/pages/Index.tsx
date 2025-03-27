
import { useEffect } from "react";
import CreateGameForm from "@/components/CreateGameForm";

export default function Index() {
  // Add subtle page entry animation
  useEffect(() => {
    document.body.classList.add("animate-fade-in");
    
    return () => {
      document.body.classList.remove("animate-fade-in");
    };
  }, []);
  
  return (
    <div className="container max-w-5xl mx-auto py-10 px-4 sm:px-6">
      <div className="text-center mb-10">
        <h1 className="text-4xl font-bold tracking-tight mb-2">
          ChessLink
        </h1>
        <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
          Play chess with friends online, challenge the computer, or improve your skills with timed matches
        </p>
      </div>
      
      <CreateGameForm />
      
      <div className="mt-16 grid gap-8 md:grid-cols-3">
        <div className="bg-card rounded-lg p-6 border">
          <div className="text-lg font-medium mb-2">Play Anywhere</div>
          <p className="text-muted-foreground">
            Create a game and share the link with your friend to play from any device
          </p>
        </div>
        
        <div className="bg-card rounded-lg p-6 border">
          <div className="text-lg font-medium mb-2">Track Progress</div>
          <p className="text-muted-foreground">
            Keep a record of your games, review your matches, and improve your rating
          </p>
        </div>
        
        <div className="bg-card rounded-lg p-6 border">
          <div className="text-lg font-medium mb-2">Challenge AI</div>
          <p className="text-muted-foreground">
            Practice against different difficulty levels to sharpen your skills
          </p>
        </div>
      </div>
    </div>
  );
}
