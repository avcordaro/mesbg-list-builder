import { create } from "zustand";
import { createJSONStorage, devtools, persist } from "zustand/middleware";
import { builderSlice, BuilderState } from "./builder-selection";
import { dragAndDropSlice, DragAndDropState } from "./drag-and-drop";
import { gamemodeSlice, GamemodeState } from "./gamemode";
import { getStateToPersist } from "./persistence.ts";
import { rosterSlice, RosterState } from "./roster";

export type AppState = RosterState &
  GamemodeState &
  BuilderState &
  DragAndDropState;

export const useStore = create<
  AppState,
  [["zustand/devtools", unknown], ["zustand/persist", unknown]]
>(
  devtools(
    persist(
      (...args) => ({
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
