import { v4 as uuid } from "uuid";
import { isDefinedUnit } from "../../../types/unit.ts";
import { Warband } from "../../../types/warband.ts";
import { findAndRemoveItem } from "../../../utils/array.ts";
import { AppState } from "../../store.ts";
import {
  adjustPotentialArmyWideSpecialRuleOptions,
  recalculateLeaderWarband,
} from "../calculations";
import { RosterState } from "../index.ts";

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
        leader_warband_id: recalculateLeaderWarband(
          deletedWarband,
          roster.leader_warband_id,
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

    const hasUniqueHero =
      isDefinedUnit(warbandToDuplicate.hero) && warbandToDuplicate.hero.unique;
    const newWarband: Warband = {
      ...warbandToDuplicate,
      id: uuid(),
      num: roster.warbands.length + 1,
      hero: !hasUniqueHero
        ? {
            ...warbandToDuplicate.hero,
            id: uuid(),
          }
        : null,
      units: warbandToDuplicate.units
        .filter((unit) => isDefinedUnit(unit))
        .filter((unit) => !unit.unique)
        .map((unit) => ({
          ...unit,
          id: uuid(),
          options: unit.options.map((option) =>
            option.type === "special_warband_upgrade"
              ? {
                  ...option,
                  opt_quantity: 0,
                }
              : option,
          ),
        })),
    };

    return {
      roster: {
        ...roster,
        warbands: [...roster.warbands, newWarband],
      },
    };
  };
