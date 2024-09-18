import warning_rules_data from "../../../assets/data/warning_rules.json";
import { AllianceLevel } from "../../../constants/alliances.ts";
import { FactionData } from "../../../types/faction-data.ts";
import { Faction, Factions } from "../../../types/factions.ts";
import { Roster } from "../../../types/roster.ts";
import { isDefinedUnit } from "../../../types/unit.ts";
import { checkAlliance, getHighestPossibleAlliance } from "./alliance.ts";
import { ModelCountData } from "./models.ts";

type WarningRule = {
  type: string;
  dependencies: string[];
  warning: string;
};

type WarningRules = Record<string, WarningRule[]>;
const warning_rules = warning_rules_data as WarningRules;

type RosterBuildWarnings = {
  losesArmyBonus: boolean;
  newAllianceLevel: AllianceLevel;
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
      losesArmyBonus = true;
    }
  }
  return { losesArmyBonus, becomesImpossibleAllies, warnings };
}

function checkHistoricallyAccurate(
  rule: WarningRule,
  alliance: AllianceLevel,
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
        newAllianceLevel: alliance,
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
      newAllianceLevel: becomesImpossibleAllies ? "Impossible" : alliance,
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

function checkWarriorCaptains(roster: Roster, alliance: AllianceLevel) {
  return roster.warbands
    .map((warband) => {
      if (!isDefinedUnit(warband.hero)) return null;

      if (
        [
          "[the_dead_of_dunharrow] warrior_of_the_dead_cpt",
          "[the_dead_of_dunharrow] rider_of_the_dead_cpt",
        ].includes(warband.hero.model_id) &&
        alliance === "Historical" &&
        warband.num_units < 8
      ) {
        return `Warband ${warband.num} needs to contain eight or more models before the ${warband.hero.name} is able to lead them.`;
      }

      return null;
    })
    .filter((value) => !!value);
}

const checkWarnings = (
  roster: Roster,
  uniqueModels: string[],
  factions: Faction[],
  alliance: AllianceLevel,
): RosterBuildWarnings => {
  const dunharrowWarning = checkDunharrow(alliance, factions, uniqueModels);
  const { losesArmyBonus, newAllianceLevel, warnings } = uniqueModels
    .flatMap((model) => checkForErrors(model, uniqueModels, factions, alliance))
    .reduce(
      (result, currentValue) => ({
        losesArmyBonus: result.losesArmyBonus || currentValue.losesArmyBonus,
        newAllianceLevel: getHighestPossibleAlliance(
          result.newAllianceLevel,
          currentValue.newAllianceLevel,
        ),
        warnings: [...result.warnings, ...currentValue.warnings],
      }),
      { losesArmyBonus: false, newAllianceLevel: alliance, warnings: [] },
    );
  const allianceLevel = checkGilGalad(newAllianceLevel, factions, uniqueModels);
  const factionWarnings = factions.flatMap((faction) =>
    checkForFactionErrors(faction, factions, uniqueModels, allianceLevel),
  );
  const warriorCaptainWarnings = checkWarriorCaptains(
    roster,
    !dunharrowWarning ? allianceLevel : "Impossible",
  );
  return {
    warnings: [
      dunharrowWarning,
      ...warnings,
      ...factionWarnings,
      ...warriorCaptainWarnings,
    ].filter((v) => !!v),
    newAllianceLevel: !dunharrowWarning ? allianceLevel : "Impossible",
    losesArmyBonus: losesArmyBonus || !!dunharrowWarning,
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

const checkDunharrow = (
  currentAllianceLevel: AllianceLevel,
  factions: Faction[],
  modelsInArmy: string[],
): string => {
  if (
    factions.length <= 1 ||
    !factions.includes(Factions.The_Dead_of_Dunharrow)
  )
    // Not a multi faction army with Dunharrow
    return null;

  if (currentAllianceLevel === "Impossible") {
    // Already impossible, so nothing to warn about
    return null;
  }

  const requiredModelToHave = [
    "[minas_tirith] aragorn,_king_elessar",
    "[the_fellowship] aragorn,_strider",
    "[the_rangers] aragorn,_strider",
  ];
  const intersection = requiredModelToHave.filter((requiredModel) =>
    modelsInArmy.includes(requiredModel),
  );

  return intersection.length === 0
    ? "A Dead of Dunharrow army list is automatically Impossible Allies with any force that doesn't also include Aragorn."
    : null;
};

const checkGilGalad = (
  currentAllianceLevel: AllianceLevel,
  faction_list: Faction[],
  models: string[],
): AllianceLevel => {
  if (currentAllianceLevel === "Impossible") {
    return currentAllianceLevel;
  }

  if (!models.includes("[rivendell] gil-galad")) {
    return currentAllianceLevel;
  }

  const gilGaladFactionData: Record<string, FactionData> = {
    "Gil Galad": {
      primaryAllies: [Factions.Rivendell, Factions.Numenor],
      secondaryAllies: [
        Factions.Lothlorien,
        Factions.Fangorn,
        Factions.The_Misty_Mountains,
      ],
      // the fields below are not important for the calculation.
      armyBonus: "",
      bow_limit: 0,
    },
  };

  const alliances = faction_list.map((faction) =>
    checkAlliance("Gil Galad" as Faction, faction, gilGaladFactionData),
  );

  // The lowest alliance level found between the pairs becomes the overall alliance level of the army roster
  if (alliances.includes("Impossible")) {
    return "Impossible";
  }
  if (alliances.includes("Convenient")) {
    return "Convenient";
  }
  return "Historical";
};

export const getWarningsForCreatedRoster = (
  roster: Roster,
  factionList: Faction[],
  allianceLevel: AllianceLevel,
  factionMetaData: ModelCountData,
  uniqueModels: string[],
): RosterBuildWarnings => {
  const initialWarnings = checkWarnings(
    roster,
    uniqueModels,
    factionList,
    allianceLevel,
  );
  const siegeEngineWarnings = checkSiegeEngineCounts(factionMetaData);
  const alliedHeroTierWarnings = checkAlliedHeroes(
    initialWarnings.newAllianceLevel,
    factionMetaData,
  );

  return {
    newAllianceLevel: initialWarnings.newAllianceLevel,
    losesArmyBonus: initialWarnings.losesArmyBonus,
    warnings: [
      ...initialWarnings.warnings,
      ...siegeEngineWarnings,
      ...alliedHeroTierWarnings,
    ],
  };
};
