import { Roster } from "../../../../types/roster.ts";
import {
  calculatePointsForRoster,
  calculatePointsForUnit,
  calculatePointsForWarband,
} from "../../../../utils/points.ts";
import {
  calculateRosterTotalBowCount,
  calculateRosterUnitCount,
  calculateWarbandModelCount,
  calculateWarbandTotalBowCount,
} from "../../../../utils/unit-count.ts";
import {
  calculateAllianceLevel,
  calculateModelCount,
  calculateRosterMightTotal,
  getFactionList,
  getFactionSpecialRules,
  getFactionType,
  getUniqueModels,
  getWarningsForCreatedRoster,
  makeAllianceSpecificRosterAjustments,
} from "../calculations";
import { RosterState } from "../index.ts";

export const recalculate = (state: RosterState) => {
  state = { ...state, ...updateFactionData(state.roster) };
  const adjustedRoster = recalculatePoints(
    updateUnitCount(
      makeAllianceSpecificRosterAjustments(
        state.factions,
        state.allianceLevel,
        state.roster,
        state.uniqueModels,
      ),
    ),
  );

  return {
    ...state,
    ...updateFactionData(adjustedRoster),
    roster: adjustedRoster,
  };
};

export const recalculatePoints = (roster: Roster): Roster => {
  return {
    ...roster,
    points: calculatePointsForRoster(roster),
    warbands: roster.warbands.map((warband) => ({
      ...warband,
      points: calculatePointsForWarband(warband),
      hero: {
        ...warband.hero,
        ...calculatePointsForUnit(warband.hero),
      },
      units: warband.units.map((unit) => ({
        ...unit,
        ...calculatePointsForUnit(unit),
      })),
    })),
  };
};

export const updateUnitCount = (roster: Roster): Roster => {
  return {
    ...roster,
    num_units: calculateRosterUnitCount(roster),
    bow_count: calculateRosterTotalBowCount(roster),
    might_total: calculateRosterMightTotal(roster),
    warbands: roster.warbands.map((warband) => ({
      ...warband,
      num_units: calculateWarbandModelCount(warband),
      max_units: warband.hero?.warband_size || "-",
      bow_count: calculateWarbandTotalBowCount(warband),
    })),
  };
};

export const updateFactionData = (roster: Roster) => {
  const factionType = getFactionType(roster.warbands);
  const factionList = getFactionList(roster.warbands);
  const factionEnabledSpecialRules = getFactionSpecialRules(roster.warbands);
  const uniqueModels = getUniqueModels(roster.warbands);
  const { warnings, losesArmyBonus, newAllianceLevel } =
    getWarningsForCreatedRoster(
      roster,
      factionList,
      calculateAllianceLevel(factionList, factionType),
      calculateModelCount(roster.warbands),
      uniqueModels,
    );
  const armyBonusActive =
    ["Historical", "Legendary Legion"].includes(newAllianceLevel) &&
    !losesArmyBonus;

  return {
    factionType: factionType,
    factions: factionList,
    factionEnabledSpecialRules: factionEnabledSpecialRules,
    uniqueModels: uniqueModels,
    allianceLevel: newAllianceLevel,
    rosterBuildingWarnings: warnings,
    armyBonusActive: armyBonusActive,
    factionMetaData: calculateModelCount(roster.warbands),
  };
};
