import { Faction, Factions } from "../../types/factions.ts";
import { Slice } from "../store.ts";

type Tabs = "Good Army" | "Evil Army" | "Good LL" | "Evil LL";

type BuilderSelectionState = {
  tabSelection: Tabs;
  factionSelection: Record<Tabs, Faction>;
  heroSelection: boolean;
  warriorSelection: boolean;
  warriorSelectionFocus: [string, string];
};

type BuilderSelectionActions = {
  updateBuilderSidebar: (update: Partial<BuilderSelectionState>) => void;
};

export type BuilderState = BuilderSelectionState & BuilderSelectionActions;

const initialBuilderState: BuilderSelectionState = {
  tabSelection: "Good Army",
  factionSelection: {
    "Good Army": Factions.Minas_Tirith,
    "Evil Army": Factions.Mordor,
    "Good LL": Factions.The_Return_of_the_King,
    "Evil LL": Factions.The_Host_of_the_Dragon_Emperor,
  },
  heroSelection: false,
  warriorSelection: false,
  warriorSelectionFocus: ["", ""],
};

export const builderSlice: Slice<BuilderState> = (set) => ({
  ...initialBuilderState,

  updateBuilderSidebar: (update) =>
    set({ ...update }, undefined, "UPDATE_BUILDER_SELECTION_STATE"),
});
