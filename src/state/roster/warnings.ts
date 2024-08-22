// const checkWarnings = (_uniqueModels, faction_list, newAllianceLevel) => {
//   let newWarnings = [];
//   let _newAllianceLevel = newAllianceLevel;
//   _uniqueModels.map((model_id) => {
//     if (model_id in warning_rules) {
//       let rules = warning_rules[model_id];
//       rules.map((rule) => {
//         if (
//           rule["type"] === "requires_alliance" &&
//           rule.dependencies[0] !== _newAllianceLevel
//         ) {
//           newWarnings.push(rule.warning);
//         }
//         let intersection = rule.dependencies.filter((x) =>
//           _uniqueModels.includes(x),
//         );
//         if (
//           rule["type"] === "requires_all" &&
//           intersection.length !== rule.dependencies.length
//         ) {
//           newWarnings.push(rule.warning);
//         }
//         if (rule["type"] === "requires_one" && intersection.length === 0) {
//           newWarnings.push(rule.warning);
//         }
//         if (
//           rule["type"] === "incompatible" &&
//           (intersection.length > 0 || rule.dependencies.length === 0)
//         ) {
//           newWarnings.push(rule.warning);
//           if (rule.warning.includes("lose your army bonus")) {
//             // setHasArmyBonus(false);
//             // TODO: Make sure rules are checked when roster update takes place!
//           }
//           if (
//             rule.warning.includes("become impossible allies") &&
//             faction_list.length > 1
//           ) {
//             _newAllianceLevel = "Impossible";
//           }
//         }
//         return null;
//       });
//     }
//     return null;
//   });
//   faction_list.map((faction) => {
//     if (faction in warning_rules) {
//       let rules = warning_rules[faction];
//       rules.map((rule) => {
//         if (
//           rule["type"] === "historical_dependent" &&
//           _newAllianceLevel === "Historical" &&
//           faction_list.includes(rule.dependencies[0]) &&
//           !_uniqueModels.includes(rule.dependencies[1])
//         ) {
//           newWarnings.push(rule.warning);
//         }
//         let intersection = rule.dependencies.filter((x) =>
//           _uniqueModels.includes(x),
//         );
//         if (rule["type"] === "compulsory" && intersection.length === 0) {
//           newWarnings.push(rule.warning);
//         }
//         return null;
//       });
//     }
//     return null;
//   });
//   return [newWarnings, _newAllianceLevel];
// };

import { Faction } from "../../types/factions";
import { ModelCountData } from "./models";

export const getWarningsForCreatedRoster = (
  factionType: string,
  factionList: Faction[],
  actualAllianceLevel: string,
  factionMetaData: ModelCountData,
  uniqueModels: string[],
): string[] => {
  // checkAlliedHeroes();
  // checkSiegeEngineCounts();

  return [];
};

const checkSiegeEngineCounts = (heroicTiers, siegeEngines) => {
  const _warnings: string[] = [];
  Object.keys(heroicTiers).map((faction) => {
    if (siegeEngines[faction] > 0) {
      const heroForts = heroicTiers[faction].reduce(
        (n, v) =>
          ["Hero of Fortitude", "Hero of Valour", "Hero of Legend"].includes(v)
            ? n + 1
            : n,
        0,
      );
      if (siegeEngines[faction] > heroForts) {
        _warnings.push(
          `Too many Siege Engines for ${faction}. An army, or allied contingent, may only include one Siege Engine for each Hero with a Heroic Tier of Hero of Fortitude or above that is taken from the same Army List as the Siege Engine. (Changes from Official Errata/FAQs)`,
        );
      }
    }
    return null;
  });
  return _warnings;
};

const checkAlliedHeroes = (_allianceLevel, heroicTiers) => {
  const _warnings: string[] = [];
  if (Object.keys(heroicTiers).length > 1) {
    Object.keys(heroicTiers).map((faction) => {
      if (faction.includes("Wanderers in the Wild")) {
        return null;
      }
      if (_allianceLevel === "Historical") {
        const heroForts = heroicTiers[faction].reduce(
          (n, v) =>
            ["Hero of Fortitude", "Hero of Valour", "Hero of Legend"].includes(
              v,
            )
              ? n + 1
              : n,
          0,
        );
        if (heroForts === 0) {
          _warnings.push(
            `${faction} - For a Historical Alliance, each allied force must contain at least one Hero with a Heroic Tier of Hero of Fortitude or higher. (Changes from Official Errata/FAQs).`,
          );
        }
      } else {
        const heroValours = heroicTiers[faction].reduce(
          (n, v) =>
            ["Hero of Valour", "Hero of Legend"].includes(v) ? n + 1 : n,
          0,
        );
        if (heroValours === 0) {
          _warnings.push(
            `${faction} - For a Convenient Alliance, or an alliance containing Impossible Allies, each allied force must contain at least one Hero with a Heroic Tier of Hero of Valour or higher. (Changes from Official Errata/FAQs).`,
          );
        }
      }
      return null;
    });
  }
  return _warnings;
};
