import { 
  type GameState, 
  type InsertGameState,
  type GameResult,
  type InsertGameResult,
  type User, 
  type InsertUser
} from "@shared/schema";

// Storage interface
export interface IStorage {
  getUser(id: number): Promise<User | undefined>;
  getUserByUsername(username: string): Promise<User | undefined>;
  createUser(user: InsertUser): Promise<User>;
  
  // Game state methods
  saveGameState(state: Omit<InsertGameState, "id">): Promise<GameState>;
  getGameState(userId: string): Promise<GameState | undefined>;
  
  // Game results methods
  saveGameResult(result: Omit<InsertGameResult, "id">): Promise<GameResult>;
  getGameResults(userId: string): Promise<GameResult[]>;
  getGameStats(userId: string): Promise<{ 
    gamesPlayed: number;
    dealsAccepted: number;
    highestWin: number;
    averageWin: number;
  }>;
}

// In-memory storage implementation
export class MemStorage implements IStorage {
  private users: Map<number, User>;
  private gameStates: Map<string, GameState>;
  private gameResults: GameResult[];
  private userIdCounter: number;
  private gameStateIdCounter: number;
  private gameResultIdCounter: number;

  constructor() {
    this.users = new Map();
    this.gameStates = new Map();
    this.gameResults = [];
    this.userIdCounter = 1;
    this.gameStateIdCounter = 1;
    this.gameResultIdCounter = 1;
  }

  // User methods
  async getUser(id: number): Promise<User | undefined> {
    return this.users.get(id);
  }

  async getUserByUsername(username: string): Promise<User | undefined> {
    return Array.from(this.users.values()).find(
      (user) => user.username === username,
    );
  }

  async createUser(insertUser: InsertUser): Promise<User> {
    const id = this.userIdCounter++;
    const user: User = { ...insertUser, id };
    this.users.set(id, user);
    return user;
  }

  // Game state methods
  async saveGameState(state: Omit<InsertGameState, "id">): Promise<GameState> {
    const id = this.gameStateIdCounter++;
    const gameState: GameState = { ...state, id };
    
    // Store by userId for easy lookup
    this.gameStates.set(state.userId, gameState);
    
    return gameState;
  }

  async getGameState(userId: string): Promise<GameState | undefined> {
    return this.gameStates.get(userId);
  }

  // Game results methods
  async saveGameResult(result: Omit<InsertGameResult, "id">): Promise<GameResult> {
    const id = this.gameResultIdCounter++;
    const gameResult: GameResult = { ...result, id };
    
    this.gameResults.push(gameResult);
    
    return gameResult;
  }

  async getGameResults(userId: string): Promise<GameResult[]> {
    return this.gameResults.filter(result => result.userId === userId);
  }

  async getGameStats(userId: string): Promise<{ 
    gamesPlayed: number; 
    dealsAccepted: number; 
    highestWin: number; 
    averageWin: number; 
  }> {
    const userResults = await this.getGameResults(userId);
    
    if (userResults.length === 0) {
      return {
        gamesPlayed: 0,
        dealsAccepted: 0,
        highestWin: 0,
        averageWin: 0
      };
    }
    
    const gamesPlayed = userResults.length;
    const dealsAccepted = userResults.filter(r => r.dealAccepted).length;
    
    // Calculate wins (where accepted offer > player case value or player kept the case)
    const wins = userResults.map(r => {
      if (r.dealAccepted && r.acceptedOffer !== null) {
        return r.acceptedOffer - r.playerCaseValue;
      }
      return 0; // If they kept their case, neutral outcome
    });
    
    const highestWin = Math.max(...wins, 0);
    const averageWin = wins.length > 0 
      ? wins.reduce((sum, win) => sum + win, 0) / wins.length 
      : 0;
    
    return {
      gamesPlayed,
      dealsAccepted,
      highestWin,
      averageWin
    };
  }
}

export const storage = new MemStorage();
