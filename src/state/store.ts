import { create, StateCreator } from "zustand";
import { createJSONStorage, devtools, persist } from "zustand/middleware";
import { alertSlice, AlertState } from "./alert";
import { builderSlice, BuilderState } from "./builder-selection";
import { dragAndDropSlice, DragAndDropState } from "./drag-and-drop";
import { gamemodeSlice, GamemodeState } from "./gamemode";
import { modalSlice, ModalState } from "./modal";
import { getStateToPersist } from "./persistence.ts";
import { rosterSlice, RosterState } from "./roster";
import { sidebarSlice, SidebarState } from "./sidebar";

export type AppState = RosterState &
  GamemodeState &
  ModalState &
  SidebarState &
  AlertState &
  BuilderState &
  DragAndDropState;

export type Slice<T> = StateCreator<
  AppState,
  [["zustand/devtools", unknown], ["zustand/persist", unknown]],
  [],
  T
>;

export const useStore = create<
  AppState,
  [["zustand/devtools", unknown], ["zustand/persist", unknown]]
>(
  devtools(
    persist(
      (...args) => ({
        ...modalSlice(...args),
        ...sidebarSlice(...args),
        ...alertSlice(...args),
        ...gamemodeSlice(...args),
        ...rosterSlice(...args),
        ...builderSlice(...args),
        ...dragAndDropSlice(...args),
      }),
      {
        name: "mesbg-lb-storage",
        storage: createJSONStorage(() => sessionStorage),
        partialize: (state) => getStateToPersist(state),
      },
    ),
  ),
);
