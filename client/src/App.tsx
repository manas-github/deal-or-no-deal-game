import { Switch, Route } from "wouter";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import NotFound from "@/pages/not-found";
import Game from "@/pages/Game";
import { GameProvider } from "@/contexts/GameContext";

function Router() {
  return (
    <Switch>
      <Route path="/" component={Game} />
      <Route component={NotFound} />
    </Switch>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <GameProvider>
          <Toaster />
          <Router />
        </GameProvider>
      </TooltipProvider>
    </QueryClientProvider>
  );
}

export default App;
