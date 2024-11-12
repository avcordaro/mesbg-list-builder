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
import { QuantityButtons, WarriorActions } from "./WarriorActions.tsx";
import { WarriorOptionList } from "./WarriorOptionList.tsx";

/* Warband Warrior components display an individual warrior unit in a warband. */
type WarbandWarriorProps = {
  warbandId: string;
  unit: Unit;
  collapsed: boolean;
};

export const WarbandWarrior: FunctionComponent<WarbandWarriorProps> = (
  props,
) => {
  const unit = props.unit;
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));
  const isTablet = useMediaQuery(theme.breakpoints.down("md"));
  const { useDenseMode } = useUserPreferences();
  const { warriorSelectionFocus, warriorSelection } = useRosterBuildingState();
  const optionsString = unit.options
    .filter((o) => o.opt_quantity)
    .map((o) => o.option)
    .join(", ")
    // replaces the last `,` with an &-sign
    .replace(/,(?=[^,]*$)/, " &")
    // surround the string with [] (if there is at least 1 option.)
    .replace(/^(.+)$/, "[$1]");
  return (
    <Card
      sx={{
        p: 1,
        backgroundColor:
          warriorSelection && warriorSelectionFocus[1] === unit.id
            ? "lightblue"
            : "",
      }}
      elevation={2}
    >
      <Stack
        direction={isMobile ? "column" : "row"}
        alignItems="stretch"
        spacing={2}
      >
        <Collapse
          in={!props.collapsed}
          sx={{
            width: isMobile ? "100%" : "120px",
          }}
        >
          {isMobile ? (
            <Stack
              direction="column"
              alignItems="center"
              sx={{ width: "100%" }}
            >
              {!useDenseMode && (
                <>
                  <UnitProfilePicture
                    army={unit.profile_origin}
                    profile={unit.name}
                  />
                  <Stack direction="row" spacing={3} sx={{ mt: 1 }}>
                    <QuantityButtons unit={unit} warbandId={props.warbandId} />
                  </Stack>
                </>
              )}
            </Stack>
          ) : (
            <Stack direction="column">
              <UnitProfilePicture
                army={unit.profile_origin}
                profile={unit.name}
              />
              <Stack
                direction="row"
                justifyContent="space-around"
                sx={{ mt: 1 }}
              >
                <QuantityButtons unit={unit} warbandId={props.warbandId} />
              </Stack>
            </Stack>
          )}
        </Collapse>

        <Stack
          id="oyollasd"
          spacing={!props.collapsed && (!isMobile || !useDenseMode) ? 2 : 0}
          flexGrow={1}
          justifyContent="stretch"
          sx={{ width: "100%", mt: !props.collapsed ? "auto" : "0 !important" }}
        >
          {/* Name & Points */}
          <Stack
            direction={isMobile ? "column" : "row"}
            spacing={isMobile ? 0 : 3}
            alignItems="center"
          >
            <Typography
              variant="body1"
              component="div"
              flexGrow={1}
              textAlign={isMobile ? "center" : "start"}
            >
              <b>{unit.name} </b>
              {props.collapsed && !isTablet && <i>{optionsString}</i>}
              <b>
                {unit.unit_type === "Warrior" && " (x" + unit.quantity + ")"}
              </b>
              <Typography>
                {props.collapsed && isTablet && <i>{optionsString}</i>}
              </Typography>
            </Typography>

            <Typography sx={{ paddingRight: "10px" }}>
              Points: <b>{unit.pointsTotal}</b>
              {unit.unit_type === "Warrior" &&
                " (per unit: " + unit.pointsPerUnit + ")"}
            </Typography>

            {isMobile && useDenseMode && (
              <Stack
                direction="row"
                justifyContent="space-around"
                sx={{ mt: 1 }}
                gap={3}
              >
                <QuantityButtons unit={unit} warbandId={props.warbandId} />
              </Stack>
            )}
          </Stack>

          <Collapse in={!props.collapsed}>
            {/* Unit type & MWF */}
            {unit.unit_type !== "Warrior" &&
              unit.unit_type !== "Siege" &&
              !(isMobile && useDenseMode) && (
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
            <Stack
              direction={isTablet ? "column" : "row"}
              spacing={3}
              sx={{ p: 1 }}
            >
              <WarriorOptionList {...props} />
              <WarriorActions {...props} />
            </Stack>
          </Collapse>
        </Stack>
      </Stack>
    </Card>
  );
};
