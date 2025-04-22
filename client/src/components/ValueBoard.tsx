import React from "react";
import { formatCurrency } from "@/lib/gameUtils";
import type { GameCase } from "@/contexts/GameContext";

// Monetary values used in the game (26 total)
const ALL_MONETARY_VALUES = [
  0.01, 1, 5, 10, 25, 50, 75, 100, 200, 300, 400, 500, 750, 1000, 5000, 10000, 25000, 
  50000, 75000, 100000, 200000, 300000, 400000, 500000, 750000, 1000000
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
              } ${value === 1000000 ? "text-game-gold" : ""}`}
            >
              {formattedValue}
            </div>
          );
        })}
      </div>
    </div>
  );
}
