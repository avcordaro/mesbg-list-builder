import Chip from "@mui/material/Chip";
import Stack from "@mui/material/Stack";
import Typography from "@mui/material/Typography";
import { Warband } from "../../../types/warband.ts";
import { WarbandActions } from "./WarbandActions.tsx";

export const WarbandInfo = ({ warband }: { warband: Warband }) => {
  return (
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
        Warband: <b>{warband.num}</b>
      </Typography>

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
      <Typography color="white">
        Bows: <b>{warband.bow_count}</b>
      </Typography>
      <WarbandActions warband={warband} />
    </Stack>
  );
};
