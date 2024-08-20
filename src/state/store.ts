import { create } from "zustand";
import { createJSONStorage, persist } from "zustand/middleware";
import { MODAL_KEYS } from "../components/modal/modal-map.tsx";
import { Roster } from "../types/roster.ts";

type ListBuilderStore = {
  roster: Roster;
  setRoster: (roster: Roster) => void;
  gameMode: boolean;
  setGameMode: (gameMode: boolean) => void;

  currentlyOpenendModal: MODAL_KEYS | null;
  setCurrentModal: (key: MODAL_KEYS) => void;
  closeModal: () => void;
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
  currentlyOpenendModal: null,
};

type StoreKey = keyof ListBuilderStore;
const keysToPersist: StoreKey[] = ["roster", "gameMode"];

export const useStore = create<
  ListBuilderStore,
  [["zustand/persist", unknown]]
>(
  persist(
    (set) => ({
      ...initialState,
      setRoster: (roster) =>
        set({
          roster: JSON.parse(JSON.stringify(roster).replaceAll('["",', "[0,")),
        }),
      setGameMode: (gameMode) => set({ gameMode }),
      setCurrentModal: (modal) => set({ currentlyOpenendModal: modal }),
      closeModal: () =>
        set({
          currentlyOpenendModal: null,
        }),
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
