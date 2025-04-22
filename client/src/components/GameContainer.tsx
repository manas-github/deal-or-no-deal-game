import { useEffect } from "react";
import GameStatus from "./GameStatus";
import ValueBoard from "./ValueBoard";
import CasesGrid from "./CasesGrid";
import GameInfo from "./GameInfo";
import BankerOfferModal from "./BankerOfferModal";
import GameOutcomeModal from "./GameOutcomeModal";
import DepositModal from "./DepositModal";
import { useGame } from "@/contexts/GameContext";
import useGameSounds from "@/hooks/useGameSounds";

export default function GameContainer() {
  const { state, dispatch } = useGame();
  const { playSound } = useGameSounds();

  // Reset game on component mount
  useEffect(() => {
    dispatch({ type: "RESET_GAME" });
  }, [dispatch]);

  // Calculate how many cases remain to be opened
  const remainingClosedCases = state.cases.filter(c => !c.isOpen).length - 1; // -1 for player case
  
  // Get value of player's case
  const playerCase = state.cases.find(c => c.isPlayerCase);
  const playerCaseValue = playerCase?.value || 0;
  
  return (
    <div className="container mx-auto px-4 py-8">
      {/* Header */}
      <header className="text-center mb-8">
        <h1 className="text-4xl md:text-6xl font-heading font-extrabold text-game-gold tracking-tight mb-2">
          DEAL <span className="text-white">OR</span> NO DEAL
        </h1>
        <p className="text-lg text-gray-300 max-w-2xl mx-auto">
          Select a case to keep, then eliminate others to reveal the banker's offers!
        </p>
      </header>

      {/* Game Status */}
      <GameStatus 
        currentRound={state.currentRound} 
        selectedCase={state.playerCaseId}
        gameInstruction={state.gameInstruction}
        remainingCases={remainingClosedCases} 
      />

      {/* Main Game Area */}
      <div className="flex flex-col lg:flex-row gap-6">
        {/* Left: Value Board */}
        <ValueBoard cases={state.cases} />
        
        {/* Center: Briefcases Grid */}
        <CasesGrid 
          cases={state.cases}
          gamePhase={state.gamePhase}
          playerCaseId={state.playerCaseId}
          onSelectPlayerCase={(caseId) => {
            dispatch({ type: "SELECT_PLAYER_CASE", caseId });
            playSound("caseOpen");
          }}
          onOpenCase={(caseId) => {
            dispatch({ type: "OPEN_CASE", caseId });
            playSound("caseOpen");
          }}
        />
        
        {/* Right: Game Info and Controls */}
        <GameInfo 
          currentRound={state.currentRound}
          currentOffer={state.bankerOffer}
          roundsConfig={state.roundsConfig} 
          casesOpenedThisRound={state.casesOpenedThisRound}
          gamePhase={state.gamePhase}
          onSkipToOffer={() => {
            dispatch({ type: "SHOW_BANKER_OFFER" });
            playSound("offer");
          }}
        />
      </div>

      {/* Banker Offer Modal */}
      <BankerOfferModal
        isVisible={state.isOfferModalOpen}
        offer={state.bankerOffer || 0}
        onDeal={() => {
          dispatch({ type: "ACCEPT_DEAL" });
          playSound("deal");
        }}
        onNoDeal={() => {
          dispatch({ type: "REJECT_DEAL" });
          playSound("noDeal");
        }}
      />
      
      {/* Game Outcome Modal */}
      <GameOutcomeModal
        isVisible={state.isOutcomeModalOpen}
        playerCaseValue={playerCaseValue}
        acceptedOffer={state.acceptedOffer}
        onPlayAgain={() => {
          dispatch({ type: "RESET_GAME" });
          playSound("winSound");
        }}
      />
      
      {/* Deposit Modal */}
      <DepositModal />
    </div>
  );
}
