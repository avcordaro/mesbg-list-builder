import { v4 as uuid } from "uuid";
import { FreshUnit, isDefinedUnit, Unit } from "../../../types/unit.ts";
import { Warband } from "../../../types/warband.ts";
import { findAndRemoveItem } from "../../../utils/array.ts";
import { AppState } from "../../store.ts";
import { RosterState } from "../index.ts";
import { getSpecialArmyOption, hasSpecialArmyOption } from "./special-rules.ts";

export const addWarband =
  () =>
  ({ roster }: AppState) => {
    roster.warbands.push({
      id: uuid(),
      num: roster.warbands.length + 1,
      points: 0,
      num_units: 0,
      max_units: "-",
      bow_count: 0,
      hero: null,
      units: [],
    });
    return {
      roster,
    };
  };

const adjustPotentialArmyWideSpecialRuleOptions = (
  warbands: Warband[],
  hero: Unit | FreshUnit,
) => {
  // Hero was not defined, nothing needs to be updated in this section.
  if (!isDefinedUnit(hero)) return;
  // Hero does not have army-wide special rules that need adjustment.
  if (!hasSpecialArmyOption(hero)) return;

  const deletedSpecialArmyOption = getSpecialArmyOption(hero);
  warbands.forEach((warband: Warband) => {
    warband.units.forEach((unit: Unit | FreshUnit) => {
      if (!isDefinedUnit(unit)) return unit;
      unit.options = unit.options.map((option) => {
        // We don't need to adjust anything if the option is not a special army upgrade
        if (option.type !== "special_army_upgrade") return option;
        // We don't need to adjust options that are not the option that is removed
        if (option.option !== deletedSpecialArmyOption) return option;

        return {
          ...option,
          opt_quantity: 0,
        };
      });
    });
  });
};

const recalculateLeaderWarbandNum = (
  deletedWarband: Warband,
  currentLeader: number,
) => {
  if (deletedWarband.num === currentLeader) {
    return null; // deleted warband contained leader, no new leader.
  }
  if (deletedWarband.num > currentLeader) {
    return currentLeader; // leader is in one of the earlier warbands and did not shift.
  } else {
    return currentLeader - 1; // leader warband shifted with 1 spot.
  }
};

export const deleteWarband =
  (warbandId: string) =>
  ({ roster }: AppState): Partial<RosterState> => {
    const deletedWarband = findAndRemoveItem(
      roster.warbands,
      (warband) => warband.id === warbandId,
    );

    if (!deletedWarband) {
      // Nothing was deleted here... not sure how though!
      console.warn("Deleted warband resulted in 'null'?!");
      return { roster };
    }

    adjustPotentialArmyWideSpecialRuleOptions(
      roster.warbands,
      deletedWarband.hero,
    );

    return {
      roster: {
        ...roster,
        leader_warband_num: recalculateLeaderWarbandNum(
          deletedWarband,
          roster.leader_warband_num,
        ),
        warbands: roster.warbands.map((warband, index) => ({
          ...warband,
          num: index + 1,
        })),
      },
    };
  };

export const duplicateWarband =
  (warbandId: string) =>
  ({ roster }: AppState) => {
    const warbandToDuplicate = roster.warbands.find(
      (warband) => warband.id === warbandId,
    );

    if (!warbandToDuplicate) {
      // Nothing was deleted here... not sure how though!
      console.warn("Warband to duplicate resulted in 'null'?!");
      return { roster };
    }

    // todo: do duplication

    return {
      roster,
    };
  };
