import Box from "@mui/material/Box";
import { FunctionComponent } from "react";
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
    <Box>
      {unit.options.map((option) => (
        <WarriorOption
          key={option.option_id}
          option={option}
          unit={unit}
          warbandId={warbandId}
        />
      ))}
    </Box>
  );
};
