import { pgTable, text, serial, integer, boolean, json } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

// Game state table
export const gameStates = pgTable("game_states", {
  id: serial("id").primaryKey(),
  userId: text("user_id").notNull(),
  gameData: json("game_data").notNull(),
  createdAt: text("created_at").notNull(),
  updatedAt: text("updated_at").notNull(),
});

// Game result table for storing completed games
export const gameResults = pgTable("game_results", {
  id: serial("id").primaryKey(),
  userId: text("user_id").notNull(),
  playerCaseValue: integer("player_case_value").notNull(),
  acceptedOffer: integer("accepted_offer"),
  casesOpened: integer("cases_opened").notNull(),
  dealAccepted: boolean("deal_accepted").notNull(),
  createdAt: text("created_at").notNull(),
});

// Insert schemas
export const insertGameStateSchema = createInsertSchema(gameStates).omit({
  id: true,
});

export const insertGameResultSchema = createInsertSchema(gameResults).omit({
  id: true,
});

// Types
export type InsertGameState = z.infer<typeof insertGameStateSchema>;
export type GameState = typeof gameStates.$inferSelect;

export type InsertGameResult = z.infer<typeof insertGameResultSchema>;
export type GameResult = typeof gameResults.$inferSelect;

export const users = pgTable("users", {
  id: serial("id").primaryKey(),
  username: text("username").notNull().unique(),
  password: text("password").notNull(),
});

export const insertUserSchema = createInsertSchema(users).pick({
  username: true,
  password: true,
});

export type InsertUser = z.infer<typeof insertUserSchema>;
export type User = typeof users.$inferSelect;
