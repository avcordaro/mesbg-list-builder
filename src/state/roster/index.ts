/* eslint-disable @typescript-eslint/no-unused-vars */
import { v4 as uuid } from "uuid";
import { AllianceLevel } from "../../constants/alliances.ts";
import { Faction, FactionType } from "../../types/factions.ts";
import { Roster } from "../../types/roster.ts";
import { FreshUnit, Unit } from "../../types/unit.ts";
import { Slice } from "../store.ts";
import {
  recalculate as updateMetaData,
  updateFactionData,
} from "./buiding/calculations.ts";
import {
  assignHero,
  deleteHero,
  updateHero,
  updateLeadingHero,
} from "./buiding/hero.ts";
import {
  deleteUnit,
  duplicateUnit,
  selectUnit,
  updateUnit,
} from "./buiding/unit.ts";
import {
  addWarband,
  deleteWarband,
  duplicateWarband,
} from "./buiding/warband.ts";
import { ModelCountData } from "./models.ts";
import { updateRoster } from "./roster.ts";

type RosterFunctions = {
  // Override roster (IE; import or reset)
  setRoster: (roster: Roster) => void;

  // Global warband functions
  addWarband: () => void;
  deleteWarband: (warbandId: string) => void;
  duplicateWarband: (warbandId: string) => void;

  // Hero functions
  assignHeroToWarband: (warbandId: string, heroId: string, hero: Unit) => void;
  updateHero: (warbandId: string, heroId: string, hero: Partial<Unit>) => void;
  deleteHero: (warbandId: string, heroId: string) => void;
  makeLeader: (warbandId: string) => void;

  // Unit functions
  addUnit: (warbandId: string) => void;
  selectUnit: (warbandId: string, unitId: string, unit: Unit) => void;
  updateUnit: (warbandId: string, unitId: string, unit: Partial<Unit>) => void;
  deleteUnit: (warbandId: string, unitId: string) => void;
  duplicateUnit: (warbandId: string, unitId: string) => void;
};

export type RosterState = {
  roster: Roster;
  factionType: FactionType | "";
  factions: Faction[];
  factionMetaData: ModelCountData;
  factionEnabledSpecialRules: string[];
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
    leader_warband_id: null,
    warbands: [],
  },
  factions: [],
  factionType: "" as FactionType,
  factionMetaData: {} as ModelCountData,
  factionEnabledSpecialRules: [],
  allianceLevel: "n/a" as AllianceLevel,
  armyBonusActive: true,
  uniqueModels: [],
  rosterBuildingWarnings: [],
};

export const rosterSlice: Slice<RosterState> = (set) => {
  const recalculate = () => updateMetaData(set);
  return {
    ...initialState,

    setRoster: (newRoster) => {
      set(
        {
          ...updateFactionData(newRoster),
        },
        undefined,
        "UPDATE_ROSTER_META_DATA",
      );
      set(
        ({ allianceLevel, factions }) => ({
          ...updateRoster(newRoster, allianceLevel, factions),
        }),
        undefined,
        "SET_ROSTER",
      );
      recalculate();
    },

    addWarband: (): void => set(addWarband(), undefined, "ADD_WARBAND"),
    duplicateWarband: (warbandId: string): void => {
      set(duplicateWarband(warbandId), undefined, "DUPLICATE_WARBAND");
      recalculate();
    },
    deleteWarband: (warbandId: string): void => {
      set(deleteWarband(warbandId), undefined, "DELETE_WARBAND");
      recalculate();
    },

    assignHeroToWarband: (
      warbandId: string,
      heroId: string,
      hero: Unit,
    ): void => {
      set(assignHero(warbandId, heroId, hero), undefined, "ASSIGN_HERO");
      recalculate();
    },
    updateHero: (
      warbandId: string,
      heroId: string,
      hero: Partial<Unit>,
    ): void => {
      set(updateHero(warbandId, heroId, hero), undefined, "UPDATE_HERO");
      recalculate();
    },
    makeLeader: (warbandId: string): void => {
      set(updateLeadingHero(warbandId), undefined, "UPDATE_ARMY_LEADER");
    },
    deleteHero: (warbandId: string, heroId: string): void => {
      set(deleteHero(warbandId, heroId), undefined, "DELETE_HERO");
      recalculate();
    },

    addUnit: (warbandId: string): void =>
      set(
        ({ roster }) => {
          const warband = roster.warbands.find(({ id }) => id === warbandId);
          warband.units.push({ id: uuid(), name: null } as FreshUnit);
          return {
            roster,
          };
        },
        undefined,
        "ADD_UNIT",
      ),
    selectUnit: (warbandId: string, unitId: string, unit: Unit): void => {
      set(selectUnit(warbandId, unitId, unit), undefined, "SELECT_UNIT");
      recalculate();
    },
    updateUnit: (
      warbandId: string,
      unitId: string,
      unit: Partial<Unit>,
    ): void => {
      set(updateUnit(warbandId, unitId, unit), undefined, "UPDATE_UNIT");
      recalculate();
    },
    duplicateUnit: (warbandId: string, unitId: string): void => {
      set(duplicateUnit(warbandId, unitId), undefined, "DUPLICATE_UNIT");
      recalculate();
    },
    deleteUnit: (warbandId: string, unitId: string): void => {
      set(deleteUnit(warbandId, unitId), undefined, "DELETE_UNIT");
      recalculate();
    },
  };
};
