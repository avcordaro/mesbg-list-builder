import { create } from "zustand";
import { createJSONStorage, persist } from "zustand/middleware";
import { AlertTypes } from "../components/alerts/alert-types.tsx";
import { GameModeState } from "../components/gamemode/types.ts";
import { MODAL_KEYS } from "../components/modal/modals.tsx";
import { Roster } from "../types/roster.ts";
import { getHeroesForGameMode } from "./gamemode.ts";

type ListBuilderStore = {
  roster: Roster;
  setRoster: (roster: Roster) => void;

  gameMode: boolean;
  setGameMode: (gameMode: boolean) => void;
  gameState?: GameModeState;
  startNewGame: () => void;
  updateGameState: (update: Partial<GameModeState>) => void;

  currentlyOpenendModal: MODAL_KEYS | null;
  modelContext?: any; // eslint-disable-line @typescript-eslint/no-explicit-any
  setCurrentModal: (key: MODAL_KEYS, context?: unknown) => void;
  closeModal: () => void;

  activeAlert: AlertTypes;
  triggerAlert: (alert: AlertTypes) => void;
  dismissAlert: () => void;
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
  gameState: undefined,
  currentlyOpenendModal: null,
  activeAlert: null,
};

type StoreKey = keyof ListBuilderStore;
const keysToPersist: StoreKey[] = ["roster", "gameMode", "gameState"];

export const useStore = create<
  ListBuilderStore,
  [["zustand/persist", unknown]]
>(
  persist(
    (set, get) => ({
      ...initialState,
      setRoster: (roster) =>
        set({
          roster: JSON.parse(JSON.stringify(roster).replaceAll('["",', "[0,")),
        }),
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

      setCurrentModal: (modal, context) =>
        set({ currentlyOpenendModal: modal, modelContext: context }),
      closeModal: () =>
        set({
          currentlyOpenendModal: null,
          modelContext: null,
        }),

      triggerAlert: (alert) => set({ activeAlert: alert }),
      dismissAlert: () => set({ activeAlert: null }),
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
