import { Collapse } from "@mui/material";
import Card from "@mui/material/Card";
import Chip from "@mui/material/Chip";
import Stack from "@mui/material/Stack";
import Typography from "@mui/material/Typography";
import { useTheme } from "@mui/material/styles";
import useMediaQuery from "@mui/material/useMediaQuery";
import { FunctionComponent } from "react";
import { useUserPreferences } from "../../../state/preference";
import { useRosterBuildingState } from "../../../state/roster-building";
import { Unit } from "../../../types/unit.ts";
import { UnitProfilePicture } from "../../common/images/UnitProfilePicture.tsx";
import { MwfBadge } from "../../common/might-will-fate/MwfBadge.tsx";
import { HeroActions } from "./HeroActions.js";
import { HeroLeaderToggle } from "./HeroLeaderToggle";
import { HeroOptions } from "./HeroOptions.js";

type WarbandHeroProps = {
  warbandId: string;
  unit: Unit;
  collapsed: boolean;
};

export const WarbandHero: FunctionComponent<WarbandHeroProps> = ({
  warbandId,
  unit,
  collapsed,
}) => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));
  const isTablet = useMediaQuery(theme.breakpoints.down("md"));
  const { useDenseMode } = useUserPreferences();
  const { roster } = useRosterBuildingState();

  // color & saturation for the hero indicator
  const isLeader = roster.leader_warband_id === warbandId;

  return (
    <Card
      sx={{
        p: 0.5,
      }}
      elevation={2}
    >
      <Stack
        direction={isMobile ? "column" : "row"}
        alignItems="start"
        spacing={isMobile && useDenseMode ? 0 : 2}
        sx={{
          p: 0.5,
          border: ({ palette: { success, grey } }) =>
            "3px " +
            (isLeader ? "solid " + success.light : "dashed " + grey.A400),
        }}
      >
        <Collapse
          in={!collapsed}
          sx={{
            width: isMobile ? "100%" : "120px",
          }}
        >
          {isMobile ? (
            <Stack alignItems="center" sx={{ width: "100%" }}>
              {!useDenseMode && (
                <UnitProfilePicture
                  army={unit.profile_origin}
                  profile={unit.name}
                />
              )}
            </Stack>
          ) : (
            <UnitProfilePicture
              army={unit.profile_origin}
              profile={unit.name}
            />
          )}
        </Collapse>

        <Stack
          spacing={!collapsed && !(isMobile && useDenseMode) ? 1 : 0}
          flexGrow={1}
          sx={{ width: "100%" }}
        >
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
          <Collapse in={!collapsed}>
            {(!isMobile || !useDenseMode) && (
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
            <Stack
              direction={isTablet ? "column" : "row"}
              spacing={3}
              sx={{ p: 1 }}
            >
              <HeroOptions warbandId={warbandId} unit={unit} />
              <HeroActions warbandId={warbandId} unit={unit} />
            </Stack>
          </Collapse>
        </Stack>
      </Stack>
    </Card>
  );
};
