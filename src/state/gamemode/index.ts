import { create } from "zustand";
import { createJSONStorage, devtools, persist } from "zustand/middleware";
import { gameStateSlice, GameState } from "./gamestate";

export type GameModeState = GameState;

export const useGameModeState = create<
  GameModeState,
  [["zustand/devtools", unknown], ["zustand/persist", unknown]]
>(
  devtools(
    persist(
      (...args) => ({
        ...gameStateSlice(...args),
      }),
      {
        name: "mlb-gamestate-default",
        storage: createJSONStorage(() => sessionStorage),
      },
    ),
  ),
);
