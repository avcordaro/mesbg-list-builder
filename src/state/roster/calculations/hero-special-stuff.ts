import hero_constraint_data from "../../../assets/data/hero_constraint_data.json";
import mesbg_data from "../../../assets/data/mesbg_data.json";
import { FreshUnit, isDefinedUnit, Unit } from "../../../types/unit.ts";
import { Warband } from "../../../types/warband.ts";

export const handleMahudChief = (hero: Unit) => {
  if (
    hero.model_id !== "[grand_army_of_the_south] war_mumak_of_harad" &&
    hero.model_id !== "[the_serpent_horde] war_mumak_of_harad"
  ) {
    return;
  }

  const hasChief =
    hero.options.find(({ type }) => type === "mahud_chief").opt_quantity === 1;

  hero.MWFW = hasChief
    ? [
        ["War Mumak of Harad - Mahud Beastmaster Chieftain", "3:2:2:2"],
        ["War Mumak of Harad", "0:0:0:10"],
      ]
    : [
        ["War Mumak of Harad - Haradrim Commander", "2:1:1:2"],
        ["War Mumak of Harad", "0:0:0:10"],
      ];
};

export const handleAzog = (hero: Unit) => {
  if (hero.model_id === "[azog's_legion] azog") {
    const hasSignalTower =
      hero.options.find(({ option }) => option === "Signal Tower")
        .opt_quantity === 1;
    hero.warband_size = hasSignalTower ? 24 : 18;
  }

  if (hero.model_id.includes("] azog")) {
    const hasTheWhiteWargs =
      hero.options.find(({ option }) => option === "The White Warg")
        .opt_quantity === 1;
    hero.MWFW = hasTheWhiteWargs
      ? [
          ["Azog", "3:3:1:3"],
          ["The White Warg", "3:1:1:2"],
        ]
      : [["Azog", "3:3:1:3"]];
  }
};

export const handleSiegeEngineCaptainUpdates = (hero: Unit) => {
  if (hero.unit_type !== "Siege Engine") {
    return;
  }

  const hasCapt =
    hero.options.find(({ type }) => type === "engineer_cpt").opt_quantity === 1;
  hero.warband_size = hasCapt ? 12 : 6;
  hero.MWFW = hasCapt
    ? [["Siege Veteran", "1:1:1:1"]]
    : [["Engineer Captain", "2:1:1:2"]];
  hero.options = hero.options.map((option) => {
    if (option.option.includes("Engineer Captain - ")) {
      return {
        ...option,
        max: hasCapt ? 1 : 0,
        opt_quantity: hasCapt ? Math.min(option.opt_quantity, 1) : 0,
      };
    }

    if (option.type === "add_crew") {
      const raw = mesbg_data.find((model) => model.model_id === hero.model_id);
      const rawMax = raw.options.find(
        (option) => option.type === "add_crew",
      ).max;
      const currentMax = hasCapt ? rawMax + 6 : rawMax;
      return {
        ...option,
        max: currentMax,
        opt_quantity: Math.min(currentMax, option.opt_quantity),
      };
    }

    return option;
  });
};

export const adjustPotentialArmyWideSpecialRuleOptions = (
  warbands: Warband[],
  hero: Unit | FreshUnit,
) => {
  // Hero was not defined, nothing needs to be updated in this section.
  if (!isDefinedUnit(hero)) return;
  // Hero does not have army-wide special rules that need adjustment.
  if (!hasSpecialArmyOption(hero)) return;

  const deletedSpecialArmyOption = getSpecialArmyOption(hero);
  warbands.forEach((warband: Warband) => {
    warband.units.forEach((unit: Unit | FreshUnit) => {
      if (!isDefinedUnit(unit)) return unit;
      unit.options = unit.options.map((option) => {
        // We don't need to adjust anything if the option is not a special army upgrade
        if (option.type !== "special_army_upgrade") return option;
        // We don't need to adjust options that are not the option that is removed
        if (option.option !== deletedSpecialArmyOption) return option;

        return {
          ...option,
          opt_quantity: 0,
        };
      });
    });
  });
};

export const recalculateLeaderWarband = (
  deletedWarband: Warband,
  currentLeader: string,
): string => {
  if (deletedWarband.id === currentLeader) {
    return null; // deleted warband contained leader, no new leader.
  }
  return currentLeader;
};

export const hasSpecialArmyOption = (hero: Unit): boolean =>
  isDefinedUnit(hero) &&
  hero_constraint_data[hero.model_id] &&
  hero_constraint_data[hero.model_id][0]["special_army_option"] !== "";

export const getSpecialArmyOption = (hero: Unit): string =>
  hasSpecialArmyOption(hero)
    ? hero_constraint_data[hero.model_id][0]["special_army_option"]
    : null;
