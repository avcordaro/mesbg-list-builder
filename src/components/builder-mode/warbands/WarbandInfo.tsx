import Box from "@mui/material/Box";
import Chip from "@mui/material/Chip";
import Stack from "@mui/material/Stack";
import Typography from "@mui/material/Typography";
import { useTheme } from "@mui/material/styles";
import useMediaQuery from "@mui/material/useMediaQuery";
import { Warband } from "../../../types/warband.ts";
import { WarbandActions } from "./WarbandActions.tsx";

const MobileWarbandInfo = ({ warband }: { warband: Warband }) => {
  return (
    <Stack direction="column" alignItems="center" spacing={2}>
      <Stack direction="row" alignItems="center" sx={{ width: "100%" }}>
        <Box flexGrow={1}>
          <Chip
            label={warband?.hero?.faction || "[Faction]"}
            sx={{
              color: "white",
              backgroundColor: "black",
              fontWeight: "bolder",
            }}
          />
        </Box>

        <WarbandActions warband={warband} />
      </Stack>
      <Stack direction="row" spacing={3}>
        <Typography
          color={
            warband.max_units !== "-" && warband.num_units > warband.max_units
              ? "warning"
              : "white"
          }
        >
          Units:{" "}
          <b>
            {warband.num_units} / {warband.max_units}
          </b>
        </Typography>
        <Typography color="white">
          Points: <b>{warband.points}</b>
        </Typography>
      </Stack>
    </Stack>
  );
};

export const WarbandInfo = ({ warband }: { warband: Warband }) => {
  const theme = useTheme();
  const isTablet = useMediaQuery(theme.breakpoints.down("md"));
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));
  return isMobile ? (
    <MobileWarbandInfo warband={warband} />
  ) : (
    <Stack direction="row" alignItems="center" spacing={2}>
      <Chip
        label={warband?.hero?.faction || "[Faction]"}
        sx={{
          color: "white",
          backgroundColor: "black",
          fontWeight: "bolder",
        }}
      />

      <Typography color="white">
        Warband:{" "}
        <Typography component={isTablet ? "div" : "span"} textAlign="center">
          <b>{warband.num}</b>
        </Typography>
      </Typography>

      <Typography
        color={
          warband.max_units !== "-" && warband.num_units > warband.max_units
            ? "warning"
            : "white"
        }
      >
        Units:{" "}
        <Typography component={isTablet ? "div" : "span"} textAlign="center">
          <b>
            {warband.num_units} / {warband.max_units}
          </b>
        </Typography>
      </Typography>
      <Typography color="white">
        Points:{" "}
        <Typography component={isTablet ? "div" : "span"} textAlign="center">
          <b>{warband.points}</b>
        </Typography>
      </Typography>
      <Typography color="white">
        Bows:{" "}
        <Typography component={isTablet ? "div" : "span"} textAlign="center">
          <b>{warband.bow_count}</b>
        </Typography>
      </Typography>
      <WarbandActions warband={warband} />
    </Stack>
  );
};
