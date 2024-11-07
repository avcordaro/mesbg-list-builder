import Box from "@mui/material/Box";
import Stack from "@mui/material/Stack";
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
  if (unit.options[0].option === "None") return <Box flexGrow={1} />;

  return (
    <Stack direction="row" spacing={3} flexGrow={1}>
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
    </Stack>
  );
};
