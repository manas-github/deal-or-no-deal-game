import React from "react";
import { formatCurrency } from "@/lib/gameUtils";
import type { GameCase } from "@/contexts/GameContext";

// Monetary values used in the game (26 total) - Max ₹1000
const ALL_MONETARY_VALUES = [
  0.1, 0.5, 1, 2, 5, 10, 15, 20, 25, 30, 40, 50, 60, 75, 100, 125, 150, 
  200, 250, 300, 400, 500, 600, 700, 800, 1000
];

type ValueBoardProps = {
  cases: GameCase[];
};

export default function ValueBoard({ cases }: ValueBoardProps) {
  // Find all values that have been revealed
  const eliminatedValues = cases
    .filter(c => c.isOpen)
    .map(c => c.value);

  return (
    <div className="lg:w-1/4 bg-game-blue/20 p-4 rounded-lg border border-blue-800/50 h-auto">
      <h3 className="text-xl font-heading font-bold mb-4 text-center border-b border-blue-700/50 pb-2">Values</h3>
      <div className="grid grid-cols-2 gap-2">
        {ALL_MONETARY_VALUES.map((value) => {
          const isEliminated = eliminatedValues.includes(value);
          const formattedValue = formatCurrency(value);
          
          return (
            <div 
              key={value}
              className={`value-board-item text-center py-2 px-1 bg-game-blue/30 rounded font-bold text-sm ${
                isEliminated ? "eliminated opacity-30 line-through" : ""
              } ${value === 1000 ? "text-game-gold" : ""}`}
            >
              {formattedValue}
            </div>
          );
        })}
      </div>
    </div>
  );
}
