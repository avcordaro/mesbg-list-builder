import warning_rules_data from "../../assets/data/warning_rules.json";
import { AllianceLevel } from "../../components/constants/alliances.ts";
import { Faction } from "../../types/factions";
import { ModelCountData } from "./models";

type WarningRule = {
  type: string;
  dependencies: string[];
  warning: string;
};

type WarningRules = Record<string, WarningRule[]>;
const warning_rules = warning_rules_data as WarningRules;

type RosterBuildWarnings = {
  losesArmyBonus: boolean;
  becomesImpossibleAllies: boolean;
  warnings: string[];
};

function checkRequiredAllianceLevel(
  rule: WarningRule,
  allianceLevel: AllianceLevel,
) {
  return rule.type === "requires_alliance" &&
    rule.dependencies[0] !== allianceLevel
    ? [rule.warning]
    : [];
}

function checkRequiredModelsArePresent(
  rule: WarningRule,
  intersection: string[],
) {
  const warnings: string[] = [];
  if (
    rule.type === "requires_all" &&
    intersection.length !== rule.dependencies.length
  ) {
    warnings.push(rule.warning);
  }
  if (rule.type === "requires_one" && intersection.length === 0) {
    warnings.push(rule.warning);
  }
  return warnings;
}

function checkLosesArmyBonus(
  rule: WarningRule,
  intersection: string[],
  factions: Faction[],
) {
  let losesArmyBonus = false;
  let becomesImpossibleAllies = false;
  const warnings = [];
  if (
    rule.type === "incompatible" &&
    (intersection.length > 0 || rule.dependencies.length === 0)
  ) {
    warnings.push(rule.warning);
    if (rule.warning.includes("lose your army bonus")) {
      losesArmyBonus = true;
    }
    if (
      rule.warning.includes("become impossible allies") &&
      factions.length > 1
    ) {
      becomesImpossibleAllies = true;
    }
  }
  return { losesArmyBonus, becomesImpossibleAllies, warnings };
}

function checkHistoricallyAccurate(
  rule: WarningRule,
  alliance:
    | "Convenient"
    | "n/a"
    | "Legendary Legion"
    | "Impossible"
    | "Historical",
  factions: Faction[],
  uniqueModels: string[],
) {
  if (
    rule.type === "historical_dependent" &&
    alliance === "Historical" &&
    factions.includes(rule.dependencies[0] as Faction) &&
    !uniqueModels.includes(rule.dependencies[1])
  ) {
    return [rule.warning];
  }
  return [];
}

function checkLegionHasRequiredModels(
  rule: WarningRule,
  intersection: string[],
) {
  if (rule.type === "compulsory" && intersection.length === 0) {
    return [rule.warning];
  }
  return [];
}

const checkForErrors = (
  model_id: string,
  uniqueModels: string[],
  factions: Faction[],
  alliance: AllianceLevel,
): RosterBuildWarnings[] => {
  if (!(model_id in warning_rules)) {
    return [
      {
        losesArmyBonus: false,
        becomesImpossibleAllies: false,
        warnings: [],
      },
    ];
  }

  return warning_rules[model_id].map((rule) => {
    const intersection = rule.dependencies.filter((x) =>
      uniqueModels.includes(x),
    );

    const allianceWarnings = checkRequiredAllianceLevel(rule, alliance);
    const requireModelWarnings = checkRequiredModelsArePresent(
      rule,
      intersection,
    );
    const {
      becomesImpossibleAllies,
      losesArmyBonus,
      warnings: armyBonusWarnings,
    } = checkLosesArmyBonus(rule, intersection, factions);

    return {
      losesArmyBonus,
      becomesImpossibleAllies,
      warnings: [
        ...armyBonusWarnings,
        ...requireModelWarnings,
        ...allianceWarnings,
      ],
    };
  });
};

function checkForFactionErrors(
  faction: Faction,
  otherFactions: Faction[],
  uniqueModels: string[],
  alliance: AllianceLevel,
): string[] {
  if (!(faction in warning_rules)) {
    return [];
  }

  return warning_rules[faction].flatMap((rule) => {
    const intersection = rule.dependencies.filter((x) =>
      uniqueModels.includes(x),
    );
    const historicallyAccurate = checkHistoricallyAccurate(
      rule,
      alliance,
      otherFactions,
      uniqueModels,
    );
    const legionHasRequiredModels = checkLegionHasRequiredModels(
      rule,
      intersection,
    );

    return [...historicallyAccurate, ...legionHasRequiredModels];
  });
}

