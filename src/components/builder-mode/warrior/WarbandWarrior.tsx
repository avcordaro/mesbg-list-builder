import Card from "@mui/material/Card";
import Chip from "@mui/material/Chip";
import Stack from "@mui/material/Stack";
import Typography from "@mui/material/Typography";
import { useTheme } from "@mui/material/styles";
import useMediaQuery from "@mui/material/useMediaQuery";
import { FunctionComponent } from "react";
import { Unit } from "../../../types/unit.ts";
import { UnitProfilePicture } from "../../common/images/UnitProfilePicture.tsx";
import { MwfBadge } from "../../common/might-will-fate/MwfBadge.tsx";
import { WarriorActions } from "./WarriorActions.tsx";
import { WarriorOptionList } from "./WarriorOptionList.tsx";

/* Warband Warrior components display an individual warrior unit in a warband. */
type WarbandWarriorProps = {
  warbandId: string;
  unit: Unit;
};

export const WarbandWarrior: FunctionComponent<WarbandWarriorProps> = (
  props,
) => {
  const unit = props.unit;
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));

  return (
    <Card sx={{ p: 1 }} elevation={2}>
      <Stack
        direction={isMobile ? "column" : "row"}
        alignItems="start"
        spacing={2}
      >
        {isMobile ? (
          <Stack alignItems="center" sx={{ width: "100%" }}>
            <UnitProfilePicture
              army={unit.profile_origin}
              profile={unit.name}
            />
          </Stack>
        ) : (
          <UnitProfilePicture army={unit.profile_origin} profile={unit.name} />
        )}

        <Stack spacing={2} flexGrow={1} sx={{ width: "100%" }}>
          {/* Name & Points */}
          <Stack
            direction={isMobile ? "column" : "row"}
            spacing={isMobile ? 0 : 3}
            alignItems="center"
          >
            <Typography variant="body1" component="div" flexGrow={1}>
              <b>{unit.name}</b>
            </Typography>
            <Typography sx={{ paddingRight: "10px" }}>
              Points: <b>{unit.pointsTotal}</b>
              {unit.unit_type === "Warrior" &&
                " (per unit: " + unit.pointsPerUnit + ")"}
            </Typography>
          </Stack>

          {/* Unit type & MWF */}
          {unit.unit_type !== "Warrior" && unit.unit_type !== "Siege" && (
            <Stack
              direction={isMobile ? "column" : "row"}
              spacing={1}
              alignItems="center"
            >
              <Chip
                label={unit.unit_type}
                size="small"
                sx={{
                  backgroundColor: "black",
                  color: "white",
                  fontWeight: "bold",
                }}
              />
              <MwfBadge unit={unit} />
            </Stack>
          )}

          {/* Options and increment buttons*/}
          <Stack direction="column" spacing={3} sx={{ width: "100%" }}>
            <WarriorOptionList {...props} />
            <WarriorActions {...props} />
          </Stack>
        </Stack>
      </Stack>
    </Card>
  );
};
