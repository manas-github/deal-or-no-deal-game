import React, { createContext, useContext, useReducer, useEffect } from "react";
import { shuffleValues, calculateBankerOffer, getGameRounds } from "@/lib/gameUtils";

// Type definitions
export type GameCase = {
  id: number;
  value: number;
  isOpen: boolean;
  isPlayerCase: boolean;
};

export type GameState = {
  cases: GameCase[];
  playerCaseId: number | null;
  currentRound: number;
  roundsConfig: { round: number; casesToOpen: number }[];
  casesOpenedThisRound: number;
  gamePhase: "deposit" | "initial" | "selection" | "offer" | "finished";
  bankerOffer: number | null;
  isOfferModalOpen: boolean;
  isOutcomeModalOpen: boolean;
  dealAccepted: boolean;
  acceptedOffer: number | null;
  gameInstruction: string;
  depositAmount: number | null;
  isDepositModalOpen: boolean;
};

type GameAction =
  | { type: "SET_DEPOSIT"; amount: number }
  | { type: "SELECT_PLAYER_CASE"; caseId: number }
  | { type: "OPEN_CASE"; caseId: number }
  | { type: "SHOW_BANKER_OFFER" }
  | { type: "ACCEPT_DEAL" }
  | { type: "REJECT_DEAL" }
  | { type: "SHOW_OUTCOME" }
  | { type: "RESET_GAME" };

// Initial state
const initialState: GameState = {
  cases: [],
  playerCaseId: null,
  currentRound: 0,
  roundsConfig: getGameRounds(),
  casesOpenedThisRound: 0,
  gamePhase: "deposit",
  bankerOffer: null,
  isOfferModalOpen: false,
  isOutcomeModalOpen: false,
  dealAccepted: false,
  acceptedOffer: null,
  gameInstruction: "Please enter your deposit amount",
  depositAmount: null,
  isDepositModalOpen: true,
};

// Reducer function
function gameReducer(state: GameState, action: GameAction): GameState {
  switch (action.type) {
    case "SET_DEPOSIT": {
      // Validate deposit amount (50 to 1000)
      const amount = Math.max(50, Math.min(1000, action.amount));
      
      // Generate cases with values scaled based on deposit amount
      // Max value will be 10x the deposit amount
      const scaledCases = shuffleValues(amount);
      
      return {
        ...state,
        depositAmount: amount,
        isDepositModalOpen: false,
        gamePhase: "initial",
        cases: scaledCases,
        gameInstruction: "Please select your case",
      };
    }
    
    case "SELECT_PLAYER_CASE": {
      const updatedCases = state.cases.map((c) => 
        c.id === action.caseId ? { ...c, isPlayerCase: true } : c
      );
      
      return {
        ...state,
        cases: updatedCases,
        playerCaseId: action.caseId,
        currentRound: 1,
        gamePhase: "selection",
        gameInstruction: `Select ${state.roundsConfig[0].casesToOpen} cases to open`,
      };
    }
    
    case "OPEN_CASE": {
      const updatedCases = state.cases.map((c) => 
        c.id === action.caseId ? { ...c, isOpen: true } : c
      );
      
      const currentRoundConfig = state.roundsConfig[state.currentRound - 1];
      const casesOpenedThisRound = state.casesOpenedThisRound + 1;
      
      // Determine if we should show banker offer
      let newPhase = state.gamePhase;
      let newInstruction = state.gameInstruction;
      let isOfferModalOpen = state.isOfferModalOpen;
      
      if (casesOpenedThisRound >= currentRoundConfig.casesToOpen) {
        newPhase = "offer";
        isOfferModalOpen = true;
      } else {
        const remaining = currentRoundConfig.casesToOpen - casesOpenedThisRound;
        newInstruction = `Select ${remaining} more case${remaining === 1 ? '' : 's'} to open`;
      }

      // Calculate new banker offer
      const closedCases = updatedCases.filter(c => !c.isOpen && !c.isPlayerCase);
      const playerCase = updatedCases.find(c => c.isPlayerCase);
      
      const remainingValues = [
        ...closedCases.map(c => c.value),
        playerCase ? playerCase.value : 0
      ];
      
      const bankerOffer = calculateBankerOffer(remainingValues, state.currentRound);

      return {
        ...state,
        cases: updatedCases,
        casesOpenedThisRound,
        gamePhase: newPhase,
        bankerOffer,
        isOfferModalOpen,
        gameInstruction: newInstruction,
      };
    }
    
    case "SHOW_BANKER_OFFER": {
      return {
        ...state,
        isOfferModalOpen: true,
        gamePhase: "offer",
      };
    }
    
    case "ACCEPT_DEAL": {
      return {
        ...state,
        dealAccepted: true,
        acceptedOffer: state.bankerOffer,
        isOfferModalOpen: false,
        isOutcomeModalOpen: true,
        gamePhase: "finished",
      };
    }
    
    case "REJECT_DEAL": {
      // Move to next round if there are rounds left
      const totalRounds = state.roundsConfig.length;
      let nextRound = state.currentRound;
      let nextPhase = state.gamePhase;
      let newInstruction = "";
      
      // Check if we need to move to the next round
      if (state.currentRound < totalRounds) {
        nextRound = state.currentRound + 1;
        nextPhase = "selection";
        const casesToOpen = state.roundsConfig[nextRound - 1].casesToOpen;
        newInstruction = `Select ${casesToOpen} cases to open`;
      } else {
        // If no more rounds, game is finished
        nextPhase = "finished";
        newInstruction = "Game Over";
      }
      
      return {
        ...state,
        currentRound: nextRound,
        casesOpenedThisRound: 0,
        isOfferModalOpen: false,
        gamePhase: nextPhase,
        gameInstruction: newInstruction,
      };
    }
    
    case "SHOW_OUTCOME": {
      return {
        ...state,
        isOutcomeModalOpen: true,
        gamePhase: "finished",
      };
    }
    
    case "RESET_GAME": {
      // Return to deposit phase when resetting game
      return {
        ...initialState,
        isDepositModalOpen: true,
        gamePhase: "deposit",
        cases: [],
        roundsConfig: getGameRounds(),
      };
    }
    
    default:
      return state;
  }
}

// Context creation
const GameContext = createContext<{
  state: GameState;
  dispatch: React.Dispatch<GameAction>;
}>({
  state: initialState,
  dispatch: () => null,
});

// Provider component
export const GameProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [state, dispatch] = useReducer(gameReducer, {
    ...initialState,
    // Initially, we start without cases until deposit is made
    cases: [],
  });

  // Show final outcome when only 2 cases remain
  useEffect(() => {
    const closedNonPlayerCases = state.cases.filter(c => !c.isOpen && !c.isPlayerCase);
    if (state.playerCaseId && closedNonPlayerCases.length === 1 && !state.dealAccepted && state.gamePhase === "selection") {
      dispatch({ type: "SHOW_OUTCOME" });
    }
  }, [state.cases, state.playerCaseId, state.dealAccepted, state.gamePhase]);

  return (
    <GameContext.Provider value={{ state, dispatch }}>
      {children}
    </GameContext.Provider>
  );
};

// Custom hook
export const useGame = () => useContext(GameContext);
