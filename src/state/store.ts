import { create } from "zustand";
import { createJSONStorage, persist } from "zustand/middleware";
import { AlertTypes } from "../components/alerts/alert-types.tsx";
import { AllianceLevel } from "../components/constants/alliances.ts";
import { GameModeState } from "../components/gamemode/types.ts";
import { MODAL_KEYS } from "../components/modal/modals.tsx";
import { Faction, FactionType } from "../types/factions.ts";
import { Roster } from "../types/roster.ts";
import { getHeroesForGameMode } from "./gamemode/gamemode.ts";
import { ModelCountData } from "./roster/models.ts";
import { updateRoster } from "./roster/roster.ts";

export type ListBuilderStore = {
  // Roster Building
  roster: Roster;
  setRoster: (roster: Roster) => void;
  factionType: FactionType | "";
  factions: Faction[];
  factionMetaData: ModelCountData;
  allianceLevel: AllianceLevel;
  armyBonusActive: boolean;
  uniqueModels: string[];
  rosterBuildingWarnings: string[];
  // Game mode
  gameMode: boolean;
  setGameMode: (gameMode: boolean) => void;
  gameState?: GameModeState;
  startNewGame: () => void;
  updateGameState: (update: Partial<GameModeState>) => void;
  // Modals
  currentlyOpenendModal: MODAL_KEYS | null;
  modelContext?: any; // eslint-disable-line @typescript-eslint/no-explicit-any
  setCurrentModal: (key: MODAL_KEYS, context?: unknown) => void;
  closeModal: () => void;
  // Alerts
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
  factions: [],
  factionType: "" as FactionType,
  factionMetaData: {} as ModelCountData,
  allianceLevel: "n/a" as AllianceLevel,
  armyBonusActive: true,
  uniqueModels: [],
  rosterBuildingWarnings: [],
  gameMode: false,
  gameState: undefined,
  currentlyOpenendModal: null,
  activeAlert: null,
};

type StoreKey = keyof ListBuilderStore;
const keysToPersist: StoreKey[] = [
  "roster",
  "gameMode",
  "gameState",
  "factions",
  "factionType",
  "factionMetaData",
  "allianceLevel",
  "uniqueModels",
  "rosterBuildingWarnings",
  "armyBonusActive",
];

export const useStore = create<
  ListBuilderStore,
  [["zustand/persist", unknown]]
>(
  persist(
    (set, get) => ({
      ...initialState,
      setRoster: (roster) =>
        set({
          ...updateRoster(roster),
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
