import { v4 as uuid } from "uuid";
import { FreshUnit, isDefinedUnit, Unit } from "../../../types/unit.ts";
import { Warband } from "../../../types/warband.ts";
import { findAndRemoveItem } from "../../../utils/array.ts";

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
