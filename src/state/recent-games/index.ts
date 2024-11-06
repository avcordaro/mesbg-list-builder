import { create } from "zustand";
import { createJSONStorage, devtools, persist } from "zustand/middleware";
import { GameHistoryState, historySlice } from "./history";

export type RecentGamesState = GameHistoryState;

export const useRecentGamesState = create<
  RecentGamesState,
  [["zustand/devtools", unknown], ["zustand/persist", unknown]]
>(
  devtools(
    persist(
      (...args) => ({
        ...historySlice(...args),
      }),
      {
        name: "mlb-recent-games",
        storage: createJSONStorage(() => localStorage),
      },
    ),
  ),
);
