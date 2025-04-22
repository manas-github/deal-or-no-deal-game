import React from "react";
import { formatCurrency } from "@/lib/gameUtils";
import type { GameCase } from "@/contexts/GameContext";

type CasesGridProps = {
  cases: GameCase[];
  gamePhase: string;
  playerCaseId: number | null;
  onSelectPlayerCase: (caseId: number) => void;
  onOpenCase: (caseId: number) => void;
};

export default function CasesGrid({ 
  cases, 
  gamePhase, 
  playerCaseId, 
  onSelectPlayerCase, 
  onOpenCase 
}: CasesGridProps) {
  const handleCaseClick = (caseItem: GameCase) => {
    // Don't allow interaction with already opened cases
    if (caseItem.isOpen) return;
    
    // Don't allow interaction with player's case during selection phase
    if (caseItem.isPlayerCase && gamePhase === "selection") return;
    
    // Initial phase - selecting player's case
    if (gamePhase === "initial") {
      onSelectPlayerCase(caseItem.id);
      return;
    }
    
    // Selection phase - opening other cases
    if (gamePhase === "selection" && !caseItem.isPlayerCase) {
      onOpenCase(caseItem.id);
      return;
    }
  };

  return (
    <div className="lg:w-1/2 bg-game-blue/10 rounded-lg p-4 border border-blue-900/30">
      <h3 className="text-xl font-heading font-bold mb-4 text-center">
        {gamePhase === "initial" ? "Select Your Case" : "Select a Case"}
      </h3>
      <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-5 lg:grid-cols-6 xl:grid-cols-7 gap-3 md:gap-4">
        {cases.map((caseItem) => {
          let caseClassName = "case aspect-square rounded-md flex flex-col items-center justify-center shadow-md transition";
          
          if (caseItem.isPlayerCase) {
            caseClassName += " player-case bg-game-gold text-game-blue border-2 border-yellow-500";
          } else if (caseItem.isOpen) {
            caseClassName += " opened bg-gray-700 border-2 border-gray-600";
          } else {
            caseClassName += " bg-game-blue cursor-pointer border-2 border-blue-700";
            // Only add hover effects to interactable cases
            if ((gamePhase === "initial") || (gamePhase === "selection" && !caseItem.isPlayerCase)) {
              caseClassName += " hover:transform hover:-translate-y-1 hover:shadow-lg";
            }
          }
          
          return (
            <div
              key={caseItem.id}
              className={caseClassName}
              onClick={() => handleCaseClick(caseItem)}
            >
              <span className="text-xl font-heading font-extrabold">{caseItem.id}</span>
              {caseItem.isOpen && (
                <span className="text-xs font-bold text-game-gold">
                  {formatCurrency(caseItem.value)}
                </span>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