const checkWarnings = (
  uniqueModels: string[],
  factions: Faction[],
  alliance: AllianceLevel,
): RosterBuildWarnings => {
  const { losesArmyBonus, becomesImpossibleAllies, warnings } = uniqueModels
    .flatMap((model) => checkForErrors(model, uniqueModels, factions, alliance))
    .reduce(
      (result, currentValue) => ({
        losesArmyBonus: result.losesArmyBonus || currentValue.losesArmyBonus,
        becomesImpossibleAllies:
          result.becomesImpossibleAllies ||
          currentValue.becomesImpossibleAllies,
        warnings: [...result.warnings, ...currentValue.warnings],
      }),
      { losesArmyBonus: false, becomesImpossibleAllies: false, warnings: [] },
    );

  const factionWarnings = factions.flatMap((faction) =>
    checkForFactionErrors(
      faction,
      factions,
      uniqueModels,
      becomesImpossibleAllies ? "Impossible" : alliance,
    ),
  );
  return {
    warnings: [...warnings, ...factionWarnings],
    becomesImpossibleAllies,
    losesArmyBonus,
  };
};

const checkSiegeEngineCounts = (factionMetaData: ModelCountData) => {
  return Object.entries(factionMetaData)
    .map(([faction, { heroicTiers, siegeEngines }]) => {
      const allowedSiegeEngines = heroicTiers.filter((tier) =>
        ["Hero of Fortitude", "Hero of Valour", "Hero of Legend"].includes(
          tier,
        ),
      ).length;

      if (siegeEngines > allowedSiegeEngines) {
        return (
          `Too many Siege Engines for ${faction}. An army, or allied contingent, may only include one Siege ` +
          `Engine for each Hero with a Heroic Tier of Hero of Fortitude or above that is taken from the same Army ` +
          `List as the Siege Engine. (Changes from Official Errata/FAQs)`
        );
      }

      return null;
    })
    .filter((warning) => !!warning);
};

const checkAlliedHeroes = (
  _allianceLevel: AllianceLevel,
  factionMetaData: ModelCountData,
): string[] => {
  const factions = Object.entries(factionMetaData);
  if (factions.length <= 1) return []; // Pure army, no allies - no checks.

  return factions
    .map(([faction, { heroicTiers }]) => {
      if (faction.includes("Wanderers in the Wild")) {
        return null;
      }

      // Non-Historical require at least 1 Hero of Valour (or higher)
      if (_allianceLevel !== "Historical") {
        const heroes = heroicTiers.filter((v) =>
          ["Hero of Valour", "Hero of Legend"].includes(v),
        ).length;
        if (heroes === 0) {
          return `${faction} - For a Convenient Alliance, or an alliance containing Impossible Allies, each allied force must contain at least one Hero with a Heroic Tier of Hero of Valour or higher. (Changes from Official Errata/FAQs).`;
        }
        return null;
      }

      // Historical require at least 1 Hero of Fortitude (or higher)
      const heroes = heroicTiers.filter((tier) =>
        ["Hero of Fortitude", "Hero of Valour", "Hero of Legend"].includes(
          tier,
        ),
      ).length;

      if (heroes === 0) {
        return `${faction} - For a Historical Alliance, each allied force must contain at least one Hero with a Heroic Tier of Hero of Fortitude or higher. (Changes from Official Errata/FAQs).`;
      }

      return null;
    })
    .filter((warning) => !!warning);
};

export const getWarningsForCreatedRoster = (
  factionList: Faction[],
  actualAllianceLevel: AllianceLevel,
  factionMetaData: ModelCountData,
  uniqueModels: string[],
): RosterBuildWarnings => {
  const blab = checkWarnings(uniqueModels, factionList, actualAllianceLevel);
  const siegeEngineWarnings = checkSiegeEngineCounts(factionMetaData);
  const alliedHeroTierWarnings = checkAlliedHeroes(
    actualAllianceLevel,
    factionMetaData,
  );

  return {
    becomesImpossibleAllies: blab.becomesImpossibleAllies,
    losesArmyBonus: blab.losesArmyBonus,
    warnings: [
      ...blab.warnings,
      ...siegeEngineWarnings,
      ...alliedHeroTierWarnings,
    ],
  };
};
