import { Chip, Paper } from "@mui/material";
import Box from "@mui/material/Box";
import IconButton from "@mui/material/IconButton";
import Stack from "@mui/material/Stack";
import Typography from "@mui/material/Typography";
import { useTheme } from "@mui/material/styles";
import { BsFillPersonVcardFill } from "react-icons/bs";
import { v4 as uuid } from "uuid";
import { useScrollToElement } from "../../../../hooks/scroll-to.ts";
import { useAppState } from "../../../../state/app";
import { useRosterBuildingState } from "../../../../state/roster-building";
import { Unit } from "../../../../types/unit.ts";
import { UnitProfilePicture } from "../../../common/images/UnitProfilePicture.tsx";
import { MwfBadge } from "../../../common/might-will-fate/MwfBadge.tsx";
import { ModalTypes } from "../../../modal/modals.tsx";

export function UnitSelectionButton({ unitData }: { unitData: Unit }) {
  const {
    selectUnit,
    warriorSelectionFocus,
    heroSelection,
    updateBuilderSidebar,
    assignHeroToWarband,
  } = useRosterBuildingState();
  const { setCurrentModal } = useAppState();

  const [focusedWarbandId, focusedUnitId] = warriorSelectionFocus;
  const { palette } = useTheme();
  const scrollTo = useScrollToElement();

  const handleClick = () => {
    const unitId = !heroSelection ? focusedUnitId : uuid();
    (heroSelection ? assignHeroToWarband : selectUnit)(
      focusedWarbandId,
      unitId,
      unitData,
    );
    updateBuilderSidebar({
      warriorSelection: false,
      heroSelection: false,
    });
    setTimeout(() => scrollTo(unitId), null);
  };

  const handleCardClick = (e) => {
    // Update the state variables so that the correct profile card is loaded, and the pop-up modal is displayed.
    e.stopPropagation();
    setCurrentModal(ModalTypes.PROFILE_CARD, {
      unitData,
      title: `(${unitData.faction}) ${unitData.name}`,
    });
  };

  return (
    <Paper
      onClick={handleClick}
      elevation={3}
      sx={{
        p: 2,
        cursor: "pointer",
        border: 1,
        borderColor: palette.grey.A400,
      }}
    >
      <Stack direction="row" spacing={1} alignItems="center">
        <UnitProfilePicture
          army={unitData.profile_origin}
          profile={unitData.name}
        />
        <Stack direction="column" alignItems="start" flexGrow={1}>
          <Typography variant="h6">
            <b>{unitData.name}</b>
          </Typography>
          <Typography>Points: {unitData.base_points}</Typography>
          <Box sx={{ mb: 1 }}>
            <MwfBadge unit={unitData} />
          </Box>
          {unitData.unit_type !== "Warrior" && (
            <Chip
              label={unitData.unit_type}
              size="small"
              sx={{
                backgroundColor: "black",
                color: "white",
                fontWeight: "bold",
              }}
            />
          )}
        </Stack>
        <IconButton
          onClick={handleCardClick}
          sx={{
            borderRadius: 2,
            p: 1.5,
            color: "white",
            backgroundColor: palette.grey.A700,
            "&:hover": {
              backgroundColor: palette.grey["900"],
            },
          }}
        >
          <BsFillPersonVcardFill />
        </IconButton>
      </Stack>
    </Paper>
  );
}
