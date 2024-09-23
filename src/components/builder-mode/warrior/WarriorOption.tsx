import { FunctionComponent } from "react";
import hero_constraint_data from "../../../assets/data/hero_constraint_data.json";
import { useStore } from "../../../state/store";
import { isDefinedUnit, Option, Unit } from "../../../types/unit.ts";
import { OptionCounter } from "../option/OptionCounter.tsx";
import { OptionToggle } from "../option/OptionToggle.tsx";

/* Option Warrior is the component used to display an individual gear options that each
warrior has available. */

/* Option Warrior is the component used to display an individual gear options that each 
warrior has available. */

type OptionWarriorProps = {
  warbandId: string;
  unit: Unit;
  option: Option;
};

export const WarriorOption: FunctionComponent<OptionWarriorProps> = ({
  warbandId,
  unit,
  option,
}) => {
  const { roster, factionEnabledSpecialRules, updateUnit } = useStore();

  const isSpecialWarbandOptionEnabled = (warbandHero: Unit) => {
    if (!isDefinedUnit(warbandHero)) return false;
    const heroData = hero_constraint_data[warbandHero.model_id][0];
    return heroData["special_warband_options"].includes(option.option);
  };

  const isArmyWideUpgradeEnabled = () => {
    return factionEnabledSpecialRules.includes(option.option);
  };

  const isLanceWithoutHorse = () => {
    const hasHorse =
      unit.options.find(({ type }) => type === "mount")?.opt_quantity === 1;
    const isLance = option.option === "Lance";

    return isLance && !hasHorse;
  };

  const isOptionSelectable = () => {
    if (option.min === option.max) {
      return false;
    }

    const warband = roster.warbands.find(({ id }) => id === warbandId);
    if (!warband) {
      console.warn(
        "Not sure why or how this function was called?! Warband does not seem to exist...",
        warband,
      );
      return false;
    }

    if (!isDefinedUnit(warband.hero)) return false;

    if (isLanceWithoutHorse()) return false;

    if (option.type === "special_army_upgrade" && !isArmyWideUpgradeEnabled())
      return false;

    if (
      option.type === "special_warband_upgrade" &&
      !isSpecialWarbandOptionEnabled(warband.hero)
    )
      return false;

    // All checks passed, option is selectable
    return true;
  };

  return option.max > 1 ? (
    <OptionCounter
      warbandId={warbandId}
      unit={unit}
      option={option}
      updateState={updateUnit}
    />
  ) : (
    <OptionToggle
      warbandId={warbandId}
      unit={unit}
      option={option}
      selectable={isOptionSelectable()}
      updateState={updateUnit}
    />
  );
};
