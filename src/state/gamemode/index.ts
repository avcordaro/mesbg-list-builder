import { GameModeHero } from "../../components/gamemode/types.ts";
import { Slice } from "../Slice.ts";
import { AppState } from "../store.ts";
import { createGameState } from "./gamemode.ts";

export type GameState = {
  heroes: Record<string, GameModeHero[]>;
  casualties: number;
  heroCasualties: number;
};

export type GamemodeState = {
  gameMode: boolean;
  setGameMode: (gameMode: boolean) => void;
  gameState?: GameState;
  startNewGame: () => void;
  updateGameState: (update: Partial<GameState>) => void;
};

const initialState = {
  gameMode: false,
  gameState: null,
};

export const gamemodeSlice: Slice<AppState, GamemodeState> = (set) => ({
  ...initialState,

  setGameMode: (gameMode) => set({ gameMode }, undefined, "SET_GAME_MODE"),
  startNewGame: () =>
    set(
      ({ roster }) => ({
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
