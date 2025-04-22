import React, { useState } from "react";
import { useGame } from "@/contexts/GameContext";
import { formatCurrency } from "@/lib/gameUtils";

export default function DepositModal() {
  const { state, dispatch } = useGame();
  const [amount, setAmount] = useState<number>(500); // Default to 500
  const [error, setError] = useState<string | null>(null);

  if (!state.isDepositModalOpen) return null;

  const handleAmountChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = parseInt(e.target.value);
    setAmount(value);

    // Validate amount
    if (isNaN(value) || value < 50 || value > 1000) {
      setError("Please enter an amount between ₹50 and ₹1000");
    } else {
      setError(null);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validate one more time
    if (isNaN(amount) || amount < 50 || amount > 1000) {
      setError("Please enter an amount between ₹50 and ₹1000");
      return;
    }
    
    // Submit the deposit amount
    dispatch({ type: "SET_DEPOSIT", amount });
  };

  // Calculate maximum prize (10x deposit)
  const maxPrize = amount * 10;

  return (
    <div className="fixed inset-0 flex items-center justify-center z-50 modal-overlay bg-black bg-opacity-90">
      <div className="bg-game-blue border-4 border-game-gold rounded-lg max-w-md w-full mx-4 p-8 shadow-2xl transform transition-all">
        <div className="text-center">
          <h2 className="text-3xl font-heading font-extrabold mb-4">INITIAL DEPOSIT</h2>
          <p className="text-gray-300 mb-6">Enter your deposit amount (₹50-₹1000)</p>
          
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-2">
              <div className="relative">
                <span className="absolute left-4 top-1/2 transform -translate-y-1/2 text-xl font-bold">₹</span>
                <input
                  type="number"
                  min="50"
                  max="1000"
                  value={amount}
                  onChange={handleAmountChange}
                  className="w-full bg-black bg-opacity-50 border-2 border-game-gold/50 rounded-lg p-4 pl-10 text-2xl font-bold text-center text-white"
                />
              </div>
              {error && (
                <p className="text-red-500 text-sm">{error}</p>
              )}
            </div>
            
            <div className="bg-black bg-opacity-80 rounded-lg p-4 border border-game-gold/50">
              <p className="text-gray-300 mb-1">Maximum potential prize:</p>
              <p className="text-3xl font-heading font-black text-game-gold">
                {formatCurrency(maxPrize)}
              </p>
              <p className="text-gray-400 text-sm mt-1">(10x your deposit)</p>
            </div>
            
            <button 
              type="submit"
              disabled={!!error}
              className={`w-full ${error ? 'bg-gray-600' : 'bg-game-gold hover:bg-yellow-500'} text-game-blue font-heading font-bold text-xl py-3 px-8 rounded-lg transition mx-auto block`}
            >
              START GAME
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}