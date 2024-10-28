import { Roster } from "../../../types/roster.ts";
import { isDefinedUnit, Unit, UnitType } from "../../../types/unit.ts";

export const getSumOfUnits = (roster: Roster) => {
  const units = roster.warbands.flatMap((warband) => [
    warband.hero,
    ...warband.units,
  ]);

  const totalledUnits: Unit[] = Object.values(
    Object.create(units)
      .filter(isDefinedUnit)
      // clone the unit so not to update its 'quantity' by object reference in state.
      .map(Object.create)
      .map((unit: Unit) => {
        const options = unit.options
          .filter((o) => o.opt_quantity)
          .map((o) => o.option + o.opt_quantity)
          .join(",");
        const key = unit.name + " [" + options + "]";

        return { key, unit };
      })
      .reduce(
        (totals: Record<string, Unit>, { key, unit }) => {
          if (!totals[key]) {
            totals[key] = unit;
          } else {
            totals[key].quantity += unit.quantity;
            totals[key].pointsTotal += unit.pointsTotal;
          }
          return totals;
        },
        {} as Record<string, Unit>,
      ),
  );

  const sorting: Record<UnitType, number> = {
    "Hero of Legend": 1,
    "Hero of Valour": 2,
    "Hero of Fortitude": 3,
    "Minor Hero": 4,
    "Independent Hero": 5,
    Warrior: 6,
    "Siege Engine": 7,
  };

  return totalledUnits.sort((a, b) => {
    if (a.unit_type.includes("Hero") && a.unique) {
      if (b.unit_type.includes("Hero") && b.unique) {
        return sorting[a.unit_type] - sorting[b.unit_type];
      }
      return -1;
    }

    if (a.unit_type === "Warrior" && b.unit_type === "Warrior") {
      return a.name.localeCompare(b.name);
    }

    return sorting[a.unit_type] - sorting[b.unit_type];
  });
};
