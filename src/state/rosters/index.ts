import { create } from "zustand";
import { createJSONStorage, devtools, persist } from "zustand/middleware";
import { activeRoster, ActiveRosterState } from "./active-roster";
import { savedRosters, SavedRosterState } from "./saved-roster";

export const useSavedRostersState = create<
  SavedRosterState,
  [["zustand/devtools", unknown], ["zustand/persist", unknown]]
>(
  devtools(
    persist(
      (...args) => ({
        ...savedRosters(...args),
      }),
      {
        name: "mlb-rosters",
        storage: createJSONStorage(() => localStorage),
      },
    ),
  ),
);

export const useCurrentRosterState = create<
  ActiveRosterState,
  [["zustand/devtools", unknown], ["zustand/persist", unknown]]
>(
  devtools(
    persist(
      (...args) => ({
        ...activeRoster(...args),
      }),
      {
        name: "mlb-active-roster",
        storage: createJSONStorage(() => sessionStorage),
      },
    ),
  ),
);
