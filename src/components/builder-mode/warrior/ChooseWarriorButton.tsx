import CancelIcon from "@mui/icons-material/Cancel";
import { Paper } from "@mui/material";
import Avatar from "@mui/material/Avatar";
import IconButton from "@mui/material/IconButton";
import Stack from "@mui/material/Stack";
import Typography from "@mui/material/Typography";
import useTheme from "@mui/material/styles/useTheme";
import { FunctionComponent } from "react";
import fallbackLogo from "../../../assets/images/default.png";
import { useScrollToTop } from "../../../hooks/scroll-to.ts";
import { useRosterBuildingState } from "../../../state/roster-building";
import { FreshUnit, isDefinedUnit } from "../../../types/unit.ts";

/* Default Warrior Unit components appear inside Warbands after 'Add Unit' is selected, 
before the user selects the warrior they would like. */

type ChooseWarriorButtonProps = {
  unit: FreshUnit;
  warbandId: string;
};

export const ChooseWarriorButton: FunctionComponent<
  ChooseWarriorButtonProps
> = ({ unit, warbandId }) => {
  const { roster, deleteUnit, updateBuilderSidebar, factionSelection } =
    useRosterBuildingState();
  const { palette } = useTheme();
  const scrollToTop = useScrollToTop("sidebar");

  const hero = roster.warbands.find(({ id }) => warbandId === id)?.hero;
  const warbandHasHero = isDefinedUnit(hero);

  const handleClick = () => {
    if (!warbandHasHero) {
      return;
    }

    const { faction_type, faction } = hero;

    updateBuilderSidebar({
      heroSelection: false,
      warriorSelection: true,
      warriorSelectionFocus: [warbandId, unit.id],
      factionSelection: { ...factionSelection, [faction_type]: faction },
      tabSelection: faction_type,
    });
    setTimeout(scrollToTop, null);
  };

  const handleDelete = (e) => {
    e.stopPropagation(); // makes sure the click does not register on the 'choose a warrior' button
    deleteUnit(warbandId, unit.id);
    updateBuilderSidebar({
      heroSelection: false,
      warriorSelection: false,
    });
  };

  return (
    <Paper
      onClick={handleClick}
      elevation={3}
      sx={
        warbandHasHero
          ? {
              p: 2,
              cursor: "pointer",
              "&:hover": {
                backgroundColor: palette.grey["300"],
              },
            }
          : {
              p: 2,
              border: 1,
              borderColor: palette.grey.A700,
              backgroundColor: palette.grey["600"],
            }
      }
    >
      <Stack direction="row" spacing={3} alignItems="center" minWidth="100%">
        <Avatar
          alt="Choose A Warrior"
          src={fallbackLogo}
          sx={{ width: 100, height: 100 }}
        />
        <Typography
          variant="body1"
          sx={{ flexGrow: 1, textAlign: "start", textTransform: "uppercase" }}
        >
          <b>Choose a Warrior</b>
        </Typography>
        <IconButton
          onClick={handleDelete}
          color="error"
          aria-label="delete"
          size="large"
          sx={{
            borderRadius: 2,
            color: "white",
            backgroundColor: palette.error.dark,
            "&:hover": {
              backgroundColor: palette.error.light,
            },
          }}
        >
          <CancelIcon />
        </IconButton>
      </Stack>
    </Paper>
  );
};
