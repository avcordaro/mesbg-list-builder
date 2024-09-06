import { FunctionComponent } from "react";
import { useStore } from "../../../state/store";
import { Option, Unit } from "../../../types/unit.js";
import { OptionCounter } from "../../common/option/OptionCounter.tsx";
import { OptionToggle } from "../../common/option/OptionToggle.tsx";

/* Option Hero is the component used to display an individual gear options that each hero 
has available.

The core difference between Option Hero and Option Warrior components is
that some hero options can be more than just a simple toggle (e.g. amount of Will points 
you'd like for the Witch King). */

type OptionHeroProps = {
  warbandId: string;
  unit: Unit;
  option: Option;
};

export const OptionHero: FunctionComponent<OptionHeroProps> = ({
  warbandId,
  unit,
  option,
}) => {
  const { updateHero } = useStore();

  const hasHorse =
    unit.options.find(({ type }) => type === "mount")?.opt_quantity === 1;
  const isLance = option.option === "Lance";

  const isOptionSelectable =
    (option.min !== option.max && !isLance) || hasHorse;

  return (
    <>
      {option.max > 1 ? (
        <OptionCounter
          warbandId={warbandId}
          unit={unit}
          option={option}
          updateState={updateHero}
        />
      ) : (
        <OptionToggle
          warbandId={warbandId}
          unit={unit}
          option={option}
          selectable={isOptionSelectable}
          updateState={updateHero}
        />
      )}
    </>
  );
};
