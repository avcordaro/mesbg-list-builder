import CancelIcon from "@mui/icons-material/Cancel";
import IconButton from "@mui/material/IconButton";
import Stack from "@mui/material/Stack";
import { useTheme } from "@mui/material/styles";
import useMediaQuery from "@mui/material/useMediaQuery";
import { FunctionComponent, MouseEventHandler } from "react";
import { BsFillPersonVcardFill } from "react-icons/bs";
import { useAppState } from "../../../state/app";
import { useUserPreferences } from "../../../state/preference";
import { useRosterBuildingState } from "../../../state/roster-building";
import { Unit } from "../../../types/unit.ts";
import { ModalTypes } from "../../modal/modals.tsx";

type HeroActionsProps = {
  warbandId: string;
  unit: Unit;
};

export const HeroActions: FunctionComponent<HeroActionsProps> = ({
  unit,
  warbandId,
}) => {
  const { deleteHero } = useRosterBuildingState();
  const { setCurrentModal } = useAppState();
  const { palette, breakpoints } = useTheme();
  const isMobile = useMediaQuery(breakpoints.down("sm"));
  const { useDenseMode } = useUserPreferences();

  const handleDelete = () => deleteHero(warbandId, unit.id);

  const handleCardClick: MouseEventHandler<HTMLButtonElement> = (e) => {
    // Update the state variables so that the correct profile card is loaded, and the pop-up modal is displayed.
    e.stopPropagation();
    setCurrentModal(ModalTypes.PROFILE_CARD, {
      unitData: unit,
      title: `(${unit.faction}) ${unit.name}`,
    });
  };

  const iconSize = isMobile && useDenseMode ? "0.8rem" : "1.5rem";
  return (
    <Stack direction="column" justifyContent={isMobile ? "end" : "end"}>
      <Stack
        direction="row"
        spacing={2}
        justifyContent={isMobile ? "center" : "end"}
        sx={{ width: "100%" }}
      >
        <IconButton
          onClick={handleCardClick}
          sx={{
            borderRadius: 2,
            p: 1.5,
            color: "white",
            fontSize: iconSize,
            backgroundColor: palette.grey.A700,
            "&:hover": {
              backgroundColor: palette.grey["900"],
            },
          }}
        >
          <BsFillPersonVcardFill />
        </IconButton>
        <IconButton
          onClick={handleDelete}
          color="warning"
          aria-label="delete"
          size="large"
          sx={{
            borderRadius: 2,
            backgroundColor: palette.error.main,
            color: palette.error.contrastText,
            "&:hover": {
              backgroundColor: palette.error.light,
            },
          }}
        >
          <CancelIcon sx={{ fontSize: iconSize }} />
        </IconButton>
      </Stack>
    </Stack>
  );
};
