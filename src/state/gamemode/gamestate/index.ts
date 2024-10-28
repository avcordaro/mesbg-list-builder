import { GameModeHero } from "../../../components/gamemode/types.ts";
import { Roster } from "../../../types/roster.ts";
import { Slice } from "../../Slice.ts";
import { GameModeState } from "../index.ts";
import { createGameState } from "./create-game-state.ts";

export type Game = {
  heroes: Record<string, GameModeHero[]>;
  casualties: number;
  heroCasualties: number;
};

export type GameState = {
  gameMode: boolean;
  setGameMode: (gameMode: boolean) => void;
  gameState?: Game;
  startNewGame: (roster: Roster) => void;
  updateGameState: (update: Partial<Game>) => void;
};

const initialState = {
  gameMode: false,
  gameState: null,
};

export const gameStateSlice: Slice<GameModeState, GameState> = (set) => ({
  ...initialState,

  setGameMode: (gameMode) => set({ gameMode }, undefined, "SET_GAME_MODE"),
  startNewGame: (roster: Roster) =>
    set(
      () => ({
        gameMode: true,
        gameState: createGameState(roster),
      }),
      undefined,
      "START_GAME",
    ),
  updateGameState: (gameStateUpdate) =>
    set(
      ({ gameState }) => ({
        gameState: {
          ...gameState,
          ...gameStateUpdate,
        },
      }),
      undefined,
      "UPDATE_GAME_STATE",
    ),
});
