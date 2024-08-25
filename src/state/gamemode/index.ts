import { GameModeHero } from "../../components/gamemode/types.ts";
import { Slice } from "../store.ts";
import { getHeroesForGameMode } from "./gamemode.ts";

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

export const gamemodeSlice: Slice<GamemodeState> = (set) => ({
  ...initialState,

  setGameMode: (gameMode) => set({ gameMode }, undefined, "SET_GAME_MODE"),
  startNewGame: () =>
    set(
      ({ roster }) => ({
        gameMode: true,
        gameState: {
          heroes: getHeroesForGameMode(roster),
          casualties: 0,
          heroCasualties: 0,
        },
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
