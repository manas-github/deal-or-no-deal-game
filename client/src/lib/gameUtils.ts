import type { GameCase } from "@/contexts/GameContext";

// Monetary values used in the game (26 total) - Max ₹1000
export const MONETARY_VALUES = [
  0.1, 0.5, 1, 2, 5, 10, 15, 20, 25, 30, 40, 50, 60, 75, 100, 125, 150, 
  200, 250, 300, 400, 500, 600, 700, 800, 1000
];

// Format currency for display
export function formatCurrency(value: number): string {
  if (value < 1) {
    return `₹${value.toFixed(2)}`;
  }
  return new Intl.NumberFormat('en-IN', { 
    style: 'currency', 
    currency: 'INR',
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

// Create cases with shuffled monetary values scaled to deposit amount
export function shuffleValues(depositAmount?: number): GameCase[] {
  let valuesToUse = [...MONETARY_VALUES];
  
  // If deposit amount is provided, scale values accordingly
  if (depositAmount) {
    // Calculate scaling factor: max prize = 10x deposit
    const maxPrize = depositAmount * 10;
    const scaleFactor = maxPrize / 1000; // 1000 is our default max
    
    // Scale all values proportionally
    valuesToUse = MONETARY_VALUES.map(value => value * scaleFactor);
  }
  
  const shuffledValues = shuffleArray(valuesToUse);
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
  // Starting at ~30% of expected value in erly rounds
  // Moving towards ~95% in later rounds
  const offerPercentage = Math.min(0.2 + (round * 0.1), 0.85);
  
  // Calculate offer
  let offer = Math.round(averageValue * offerPercentage);
  
  // Make sure offer is a "nice" number
  if (offer > 100) {
    // Round to nearest 25
    offer = Math.round(offer / 25) * 25;
  } else if (offer > 20) {
    // Round to nearest 5
    offer = Math.round(offer / 5) * 5;
  } else if (offer > 5) {
    // Round to nearest 2
    offer = Math.round(offer / 2) * 2;
  } else {
    // Keep small offers as they are or round to nearest 0.5
    offer = Math.round(offer * 2) / 2;
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
