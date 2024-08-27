import Button from "react-bootstrap/Button";
import Form from "react-bootstrap/Form";
import Stack from "react-bootstrap/Stack";
import { FaMinus, FaPlus } from "react-icons/fa";
import hero_constraint_data from "../../../assets/data/hero_constraint_data.json";
import { useStore } from "../../../state/store";

/* Option Warrior is the component used to display an individual gear options that each 
warrior has available. */

export function OptionWarrior({
  warbandNum,
  unit,
  option,
  specialArmyOptions,
}) {
  const { roster, setRoster, updateUnit } = useStore();

  const MWF_MAP = { Might: 0, Will: 1, Fate: 2 };

  const handleToggle = () => {
    updateUnit(roster.warbands[warbandNum - 1].id, unit.id, {
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

  const updateMwfw = (option, value) => {
    if (["Might", "Will", "Fate"].includes(option)) {
      let mwfw = unit.MWFW[0][1].split(":");
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

    updateUnit(roster.warbands[warbandNum - 1].id, unit.id, {
      options: unit.options.map((o) => {
        if (option.option_id !== o.option_id) {
          return 0;
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
    <>
      {option.max > 1 ? (
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
      ) : (
        <Form.Check
          type="switch"
          id={"switch-" + unit.id + "-" + option.option.replaceAll(" ", "-")}
          label={option.option + " (" + option.points + " points)"}
          checked={option.opt_quantity === 1}
          disabled={
            option.min === option.max ||
            !roster.warbands[warbandNum - 1].hero ||
            (option.type === "special_warband_upgrade" &&
              !hero_constraint_data[
                roster.warbands[warbandNum - 1].hero.model_id
              ][0]["special_warband_options"].includes(option.option)) ||
            (option.type === "special_army_upgrade" &&
              !specialArmyOptions.includes(option.option))
          }
          onChange={handleToggle}
        />
      )}
    </>
  );
}
