import { v4 as uuid } from "uuid";
import hero_constraint_data from "../../../../assets/data/hero_constraint_data.json";
import {
  FreshUnit,
  isDefinedUnit,
  Option,
  Unit,
} from "../../../../types/unit.ts";
import { Warband } from "../../../../types/warband.ts";
import { findAndRemoveItem } from "../../../../utils/array.ts";

const findUnitById = (unitId: string) => (unit: Unit | FreshUnit) =>
  unit.id === unitId;

export const selectUnit =
  (warbandId: string, unitId: string, selectedUnit: Unit) =>
  ({ roster }) => ({
    roster: {
      ...roster,
      warbands: roster.warbands.map((warband: Warband) => {
        if (warband.id !== warbandId) return warband;
        const isUnitToUpdate = findUnitById(unitId);
        return {
          ...warband,
          units: warband.units.map((unit: FreshUnit) =>
            isUnitToUpdate(unit) ? { ...unit, ...selectedUnit } : unit,
          ),
        };
      }),
    },
  });

export const updateUnit =
  (warbandId: string, unitId: string, update: Partial<Unit>) =>
  ({ roster }) => ({
    roster: {
      ...roster,
      warbands: roster.warbands.map((warband: Warband) => {
        if (warband.id !== warbandId) return warband;
        const isUnitToUpdate = findUnitById(unitId);
        return {
          ...warband,
          units: warband.units.map((unit: Unit) =>
            isUnitToUpdate(unit) ? { ...unit, ...update } : unit,
          ),
        };
      }),
    },
  });

export const duplicateUnit =
  (warbandId: string, unitId: string) =>
  ({ roster }) => ({
    roster: {
      ...roster,
      warbands: roster.warbands.map((warband: Warband) => {
        if (warband.id !== warbandId) return warband;
        const unitToDuplicate = warband.units.find(findUnitById(unitId));

        if (!isDefinedUnit(unitToDuplicate)) return warband;
        if (unitToDuplicate.unique) return warband;

        warband.units.push({
          ...unitToDuplicate,
          id: uuid(),
        });

        return warband;
      }),
    },
  });

export const deleteUnit =
  (warbandId: string, unitId: string) =>
  ({ roster }) => ({
    roster: {
      ...roster,
      warbands: roster.warbands.map((warband: Warband) => {
        if (warband.id !== warbandId) return warband;

        findAndRemoveItem(warband.units, findUnitById(unitId));

        return warband;
      }),
    },
  });

const isOptionAvailableInWarband = (warbandHero: Unit, option: Option) => {
  if (option.type !== "special_warband_upgrade") return true;
  if (!isDefinedUnit(warbandHero)) return false;
  const heroData = hero_constraint_data[warbandHero.model_id][0];
  return heroData["special_warband_options"].includes(option.option);
};

export const reorderUnits =
  (warbandId: string, units: (Unit | FreshUnit)[]) =>
  ({ roster }) => ({
    roster: {
      ...roster,
      warbands: roster.warbands.map((warband: Warband) => {
        if (warband.id !== warbandId) return warband;

        return {
          ...warband,
          units: units.map((unit) => {
            if (!isDefinedUnit(unit)) return unit;
            return {
              ...unit,
              options: unit.options.map((option) => ({
                ...option,
                opt_quantity: isOptionAvailableInWarband(warband.hero, option)
                  ? option.opt_quantity
                  : 0,
              })),
            };
          }),
        };
      }),
    },
  });
