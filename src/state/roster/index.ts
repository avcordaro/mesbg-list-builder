import { AllianceLevel } from "../../components/constants/alliances.ts";
import { Faction, FactionType } from "../../types/factions.ts";
import { Roster } from "../../types/roster.ts";
import { Slice } from "../store.ts";
import { ModelCountData } from "./models.ts";
import { updateRoster } from "./roster.ts";

export type RosterState = {
  roster: Roster;
  setRoster: (roster: Roster) => void;
  factionType: FactionType | "";
  factions: Faction[];
  factionMetaData: ModelCountData;
  allianceLevel: AllianceLevel;
  armyBonusActive: boolean;
  uniqueModels: string[];
  rosterBuildingWarnings: string[];
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
};

export const rosterSlice: Slice<RosterState> = (set) => ({
  ...initialState,

  setRoster: (roster) =>
    set({
      ...updateRoster(roster),
    }),
});
