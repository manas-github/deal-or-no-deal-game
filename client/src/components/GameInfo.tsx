import React from "react";
import { Button } from "@/components/ui/button";
import { formatCurrency } from "@/lib/gameUtils";

type GameInfoProps = {
  currentRound: number;
  currentOffer: number | null;
  roundsConfig: { round: number; casesToOpen: number }[];
  casesOpenedThisRound: number;
  gamePhase: string;
  onSkipToOffer: () => void;
};

export default function GameInfo({ 
  currentRound, 
  currentOffer, 
  roundsConfig, 
  casesOpenedThisRound,
  gamePhase,
  onSkipToOffer 
}: GameInfoProps) {
  // Calculate how many cases need to be opened in current round
  const currentRoundConfig = roundsConfig.find(r => r.round === currentRound);
  const casesToOpenThisRound = currentRoundConfig?.casesToOpen || 0;
  const remainingToOpen = casesToOpenThisRound - casesOpenedThisRound;

  // Format the current offer for display
  const formattedOffer = currentOffer ? formatCurrency(currentOffer) : "--";

  return (
    <div className="lg:w-1/4 bg-game-blue/20 p-4 rounded-lg border border-blue-800/50 flex flex-col">
      <h3 className="text-xl font-heading font-bold mb-4 text-center border-b border-blue-700/50 pb-2">Game Info</h3>
      
      <div className="flex-1 mb-4">
        <div className="mb-4">
          <p className="text-sm text-gray-300 mb-1">Current Round</p>
          <p className="text-xl font-bold">{currentRound || 0}</p>
        </div>
        {gamePhase === "selection" && (
          <div className="mb-4">
            <p className="text-sm text-gray-300 mb-1">Cases to Open This Round</p>
            <p className="text-xl font-bold">{remainingToOpen}</p>
          </div>
        )}
        <div className="mb-4">
          <p className="text-sm text-gray-300 mb-1">Last Offer</p>
          <p className="text-xl font-bold text-game-gold">{formattedOffer}</p>
        </div>
      </div>
      
      <div className="mt-auto">
        {/* Only visible when player has selected their case and there are cases to open */}
        {gamePhase === "selection" && casesOpenedThisRound > 0 && remainingToOpen > 0 && (
          <Button
            onClick={onSkipToOffer}
            className="w-full bg-blue-800 hover:bg-blue-700 text-white font-bold py-3 px-4 rounded-lg mb-3 transition"
          >
            Skip to Banker Offer
          </Button>
        )}
        <div className="text-center text-sm text-gray-400 mt-2">
          {gamePhase === "initial" && "Select a case to start the game!"}
          {gamePhase === "selection" && "Select cases to eliminate until the banker makes you an offer!"}
          {gamePhase === "offer" && "Will you take the banker's offer?"}
          {gamePhase === "finished" && "Game over! Thanks for playing!"}
        </div>
      </div>
    </div>
  );
}
