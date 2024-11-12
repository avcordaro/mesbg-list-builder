import { Factions } from "../../../types/factions.ts";
import { Slice } from "../../Slice.ts";
import { RosterBuildingState } from "../index.ts";

type BuilderSelectionState = {
  selectedFaction: Factions;
  heroSelection: boolean;
  warriorSelection: boolean;
  warriorSelectionFocus: [string, string];
};

type BuilderSelectionActions = {
  updateBuilderSidebar: (update: Partial<BuilderSelectionState>) => void;
};

export type BuilderState = BuilderSelectionState & BuilderSelectionActions;

export const initialBuilderState: BuilderSelectionState = {
  selectedFaction: null,
  heroSelection: false,
  warriorSelection: false,
  warriorSelectionFocus: ["", ""],
};

export const builderSlice: Slice<RosterBuildingState, BuilderState> = (
  set,
) => ({
  ...initialBuilderState,

  updateBuilderSidebar: (update) =>
    set({ ...update }, undefined, "UPDATE_BUILDER_SELECTION_STATE"),
});
