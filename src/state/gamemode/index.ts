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

export const gamemodeSlice: Slice<GamemodeState> = (set, get) => ({
  ...initialState,

  setGameMode: (gameMode) => set({ gameMode }),
  startNewGame: () =>
    set({
      gameMode: true,
      gameState: {
        heroes: getHeroesForGameMode(get().roster),
        casualties: 0,
        heroCasualties: 0,
      },
    }),
  updateGameState: (gameStateUpdate) =>
    set({
      gameState: {
        ...get().gameState,
        ...gameStateUpdate,
      },
    }),
});
