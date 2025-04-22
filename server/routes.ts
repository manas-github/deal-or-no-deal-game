import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";

export async function registerRoutes(app: Express): Promise<Server> {
  // API route for saving game state
  app.post("/api/game/save", async (req, res) => {
    try {
      const { userId, gameData } = req.body;
      
      if (!userId || !gameData) {
        return res.status(400).json({ message: "Missing required fields" });
      }
      
      const currentTime = new Date().toISOString();
      const savedState = await storage.saveGameState({
        userId,
        gameData,
        createdAt: currentTime,
        updatedAt: currentTime
      });
      
      res.status(200).json(savedState);
    } catch (error) {
      console.error("Error saving game state:", error);
      res.status(500).json({ message: "Failed to save game state" });
    }
  });

  // API route for retrieving game state
  app.get("/api/game/:userId", async (req, res) => {
    try {
      const { userId } = req.params;
      const gameState = await storage.getGameState(userId);
      
      if (!gameState) {
        return res.status(404).json({ message: "Game state not found" });
      }
      
      res.status(200).json(gameState);
    } catch (error) {
      console.error("Error retrieving game state:", error);
      res.status(500).json({ message: "Failed to retrieve game state" });
    }
  });

  // API route for saving game results
  app.post("/api/game/results", async (req, res) => {
    try {
      const { userId, playerCaseValue, acceptedOffer, casesOpened, dealAccepted } = req.body;
      
      if (!userId || playerCaseValue === undefined || casesOpened === undefined || dealAccepted === undefined) {
        return res.status(400).json({ message: "Missing required fields" });
      }
      
      const gameResult = await storage.saveGameResult({
        userId,
        playerCaseValue,
        acceptedOffer,
        casesOpened,
        dealAccepted,
        createdAt: new Date().toISOString()
      });
      
      res.status(200).json(gameResult);
    } catch (error) {
      console.error("Error saving game result:", error);
      res.status(500).json({ message: "Failed to save game result" });
    }
  });

  // API route for retrieving game statistics
  app.get("/api/game/stats/:userId", async (req, res) => {
    try {
      const { userId } = req.params;
      const gameStats = await storage.getGameStats(userId);
      
      res.status(200).json(gameStats);
    } catch (error) {
      console.error("Error retrieving game statistics:", error);
      res.status(500).json({ message: "Failed to retrieve game statistics" });
    }
  });

  const httpServer = createServer(app);
  return httpServer;
}
