import { create } from "zustand";
import { createJSONStorage, persist } from "zustand/middleware";
import { Roster } from "../types/roster.ts";

type ListBuilderStore = {
  roster: Roster;
  setRoster: (roster: Roster) => void;
};

const initialState: Partial<ListBuilderStore> = {
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
      setRoster: (roster) =>
        set({
          roster: JSON.parse(JSON.stringify(roster).replaceAll('["",', "[0,")),
        }),
    }),
    {
      name: "mesbg-lb-storage",
      storage: createJSONStorage(() => sessionStorage),
    },
  ),
);
