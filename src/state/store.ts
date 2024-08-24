import { create } from "zustand";
import { createJSONStorage, devtools, persist } from "zustand/middleware";
import { alertSlice, AlertState } from "./alert";
import { gamemodeSlice, GamemodeState } from "./gamemode";
import { modalSlice, ModalState } from "./modal";
import { getStateToPersist } from "./persistence.ts";
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

export const useStore = create<
  AppState,
  [["zustand/devtools", unknown], ["zustand/persist", unknown]]
>(
  devtools(
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
        partialize: (state) => getStateToPersist(state),
      },
    ),
  ),
);
