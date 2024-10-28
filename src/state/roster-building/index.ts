import { create } from "zustand";
import { createJSONStorage, devtools, persist } from "zustand/middleware";
import { builderSlice, BuilderState } from "./builder-selection";
import { dragAndDropSlice, DragAndDropState } from "./drag-and-drop";
import { rosterSlice, RosterState } from "./roster";

export type RosterBuildingState = RosterState & BuilderState & DragAndDropState;

export const useRosterBuildingState = create<
  RosterBuildingState,
  [["zustand/devtools", unknown], ["zustand/persist", unknown]]
>(
  devtools(
    persist(
      (...args) => ({
        ...rosterSlice(...args),
        ...builderSlice(...args),
        ...dragAndDropSlice(...args),
      }),
      {
        name: "mlb-builder-default",
        storage: createJSONStorage(() => localStorage),
      },
    ),
  ),
);
