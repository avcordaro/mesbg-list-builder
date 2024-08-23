import { Faction } from "../../types/factions.ts";
import { Warband } from "../../types/warband.ts";

export function getUniqueModels(warbands: Warband[]): string[] {
  if (warbands && warbands.length <= 0) {
    return []; // no warbands equals no info
  }

  const allModelIds = warbands
    .flatMap(({ hero, units }) => [
      hero?.model_id,
      ...units.map((unit) => unit?.model_id),
    ])
    .filter((modelId) => !!modelId);

  return [...new Set(allModelIds)];
}

export type ModelCountData = Record<
  Faction,
  {
    heroicTiers: string[];
    modelsThatCountForBowLimit: number;
    modelsWithBow: number;
    siegeEngines: number;
  }
>;

function getModelCount(warband: Warband): number {
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
    .filter(
      (unit) =>
        !!unit && !!unit.name && unit.unit_type === "Warrior" && unit.bow_limit,
    )
    .reduce(
      (count, unit) => count + unit.quantity + unit.siege_crew * unit.quantity,
      0,
    );

  return count;
}

function getBowCount(warband: Warband) {
  return warband.units
    .filter((unit) => !!unit && !!unit.name && unit.unit_type === "Warrior")
    .filter((unit) => unit.inc_bow_count && unit.bow_limit)
    .reduce(
      (bowCount, unit) =>
        bowCount + (unit.siege_crew > 0 ? unit.siege_crew : 1) * unit.quantity,
      0,
    );
}

function getModelCountForWarband(warband: Warband) {
  if (!warband?.hero) {
    return {
      heroicTier: "",
      modelsThatCountForBowLimit: 0,
      modelsWithBow: 0,
      siegeEngines: 0,
    };
  }

  return {
    heroicTier: warband.hero.unit_type,
    modelsThatCountForBowLimit: getModelCount(warband),
    modelsWithBow: getBowCount(warband),
    siegeEngines: warband.hero.unit_type === "Siege Engine" ? 1 : 0,
  };
}

function sumModelCountsForFaction(total, current) {
  return {
    heroicTiers: [...total.heroicTiers, current.heroicTier],
    modelsThatCountForBowLimit:
      total.modelsThatCountForBowLimit + current.modelsThatCountForBowLimit,
    modelsWithBow: total.modelsWithBow + current.modelsWithBow,
    siegeEngines: total.siegeEngines + current.siegeEngines,
  };
}

export function calculateModelCount(warbands: Warband[]): ModelCountData {
  const groupedWarbands = warbands
    .filter((warband) => !!warband?.hero)
    .reduce(
      (factions, warband) => {
        const { faction } = warband.hero;
        if (!factions[faction]) {
          factions[faction] = [];
        }
        factions[faction].push(warband);
        return factions;
      },
      {} as Record<Faction, Warband[]>,
    );

  return Object.keys(groupedWarbands).reduce((result, faction) => {
    result[faction] = groupedWarbands[faction]
      .map((warband: Warband) => getModelCountForWarband(warband))
      .reduce(sumModelCountsForFaction, {
        heroicTiers: [],
        modelsThatCountForBowLimit: 0,
        modelsWithBow: 0,
        siegeEngines: 0,
      });

    return result;
  }, {} as ModelCountData);
}
