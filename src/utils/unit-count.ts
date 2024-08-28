import { Roster } from "../types/roster.ts";
import { FreshUnit, isDefinedUnit, Option, Unit } from "../types/unit.ts";
import { Warband } from "../types/warband.ts";
import { sum } from "./utils.ts";

export const calculateWarbandModelCount = (warband: Warband) => {
  // todo: Figure out how to calculate this properly with all the edge cases like Murin & Drar / Siege crew.
  return warband.units
    .filter(isDefinedUnit)
    .map((unit) => unit.quantity)
    .reduce(sum, 0);
};

export const calculateWarbandBowLimitModels = (warband: Warband) => {
  let count = 0;
  if (
    warband.hero.model_id === "[the_iron_hills] iron_hills_chariot_(captain)"
  ) {
    count += warband.hero.siege_crew - 1;
  }

  if (warband.hero.unit_type === "Siege Engine") {
    count += warband.hero.siege_crew - 1;
    count +=
      warband.hero.options.find((option) => option.option === "Additional Crew")
        ?.opt_quantity ?? 0; // opt_quantity or 0 if no "Additional Crew" option exists.
  }

  count += warband.units
    .filter((unit: Unit | FreshUnit) => isDefinedUnit(unit))
    .filter((unit: Unit) => unit.unit_type === "Warrior")
    .filter((unit: Unit) => unit.bow_limit)
    .reduce(
      (count: number, unit: Unit) =>
        count + unit.quantity + unit.siege_crew * unit.quantity,
      0,
    );

  return count;
};

const isBow = (option: Option) =>
  option.type === "bow" && option.opt_quantity === 1;

export const calculateWarbandBowCount = (
  warband: Warband,
  rawBowCount: boolean = false,
) =>
  warband.units
    .filter((unit: Unit | FreshUnit) => isDefinedUnit(unit))
    .filter((unit: Unit) => unit.unit_type === "Warrior")
    .filter(
      (unit: Unit) =>
        (unit.bow_limit || rawBowCount) &&
        (unit.inc_bow_count || !!unit.options.find(isBow) || unit.default_bow),
    )
    .reduce(
      (bowCount: number, unit: Unit) =>
        bowCount + (unit.siege_crew > 0 ? unit.siege_crew : 1) * unit.quantity,
      0,
    );

export const calculateRosterUnitCount = (roster: Roster) =>
  roster.warbands
    .map((warband) => {
      const hero = isDefinedUnit(warband.hero) ? 1 : 0;
      const units = calculateWarbandModelCount(warband);
      return hero + units;
    })
    .reduce(sum, 0);

export const calculateWarbandTotalBowCount = (warband: Warband) => {
  return calculateWarbandBowCount(warband, true);
};

export const calculateRosterTotalBowCount = (roster: Roster) => {
  return roster.warbands.map(calculateWarbandTotalBowCount).reduce(sum, 0);
};
