import { FunctionComponent } from "react";
import Form from "react-bootstrap/Form";
import { Unit } from "../../../types/unit.ts";
import { WarriorOption } from "./WarriorOption.tsx";

type OptionListProps = {
  unit: Unit;
  warbandId: string;
};

export const WarriorOptionList: FunctionComponent<OptionListProps> = ({
  unit,
  warbandId,
}) => {
  if (unit.options[0].option === "None") return null;

  return (
    <Form>
      {unit.options.map((option) => (
        <WarriorOption
          key={option.option_id}
          option={option}
          unit={unit}
          warbandId={warbandId}
        />
      ))}
    </Form>
  );
};
