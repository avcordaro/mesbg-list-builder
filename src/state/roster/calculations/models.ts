import { Faction } from "../../../types/factions.ts";
import { isDefinedUnit, Unit } from "../../../types/unit.ts";
import { Warband } from "../../../types/warband.ts";
import {
  calculateWarbandBowCount,
  calculateWarbandBowLimitModels,
} from "../../../utils/unit-count.ts";

export function getUniqueModels(warbands: Warband[]): string[] {
  if (warbands && warbands.length <= 0) {
    return []; // no warbands equals no info
  }

  const allModelIds = warbands
    .flatMap(({ hero, units }) => [
      hero?.model_id,
      ...units.map((unit: Unit) => unit?.model_id),
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
    modelsThatCountForBowLimit: calculateWarbandBowLimitModels(warband),
    modelsWithBow: calculateWarbandBowCount(warband),
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
    .filter((warband) => isDefinedUnit(warband.hero))
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
