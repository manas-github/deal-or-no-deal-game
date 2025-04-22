import type { GameCase } from "@/contexts/GameContext";

// Monetary values used in the game (26 total)
export const MONETARY_VALUES = [
  0.01, 1, 5, 10, 25, 50, 75, 100, 200, 300, 400, 500, 750, 1000, 5000, 10000, 25000, 
  50000, 75000, 100000, 200000, 300000, 400000, 500000, 750000, 1000000
];

// Format currency for display
export function formatCurrency(value: number): string {
  if (value < 1) {
    return `$${value.toFixed(2)}`;
  }
  return new Intl.NumberFormat('en-US', { 
    style: 'currency', 
    currency: 'USD',
    maximumFractionDigits: 0
  }).format(value);
}

// Fisher-Yates shuffle algorithm
function shuffleArray<T>(array: T[]): T[] {
  const result = [...array];
  for (let i = result.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [result[i], result[j]] = [result[j], result[i]];
  }
  return result;
}

// Create cases with shuffled monetary values
export function shuffleValues(): GameCase[] {
  const shuffledValues = shuffleArray(MONETARY_VALUES);
  return Array.from({ length: 26 }, (_, i) => ({
    id: i + 1,
    value: shuffledValues[i],
    isOpen: false,
    isPlayerCase: false
  }));
}

// Calculate banker's offer based on expected value and round number
export function calculateBankerOffer(remainingValues: number[], round: number): number {
  // Calculate expected value (average) of remaining values
  const totalValue = remainingValues.reduce((sum, val) => sum + val, 0);
  const averageValue = totalValue / remainingValues.length;
  
  // Banker offer percentage increases as game progresses
  // Starting at ~30% of expected value in early rounds
  // Moving towards ~95% in later rounds
  const offerPercentage = Math.min(0.3 + (round * 0.1), 0.95);
  
  // Calculate offer
  let offer = Math.round(averageValue * offerPercentage);
  
  // Make sure offer is a "nice" number
  if (offer > 100) {
    // Round to nearest 100
    offer = Math.round(offer / 100) * 100;
  } else if (offer > 10) {
    // Round to nearest 10
    offer = Math.round(offer / 10) * 10;
  }
  
  return offer;
}

// Game rounds configuration
export function getGameRounds() {
  return [
    { round: 1, casesToOpen: 6 },
    { round: 2, casesToOpen: 5 },
    { round: 3, casesToOpen: 4 },
    { round: 4, casesToOpen: 3 },
    { round: 5, casesToOpen: 2 },
    { round: 6, casesToOpen: 1 },
    { round: 7, casesToOpen: 1 },
    { round: 8, casesToOpen: 1 },
    { round: 9, casesToOpen: 1 },
    { round: 10, casesToOpen: 1 }
  ];
}
