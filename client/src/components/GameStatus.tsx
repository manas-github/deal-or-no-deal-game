import React from "react";

type GameStatusProps = {
  currentRound: number;
  selectedCase: number | null;
  gameInstruction: string;
  remainingCases: number;
};

export default function GameStatus({ currentRound, selectedCase, gameInstruction, remainingCases }: GameStatusProps) {
  return (
    <div className="flex flex-col md:flex-row justify-between items-center mb-6 bg-game-blue bg-opacity-40 rounded-lg p-4 border border-game-gold/30">
      <div className="text-center md:text-left mb-4 md:mb-0">
        <h2 className="text-xl font-heading font-bold">
          Round <span className="text-game-gold">{currentRound || 0}</span>
        </h2>
        <p className="text-sm text-gray-300">{gameInstruction}</p>
      </div>
      <div className="flex items-center space-x-6">
        <div className="text-center">
          <p className="text-sm text-gray-300">Your Case</p>
          <div className="bg-game-gold/10 h-16 w-16 rounded-lg flex items-center justify-center border-2 border-game-gold font-heading text-2xl font-bold">
            {selectedCase !== null ? selectedCase : "?"}
          </div>
        </div>
        <div className="text-center">
          <p className="text-sm text-gray-300">Cases Left</p>
          <div className="text-2xl font-heading font-bold text-white">
            {remainingCases}
          </div>
        </div>
      </div>
    </div>
  );
}
