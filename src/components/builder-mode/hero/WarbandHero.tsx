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
import { HeroActions } from "./HeroActions.js";
import { HeroLeaderToggle } from "./HeroLeaderToggle";
import { HeroOptions } from "./HeroOptions.js";

type WarbandHeroProps = {
  warbandId: string;
  unit: Unit;
};

export const WarbandHero: FunctionComponent<WarbandHeroProps> = ({
  warbandId,
  unit,
}) => {
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

        <Stack spacing={1} flexGrow={1} sx={{ width: "100%" }}>
          <Stack
            direction={isMobile ? "column" : "row"}
            spacing={isMobile ? 0 : 3}
            alignItems="center"
          >
            <Typography variant="body1" component="div" flexGrow={1}>
              <Stack
                component="span"
                direction="row"
                alignItems="center"
                spacing={2}
              >
                <b>{unit.name}</b>
                <HeroLeaderToggle warbandId={warbandId} hero={unit} />
              </Stack>
            </Typography>
            <Typography sx={{ paddingRight: "10px" }}>
              Points: <b>{unit.pointsTotal}</b>
            </Typography>
          </Stack>
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
          <Stack direction="column" spacing={3}>
            <HeroOptions warbandId={warbandId} unit={unit} />
            <HeroActions warbandId={warbandId} unit={unit} />
          </Stack>
        </Stack>
      </Stack>
    </Card>
  );
};
