import { Roster } from "../types/roster.ts";
import { FreshUnit, isDefinedUnit, Unit } from "../types/unit.ts";
import { Warband } from "../types/warband.ts";
import { sum } from "./utils.ts";

export const calculatePpuForUnit = (unit: Unit | FreshUnit): number =>
  isDefinedUnit(unit)
    ? unit.base_points +
      unit.options
        .filter((option) => option.option_id !== "None")
        .map((option) => option.points * (option.opt_quantity - option.min))
        .reduce(sum, 0)
    : 0;

export const calculatePointsForUnit = (
  unit: Unit | FreshUnit,
): { pointsPerUnit: number; pointsTotal: number } => {
  const pointsPerUnit = calculatePpuForUnit(unit);
  const unitQuantity = isDefinedUnit(unit) ? unit.quantity : 0;
  return {
    ...unit,
    pointsPerUnit,
    pointsTotal: pointsPerUnit * unitQuantity,
  };
};

export const calculatePointsForWarband = (warband: Warband): number => {
  const heroCost = calculatePpuForUnit(warband.hero);
  const unitCost = warband.units
    .map((unit) =>
      isDefinedUnit(unit) ? calculatePointsForUnit(unit).pointsTotal : 0,
    )
    .reduce(sum, 0);

  return heroCost + unitCost;
};

export const calculatePointsForRoster = (roster: Roster): number =>
  roster.warbands.map(calculatePointsForWarband).reduce(sum, 0);
