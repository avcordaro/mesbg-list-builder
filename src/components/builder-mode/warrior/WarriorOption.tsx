import { FunctionComponent } from "react";
import Button from "react-bootstrap/Button";
import Form from "react-bootstrap/Form";
import Stack from "react-bootstrap/Stack";
import { FaMinus, FaPlus } from "react-icons/fa";
import hero_constraint_data from "../../../assets/data/hero_constraint_data.json";
import { useStore } from "../../../state/store";
import { Option, Unit } from "../../../types/unit.ts";

const MWF_MAP = { Might: 0, Will: 1, Fate: 2 };

/* Option Warrior is the component used to display an individual gear options that each 
warrior has available. */

type OptionWarriorProps = {
  warbandId: string;
  unit: Unit;
  option: Option;
};

const OptionToggle = ({
  warbandId,
  unit,
  option,
  selectable,
}: {
  warbandId: string;
  unit: Unit;
  option: Option;
  selectable: boolean;
}) => {
  const { updateUnit } = useStore();

  const handleToggle = () => {
    updateUnit(warbandId, unit.id, {
      options: unit.options.map((o) => {
        if (option.option_id !== o.option_id) {
          return {
            ...o,
            opt_quantity:
              option.type !== null && option.type === o.type
                ? 0 // toggles off same-type options.
                : o.opt_quantity,
          };
        }
        return {
          ...o,
          opt_quantity: o.opt_quantity === 1 ? 0 : 1,
        };
      }),
    });
  };

  return (
    <Form.Check
      type="switch"
      id={"switch-" + unit.id + "-" + option.option.replaceAll(" ", "-")}
      label={option.option + " (" + option.points + " points)"}
      checked={option.opt_quantity === 1}
      disabled={!selectable}
      onChange={handleToggle}
    />
  );
};

const OptionCounter = ({
  warbandId,
  unit,
  option,
}: {
  warbandId: string;
  unit: Unit;
  option: Option;
}) => {
  const { updateUnit } = useStore();

  const updateMwfw = (option, value): [string | number, string][] => {
    if (["Might", "Will", "Fate"].includes(option)) {
      const mwfw = unit.MWFW[0][1].split(":");
      mwfw[MWF_MAP[option]] = String(value);
      return [["", mwfw.join(":")]];
    } else {
      return unit.MWFW;
    }
  };

  const handleQuantity = (newQuantity) => {
    /* Handles updates for options that require a quantity, rather than a toggle. This includes
            updating any changes to points and bow count when the quantity is changed.*/
    if (newQuantity > option.max || newQuantity < option.min) {
      return null;
    }

    updateUnit(warbandId, unit.id, {
      options: unit.options.map((o) => {
        if (option.option_id !== o.option_id) {
          return o;
        }
        return {
          ...o,
          opt_quantity: newQuantity,
        };
      }),
      MWFW: updateMwfw(option.option, newQuantity),
    });
  };

  return (
    <Stack className="mt-1" direction="horizontal" gap={2}>
      <Button
        disabled={option.opt_quantity === option.min}
        variant="outline-secondary"
        className="p-0 quantity-buttons"
        size="sm"
        onClick={() => handleQuantity(option.opt_quantity - 1)}
      >
        <FaMinus />
      </Button>
      <b style={{ width: "20px", textAlign: "center" }}>
        {option.opt_quantity}
      </b>
      <Button
        disabled={option.opt_quantity === option.max}
        variant="outline-secondary"
        className="p-0 quantity-buttons"
        size="sm"
        onClick={() => handleQuantity(option.opt_quantity + 1)}
      >
        <FaPlus />
      </Button>
      {option.option + " (" + option.points + " points)"}
    </Stack>
  );
};

export const WarriorOption: FunctionComponent<OptionWarriorProps> = ({
  warbandId,
  unit,
  option,
}) => {
  const { roster, factionEnabledSpecialRules } = useStore();

  const isSpecialWarbandOptionEnabled = (warbandHero: Unit) => {
    const heroData = hero_constraint_data[warbandHero.model_id][0];
    return heroData["special_warband_options"].includes(option.option);
  };

  const isArmyWideUpgradeEnabled = () => {
    return factionEnabledSpecialRules.includes(option.option);
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
    <OptionCounter warbandId={warbandId} unit={unit} option={option} />
  ) : (
    <OptionToggle
      warbandId={warbandId}
      unit={unit}
      option={option}
      selectable={isOptionSelectable()}
    />
  );
};
