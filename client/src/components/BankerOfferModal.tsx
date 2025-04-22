import React from "react";
import { formatCurrency } from "@/lib/gameUtils";

type BankerOfferModalProps = {
  isVisible: boolean;
  offer: number;
  onDeal: () => void;
  onNoDeal: () => void;
};

export default function BankerOfferModal({ isVisible, offer, onDeal, onNoDeal }: BankerOfferModalProps) {
  if (!isVisible) return null;

  return (
    <div className="fixed inset-0 flex items-center justify-center z-50 modal-overlay bg-black bg-opacity-70">
      <div className="bg-game-blue border-4 border-game-gold rounded-lg max-w-md w-full mx-4 p-6 shadow-2xl transform transition-all">
        <div className="text-center">
          <h2 className="text-3xl font-heading font-extrabold mb-1">BANKER OFFER</h2>
          <p className="text-gray-300 mb-6 text-sm">The banker wants to buy your case!</p>
          
          <div className="bg-black bg-opacity-30 rounded-lg p-6 mb-6 banker-offer-animation animate-pulse">
            <p className="text-5xl font-heading font-black text-game-gold mb-1">
              {formatCurrency(offer)}
            </p>
            <p className="text-gray-400 text-sm">Based on remaining cases</p>
          </div>
          
          <div className="grid grid-cols-2 gap-4">
            <button 
              onClick={onDeal}
              className="bg-deal hover:bg-green-600 text-white font-heading font-bold text-xl py-4 px-6 rounded-lg transition"
            >
              DEAL
            </button>
            <button 
              onClick={onNoDeal}
              className="bg-no-deal hover:bg-red-600 text-white font-heading font-bold text-xl py-4 px-6 rounded-lg transition"
            >
              NO DEAL
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
