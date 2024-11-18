import { v4 as uuid } from "uuid";
import { AllianceLevel } from "../../../constants/alliances.ts";
import { Faction, FactionType } from "../../../types/factions.ts";
import { Roster } from "../../../types/roster.ts";
import { FreshUnit, Unit } from "../../../types/unit.ts";
import { Slice } from "../../Slice.ts";
import { RosterBuildingState } from "../index.ts";
import {
  addWarband,
  assignHero,
  deleteHero,
  deleteUnit,
  deleteWarband,
  duplicateUnit,
  duplicateWarband,
  recalculate as updateMetaData,
  reorderUnits,
  selectUnit,
  updateFactionData,
  updateHero,
  updateLeadingHero,
  updateRoster,
  updateUnit,
} from "./actions";
import { ModelCountData } from "./calculations";

type RosterFunctions = {
  // Override roster (IE; import or reset)
  setRoster: (roster: Roster) => void;

  // Global warband functions
  addWarband: () => string;
  deleteWarband: (warbandId: string) => void;
  duplicateWarband: (warbandId: string) => string;

  // Hero functions
  assignHeroToWarband: (warbandId: string, heroId: string, hero: Unit) => void;
  updateHero: (warbandId: string, heroId: string, hero: Partial<Unit>) => void;
  deleteHero: (warbandId: string, heroId: string) => void;
  makeLeader: (warbandId: string) => void;

  // Unit functions
  addUnit: (warbandId: string) => string;
  selectUnit: (warbandId: string, unitId: string, unit: Unit) => void;
  updateUnit: (warbandId: string, unitId: string, unit: Partial<Unit>) => void;
  deleteUnit: (warbandId: string, unitId: string) => void;
  duplicateUnit: (warbandId: string, unitId: string) => string;
  reorderUnits: (warband: string, reorderedUnits: (Unit | FreshUnit)[]) => void;
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

export const emptyRoster = {
  version: BUILD_VERSION,
  num_units: 0,
  points: 0,
  bow_count: 0,
  might_total: 0,
  leader_warband_id: null,
  warbands: [],
};

const initialState = {
  roster: emptyRoster,
  factions: [],
  factionType: "" as FactionType,
  factionMetaData: {} as ModelCountData,
  factionEnabledSpecialRules: [],
  allianceLevel: "n/a" as AllianceLevel,
  armyBonusActive: true,
  uniqueModels: [],
  rosterBuildingWarnings: [],
};

export const rosterSlice: Slice<RosterBuildingState, RosterState> = (
  set,
  get,
) => {
  const recalculate = (state: RosterState): RosterState =>
    updateMetaData(state);

  return {
    ...initialState,

    setRoster: (newRoster) => {
      set(
        (state) =>
          recalculate({
            ...state,
            ...updateFactionData(newRoster),
            ...updateRoster(newRoster),
          }),
        undefined,
        "SET_ROSTER",
      );
    },

    addWarband: (): string => {
      const newWarbandId = uuid();
      set(addWarband(newWarbandId), undefined, "ADD_WARBAND");
      return newWarbandId;
    },
    duplicateWarband: (warbandId: string): string => {
      set(
        (state) =>
          recalculate({ ...state, ...duplicateWarband(warbandId)(state) }),
        undefined,
        "DUPLICATE_WARBAND",
      );
      const warbands = get().roster.warbands;
      return warbands[warbands.length - 1].id;
    },
    deleteWarband: (warbandId: string): void =>
      set(
        (state) =>
          recalculate({ ...state, ...deleteWarband(warbandId)(state) }),
        undefined,
        "DELETE_WARBAND",
      ),

    assignHeroToWarband: (
      warbandId: string,
      heroId: string,
      hero: Unit,
    ): void => {
      set(
        (state) =>
          recalculate({
            ...state,
            ...assignHero(warbandId, heroId, hero)(state),
          }),
        undefined,
        "ASSIGN_HERO",
      );
    },
    updateHero: (
      warbandId: string,
      heroId: string,
      hero: Partial<Unit>,
    ): void => {
      set(
        (state) =>
          recalculate({
            ...state,
            ...updateHero(warbandId, heroId, hero)(state),
          }),
        undefined,
        "UPDATE_HERO",
      );
    },
    makeLeader: (warbandId: string): void => {
      set(updateLeadingHero(warbandId), undefined, "UPDATE_ARMY_LEADER");
    },
    deleteHero: (warbandId: string, heroId: string): void => {
      set(
        (state) =>
          recalculate({ ...state, ...deleteHero(warbandId, heroId)(state) }),
        undefined,
        "DELETE_HERO",
      );
    },

    addUnit: (warbandId: string): string => {
      const newUnitId = uuid();
      set(
        ({ roster }) => {
          return {
            roster: {
              ...roster,
              warbands: roster.warbands.map((warband) => {
                if (warband.id !== warbandId) {
                  return warband;
                }
                return {
                  ...warband,
                  units: [...warband.units, { id: newUnitId, name: null }],
                };
              }),
            },
          };
        },
        undefined,
        "ADD_UNIT",
      );
      return newUnitId;
    },
    selectUnit: (warbandId: string, unitId: string, unit: Unit): void => {
      set(
        (state) =>
          recalculate({
            ...state,
            ...selectUnit(warbandId, unitId, unit)(state),
          }),
        undefined,
        "SELECT_UNIT",
      );
    },
    updateUnit: (
      warbandId: string,
      unitId: string,
      unit: Partial<Unit>,
    ): void => {
      set(
        (state) =>
          recalculate({
            ...state,
            ...updateUnit(warbandId, unitId, unit)(state),
          }),
        undefined,
        "UPDATE_UNIT",
      );
    },
    duplicateUnit: (warbandId: string, unitId: string): string => {
      set(
        (state) =>
          recalculate({ ...state, ...duplicateUnit(warbandId, unitId)(state) }),
        undefined,
        "DUPLICATE_UNIT",
      );
      const warband = get().roster.warbands.find(
        (warband) => warband.id === warbandId,
      );
      return !warband ? unitId : warband.units[warband.units.length - 1].id;
    },
    deleteUnit: (warbandId: string, unitId: string): void => {
      set(
        (state) =>
          recalculate({ ...state, ...deleteUnit(warbandId, unitId)(state) }),
        undefined,
        "DELETE_UNIT",
      );
    },
    reorderUnits: (warbandId: string, reorderedUnits: (Unit | FreshUnit)[]) => {
      set(
        (state) =>
          recalculate({
            ...state,
            ...reorderUnits(warbandId, reorderedUnits)(state),
          }),
        undefined,
        "REORDER_UNITS",
      );
    },
  };
};
