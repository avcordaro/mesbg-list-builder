import Box from "@mui/material/Box";
import Stack from "@mui/material/Stack";
import { useTheme } from "@mui/material/styles";
import useMediaQuery from "@mui/material/useMediaQuery";
import { FunctionComponent } from "react";
import { v4 as uuid } from "uuid";
import { Unit } from "../../../types/unit.ts";
import { OptionHero } from "./OptionHero";

type HeroOptionsProps = {
  warbandId: string;
  unit: Unit;
};

export const HeroOptions: FunctionComponent<HeroOptionsProps> = ({
  unit,
  warbandId,
}) => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));
  return (
    <Stack direction="row" spacing={3}>
      {unit.options[0].option !== "None" && (
        <Box sx={{ px: isMobile ? 2 : 0 }}>
          {unit.options.map((option) => (
            <OptionHero
              key={uuid()}
              warbandId={warbandId}
              unit={unit}
              option={option}
            />
          ))}
        </Box>
      )}
    </Stack>
  );
};
