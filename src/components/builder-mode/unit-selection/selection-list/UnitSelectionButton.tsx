import { Chip, Paper } from "@mui/material";
import Box from "@mui/material/Box";
import IconButton from "@mui/material/IconButton";
import Stack from "@mui/material/Stack";
import Typography from "@mui/material/Typography";
import { useTheme } from "@mui/material/styles";
import { BsFillPersonVcardFill } from "react-icons/bs";
import { v4 as uuid } from "uuid";
import { AllianceLevel } from "../../../../constants/alliances.ts";
import { useScrollToElement } from "../../../../hooks/scroll-to.ts";
import { useAppState } from "../../../../state/app";
import { useRosterBuildingState } from "../../../../state/roster-building";
import { getAllianceLevel } from "../../../../state/roster-building/roster/calculations";
import { Faction } from "../../../../types/factions.ts";
import { Unit } from "../../../../types/unit.ts";
import { UnitProfilePicture } from "../../../common/images/UnitProfilePicture.tsx";
import { MwfBadge } from "../../../common/might-will-fate/MwfBadge.tsx";
import { ModalTypes } from "../../../modal/modals.tsx";

export function UnitSelectionButton({
  unitData,
  foreign,
}: {
  unitData: Unit;
  foreign?: boolean;
}) {
  const {
    selectUnit,
    warriorSelectionFocus,
    heroSelection,
    selectedFaction,
    factions,
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
      selectedFaction: foreign ? unitData.faction : selectedFaction,
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

  const getFactionColor = (faction: Faction) => {
    if (factions.length === 0) return "black";

    const selectionIncludingFaction = [...new Set([...factions, faction])];
    const allianceLevel: AllianceLevel = getAllianceLevel(
      selectionIncludingFaction,
    );
    switch (allianceLevel) {
      case "Historical":
        return palette.success.main;
      case "Convenient":
        return palette.warning.light;
      case "Impossible":
        return palette.error.main;
      default:
        return "black";
    }
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
        width: "100%",
      }}
    >
      <Stack direction="row" spacing={1} alignItems="center">
        <UnitProfilePicture
          army={unitData.profile_origin}
          profile={unitData.name}
        />

        <Stack direction="column" alignItems="start" flexGrow={1}>
          <Stack direction="row" alignItems="center" sx={{ width: "100%" }}>
            <Box flexGrow={1}>
              <Typography variant="h6" fontWeight="bolder">
                {unitData.name}
              </Typography>
              <Typography>Points: {unitData.base_points}</Typography>
              <MwfBadge unit={unitData} />
            </Box>
            <Box sx={{ minWidth: "50px" }}>
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
            </Box>
          </Stack>

          <Stack gap={1} direction="row" flexWrap="wrap" sx={{ mt: 1 }}>
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
            {foreign && (
              <Chip
                label={unitData.faction}
                size="small"
                sx={{
                  backgroundColor: getFactionColor(unitData.faction),
                  color: "white",
                  fontWeight: "bold",
                  maxWidth: "24ch",
                  whiteSpace: "nowrap",
                  textOverflow: "ellipsis",
                }}
              />
            )}
          </Stack>
        </Stack>
      </Stack>
    </Paper>
  );
}
