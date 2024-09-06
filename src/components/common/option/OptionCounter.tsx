import Button from "react-bootstrap/Button";
import Stack from "react-bootstrap/Stack";
import { FaMinus, FaPlus } from "react-icons/fa";
import { Option, Unit } from "../../../types/unit.ts";

const MWF_MAP = { Might: 0, Will: 1, Fate: 2 };

export const OptionCounter = ({
  warbandId,
  unit,
  option,
  updateState,
}: {
  warbandId: string;
  unit: Unit;
  option: Option;
  updateState: (
    warbandId: string,
    unitId: string,
    update: Partial<Unit>,
  ) => void;
}) => {
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

    updateState(warbandId, unit.id, {
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
