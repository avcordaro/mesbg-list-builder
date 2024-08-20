import { create } from "zustand";
import { createJSONStorage, persist } from "zustand/middleware";
import { Roster } from "../types/roster.ts";

type ListBuilderStore = {
  roster: Roster;
};

const initialState: ListBuilderStore = {
  roster: {
    version: BUILD_VERSION,
    num_units: 0,
    points: 0,
    bow_count: 0,
    warbands: [],
  },
};

export const useStore = create<
  ListBuilderStore,
  [["zustand/persist", unknown]]
>(
  persist(
    (set) => ({
      roster: initialState.roster,
      setRoster: (roster) => set({ roster }),
    }),
    {
      name: "mesbg-lb-storage",
      storage: createJSONStorage(() => sessionStorage),
    },
  ),
);
