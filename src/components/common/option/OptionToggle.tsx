import Form from "react-bootstrap/Form";
import { Option, Unit } from "../../../types/unit.ts";

export const OptionToggle = ({
  warbandId,
  unit,
  option,
  selectable,
  updateState,
}: {
  warbandId: string;
  unit: Unit;
  option: Option;
  selectable: boolean;
  updateState: (
    warbandId: string,
    unitId: string,
    update: Partial<Unit>,
  ) => void;
}) => {
  const handleToggle = () => {
    updateState(warbandId, unit.id, {
      options: unit.options.map((o) => {
        if (option.type === "mount" && o.option === "Lance") {
          if (o.opt_quantity === 1 && option.opt_quantity === 1) {
            return {
              ...o,
              opt_quantity: 0,
            };
          }
        }
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
