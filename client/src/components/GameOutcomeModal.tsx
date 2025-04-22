import React from "react";
import { formatCurrency } from "@/lib/gameUtils";

type GameOutcomeModalProps = {
  isVisible: boolean;
  playerCaseValue: number;
  acceptedOffer: number | null;
  onPlayAgain: () => void;
};

export default function GameOutcomeModal({ 
  isVisible, 
  playerCaseValue, 
  acceptedOffer, 
  onPlayAgain 
}: GameOutcomeModalProps) {
  if (!isVisible) return null;
  
  // Calculate outcome message
  let outcomeMessage;
  if (acceptedOffer !== null) {
    const difference = playerCaseValue - acceptedOffer;
    if (difference > 0) {
      outcomeMessage = (
        <>
          <p className="text-xl mb-1">You could have won {formatCurrency(difference)} more!</p>
          <p className="text-lg text-gray-300">Better luck next time!</p>
        </>
      );
    } else if (difference < 0) {
      outcomeMessage = (
        <>
          <p className="text-xl mb-1">You got {formatCurrency(Math.abs(difference))} more than your case!</p>
          <p className="text-lg text-gray-300">Great deal!</p>
        </>
      );
    } else {
      outcomeMessage = (
        <>
          <p className="text-xl mb-1">You accepted exactly what your case was worth!</p>
          <p className="text-lg text-gray-300">Perfect balance!</p>
        </>
      );
    }
  } else {
    outcomeMessage = (
      <>
        <p className="text-xl mb-1">You kept your case to the end!</p>
        <p className="text-lg text-gray-300">Hope it was worth it!</p>
      </>
    );
  }

  return (
    <div className="fixed inset-0 flex items-center justify-center z-50 modal-overlay bg-black bg-opacity-90">
      <div className="bg-game-blue border-4 border-game-gold rounded-lg max-w-md w-full mx-4 p-6 shadow-2xl transform transition-all">
        <div className="text-center">
          <h2 className="text-3xl font-heading font-extrabold mb-2">GAME OVER</h2>
          <p className="text-gray-300 mb-6">Here's how you did!</p>
          
          <div className="space-y-6 mb-6">
            <div className="bg-black bg-opacity-80 rounded-lg p-5 border border-game-gold/50">
              <p className="text-xl mb-1">Your Case Contained:</p>
              <p className="text-4xl font-heading font-black text-game-gold">
                {formatCurrency(playerCaseValue)}
              </p>
            </div>
            
            {acceptedOffer !== null && (
              <div className="bg-black bg-opacity-80 rounded-lg p-5 border border-game-gold/50 my-4">
                <p className="text-xl mb-1">You Accepted:</p>
                <p className="text-4xl font-heading font-black text-game-gold">
                  {formatCurrency(acceptedOffer)}
                </p>
              </div>
            )}
            
            <div className="bg-black bg-opacity-70 rounded-lg p-4">
              {outcomeMessage}
            </div>
          </div>
          
          <button 
            onClick={onPlayAgain}
            className="bg-game-gold hover:bg-yellow-500 text-game-blue font-heading font-bold text-xl py-3 px-8 rounded-lg transition mx-auto block"
          >
            PLAY AGAIN
          </button>
        </div>
      </div>
    </div>
  );
}
