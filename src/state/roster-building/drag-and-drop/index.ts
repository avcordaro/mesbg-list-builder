import { FreshUnit, Unit } from "../../../types/unit.ts";
import { Slice } from "../../Slice.ts";
import { RosterBuildingState } from "../index.ts";

export type DragAndDropState = {
  draggedUnit: Unit | FreshUnit | null;
  setDraggedUnit: (unit: Unit | FreshUnit) => void;
  clearDraggedUnit: () => void;
};

const initialState = {
  draggedUnit: null,
};

export const dragAndDropSlice: Slice<RosterBuildingState, DragAndDropState> = (
  set,
) => ({
  ...initialState,

  setDraggedUnit: (unit) =>
    set({ draggedUnit: unit }, undefined, "SET_DND_UNIT"),
  clearDraggedUnit: () => set({ draggedUnit: null }, undefined, "CLEAR_DND"),
});
