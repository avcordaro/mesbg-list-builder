import { create } from "zustand";
import { createJSONStorage, persist } from "zustand/middleware";
import { alertSlice, AlertState } from "./alert";
import { gamemodeSlice, GamemodeState } from "./gamemode";
import { modalSlice, ModalState } from "./modal";
import { rosterSlice, RosterState } from "./roster";
import { sidebarSlice, SidebarState } from "./sidebar";

export type AppState = RosterState &
  GamemodeState &
  ModalState &
  SidebarState &
  AlertState;

export type SliceSet<T> = (state: Partial<T>) => void;
export type SliceGet = () => AppState;
export type Slice<T> = (set: SliceSet<T>, get?: SliceGet) => T;

type StoreKey = keyof AppState;
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

export const useStore = create<AppState, [["zustand/persist", unknown]]>(
  persist(
    (set, get) => ({
      ...modalSlice(set),
      ...sidebarSlice(set),
      ...alertSlice(set),
      ...gamemodeSlice(set, get),
      ...rosterSlice(set),
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
