import { Roster } from "../../../types/roster.ts";
import {
  calculatePointsForRoster,
  calculatePointsForUnit,
  calculatePointsForWarband,
} from "../../../utils/points.ts";
import {
  calculateRosterUnitCount,
  calculateRosterTotalBowCount,
  calculateWarbandBowCount,
} from "../../../utils/unit-count.ts";
import { calculateAllianceLevel } from "../alliance.ts";
import {
  getFactionList,
  getFactionSpecialRules,
  getFactionType,
} from "../faction.ts";
import { calculateModelCount, getUniqueModels } from "../models.ts";
import { getWarningsForCreatedRoster } from "../warnings.ts";

export const recalculate = (set) => {
  set(
    ({ roster }) => ({ roster: updateUnitCount(roster) }),
    undefined,
    "RECALCULATE_UNIT_COUNT",
  );
  set(
    ({ roster }) => ({ ...updateFactionData(roster) }),
    undefined,
    "UPDATE_FACTION_DATA",
  );
  set(
    ({ roster }) => ({ roster: recalculatePoints(roster) }),
    undefined,
    "RECALCULATE_POINTS",
  );
};

export const recalculatePoints = (roster: Roster): Roster => {
  return {
    ...roster,
    points: calculatePointsForRoster(roster),
    warbands: roster.warbands.map((warband) => ({
      ...warband,
      points: calculatePointsForWarband(warband),
      units: warband.units.map((unit) => ({
        ...unit,
        ...calculatePointsForUnit(unit),
      })),
    })),
  };
};

export const updateUnitCount = (roster: Roster) => {
  return {
    ...roster,
    num_units: calculateRosterUnitCount(roster),
    bow_count: calculateRosterTotalBowCount(roster),
    warbands: roster.warbands.map((warband) => ({
      ...warband,
      num_units: 0,
      max_units: warband.hero.warband_size, // TODO: Handle special cases
      bow_count: calculateWarbandBowCount(warband),
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
  };
};
