import { create } from "zustand";
import { createJSONStorage, persist } from "zustand/middleware";
import { Roster } from "../types/roster.ts";

type ListBuilderStore = {
  roster: Roster;
  setRoster: (roster: Roster) => void;
  gameMode: boolean;
  setGameMode: (gameMode: boolean) => void;
};

const initialState = {
  roster: {
    version: BUILD_VERSION,
    num_units: 0,
    points: 0,
    bow_count: 0,
    warbands: [],
  },
  gameMode: false,
};

type StoreKey = keyof ListBuilderStore;
const keysToPersist: StoreKey[] = ["roster", "gameMode"];

export const useStore = create<
  ListBuilderStore,
  [["zustand/persist", unknown]]
>(
  persist(
    (set) => ({
      roster: initialState.roster,
      setRoster: (roster) =>
        set({
          roster: JSON.parse(JSON.stringify(roster).replaceAll('["",', "[0,")),
        }),
      gameMode: initialState.gameMode,
      setGameMode: (gameMode) => set({ gameMode }),
    }),
    {
      name: "mesbg-lb-storage",
      storage: createJSONStorage(() => sessionStorage),
      partialize: (state) =>
        Object.fromEntries(
          Object.entries(state).filter((stateEntry) =>
            keysToPersist.includes(stateEntry[0] as StoreKey),
          ),
        ),
    },
  ),
);
