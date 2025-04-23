import React from "react";
import { formatCurrency, MONETARY_VALUES } from "@/lib/gameUtils";
import type { GameCase } from "@/contexts/GameContext";
import { useGame } from "@/contexts/GameContext";

type ValueBoardProps = {
  cases: GameCase[];
};

export default function ValueBoard({ cases }: ValueBoardProps) {
  const { state } = useGame();
  const { depositAmount } = state;
  
  // Calculate max value (10x deposit) and scale factor
  const maxValue = depositAmount ? depositAmount * 5 : 1000;
  const scaleFactor = maxValue / 1000;
  
  // Scale the values based on deposit amount
  const scaledValues = MONETARY_VALUES.map(value => value * scaleFactor);
  
  // Find all values that have been revealed
  const eliminatedValues = cases
    .filter(c => c.isOpen)
    .map(c => c.value);

  return (
    <div className="lg:w-1/4 bg-game-blue/20 p-4 rounded-lg border border-blue-800/50 h-auto">
      <h3 className="text-xl font-heading font-bold mb-4 text-center border-b border-blue-700/50 pb-2">Values</h3>
      <div className="grid grid-cols-2 gap-2">
        {scaledValues.map((value) => {
          // Find the closest eliminated value (since floating point comparison might not be exact)
          const isEliminated = eliminatedValues.some(elimValue => 
            Math.abs(elimValue - value) < 0.01
          );
          const formattedValue = formatCurrency(value);
          
          return (
            <div 
              key={value}
              className={`value-board-item text-center py-2 px-1 bg-game-blue/30 rounded font-bold text-sm ${
                isEliminated ? "eliminated opacity-30 line-through" : ""
              } ${Math.abs(value - maxValue) < 0.01 ? "text-game-gold" : ""}`}
            >
              {formattedValue}
            </div>
          );
        })}
      </div>
    </div>
  );
}
