import { Roster } from "../types/roster.ts";
import { FreshUnit, isDefinedUnit, Option, Unit } from "../types/unit.ts";
import { Warband } from "../types/warband.ts";
import { sum } from "./utils.ts";

const warriorCaptains = [
  "[the_dead_of_dunharrow] warrior_of_the_dead_cpt",
  "[the_dead_of_dunharrow] rider_of_the_dead_cpt",
  "[wildmen_of_druadan] woses_warrior_cpt",
  "[dark_denizens_of_mirkwood] bat_swarm_cpt",
  "[dark_denizens_of_mirkwood] giant_spider_cpt",
  "[dark_denizens_of_mirkwood] fell_warg_cpt",
  "[dark_denizens_of_mirkwood] mirkwood_spider_cpt",
  "[sharkey's_rogues] ruffian_cpt",
  "[the_chief's_ruffians] ruffian_cpt",
];

const extraUnitsOnHero = (hero: Unit) => {
  if (!isDefinedUnit(hero)) return 0;

  if (hero.model_id === "[fangorn] treebeard") {
    const hasMerAndPip =
      hero.options.find(({ type }) => type === "treebeard_m&p")
        ?.opt_quantity === 1;
    if (hasMerAndPip) return 2;
  }

  if (hero.unit_type === "Siege Engine") {
    return (
      (hero.options.find((option) => option.type === "add_crew")
        ?.opt_quantity || 0) +
      hero.siege_crew -
      1
    );
  }

  if (warriorCaptains.includes(hero.model_id)) {
    return 1;
  }

  return Math.max(hero.siege_crew - 1, 0);
};

export const calculateWarbandModelCount = (warband: Warband) => {
  if (!isDefinedUnit(warband.hero)) return 0;
  const units = warband.units
    .filter((unit) => isDefinedUnit(unit) && unit.unit_type !== "Siege")
    .map(
      (unit: Unit) =>
        unit.quantity + Math.max((unit.siege_crew - 1) * unit.quantity, 0),
    )
    .reduce(sum, 0);
  const extraUnits = extraUnitsOnHero(warband.hero);

  return units + extraUnits;
};

export const calculateWarbandBowLimitModels = (warband: Warband) => {
  if (!isDefinedUnit(warband.hero)) return 0;
  let count = 0;
  if (
    warband.hero.model_id === "[the_iron_hills] iron_hills_chariot_(captain)"
  ) {
    count += warband.hero.siege_crew - 1;
  }

  if (warband.hero.model_id.includes("farmer_maggot")) {
    count += 3; // Grip, Fang and Wolf
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
        count +
        unit.quantity +
        Math.max((unit.siege_crew - 1) * unit.quantity, 0),
      0,
    );

  return count;
};

const isBow = (option: Option) =>
  option.type !== null &&
  option.type.includes("bow") &&
  option.opt_quantity === 1;

export const calculateWarbandBowCount = (
  warband: Warband,
  rawBowCount: boolean = false,
) => {
  if (!isDefinedUnit(warband.hero)) return 0;
  return warband.units
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
};

const isWarriorLeadingWarband = (hero: Unit) => {
  return warriorCaptains.includes(hero.model_id);
};

export const calculateRosterUnitCount = (roster: Roster) =>
  roster.warbands
    .map((warband) => {
      const hero =
        isDefinedUnit(warband.hero) && !isWarriorLeadingWarband(warband.hero)
          ? 1
          : 0;
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
