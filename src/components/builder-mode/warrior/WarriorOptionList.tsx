import Box from "@mui/material/Box";
import Stack from "@mui/material/Stack";
import { useTheme } from "@mui/material/styles";
import useMediaQuery from "@mui/material/useMediaQuery";
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
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));

  if (unit.options[0].option === "None") return null;

  return (
    <Stack direction="row" spacing={3} flexGrow={1}>
      <Box sx={{ px: isMobile ? 2 : 0 }}>
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
