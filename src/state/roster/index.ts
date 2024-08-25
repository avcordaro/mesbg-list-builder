import { AllianceLevel } from "../../components/constants/alliances.ts";
import { Faction, FactionType } from "../../types/factions.ts";
import { Roster } from "../../types/roster.ts";
import { Unit } from "../../types/unit.ts";
import { Slice } from "../store.ts";
import { ModelCountData } from "./models.ts";
import { updateRoster } from "./roster.ts";

type RosterFunctions = {
  setRoster: (roster: Roster) => void;

  // Global warband functions
  addWarband: () => void;
  deleteWarband: (warbandId: string) => void;
  duplicateWarband: (warbandId: string) => void;

  // Hero functions
  assignHeroToWarband: (warbandId: string, heroId: string, hero: Unit) => void;
  updateHero: (warbandId: string, heroId: string, hero: Unit) => void;
  deleteHero: (warbandId: string, heroId: string) => void;

  // Unit functions
  addUnit: () => void;
  selectUnit: (warbandId: string, unitId: string, unit: Unit) => void;
  updateUnit: (warbandId: string, unitId: string, unit: Unit) => void;
  deleteUnit: (warbandId: string, unitId: string) => void;
  duplicateUnit: (warbandId: string, unitId: string) => void;
};

export type RosterState = {
  roster: Roster;
  factionType: FactionType | "";
  factions: Faction[];
  factionMetaData: ModelCountData;
  allianceLevel: AllianceLevel;
  armyBonusActive: boolean;
  uniqueModels: string[];
  rosterBuildingWarnings: string[];
} & RosterFunctions;

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
    set(
      {
        ...updateRoster(roster),
      },
      undefined,
      "SET_ROSTER",
    ),

  addWarband: (): void => set({}, undefined, "ADD_WARBAND"),
  duplicateWarband: (warbandId: string): void =>
    set({}, undefined, "DUPLICATE_WARBAND"),
  deleteWarband: (warbandId: string): void =>
    set({}, undefined, "DELETE_WARBAND"),

  assignHeroToWarband: (warbandId: string, heroId: string, hero: Unit): void =>
    set({}, undefined, "ASSIGN_HERO"),
  updateHero: (warbandId: string, heroId: string, hero: Unit): void =>
    set({}, undefined, "UPDATE_HERO"),
  deleteHero: (warbandId: string, heroId: string): void =>
    set({}, undefined, "DELETE_HERO"),

  addUnit: (): void => set({}, undefined, "ADD_UNIT"),
  selectUnit: (warbandId: string, unitId: string, unit: Unit): void =>
    set({}, undefined, "SELECT_UNIT"),
  updateUnit: (warbandId: string, unitId: string, unit: Unit): void =>
    set({}, undefined, "UPDATE_UNIT"),
  duplicateUnit: (warbandId: string, unitId: string): void =>
    set({}, undefined, "DUPLICATE_UNIT"),
  deleteUnit: (warbandId: string, unitId: string): void =>
    set({}, undefined, "DELETE_UNIT"),
});
