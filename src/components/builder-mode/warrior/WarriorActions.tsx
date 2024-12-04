import {
  AddOutlined,
  Cancel,
  ContentCopyOutlined,
  RemoveOutlined,
  RestartAlt,
} from "@mui/icons-material";
import IconButton from "@mui/material/IconButton";
import Stack from "@mui/material/Stack";
import { useTheme } from "@mui/material/styles";
import useMediaQuery from "@mui/material/useMediaQuery";
import { BsFillPersonVcardFill } from "react-icons/bs";
import {
  useScrollToElement,
  useScrollToTop,
} from "../../../hooks/scroll-to.ts";
import { useAppState } from "../../../state/app";
import { useUserPreferences } from "../../../state/preference";
import { useRosterBuildingState } from "../../../state/roster-building";
import { isDefinedUnit, Unit } from "../../../types/unit.ts";
import { ModalTypes } from "../../modal/modals.tsx";

export const QuantityButtons = ({
  unit,
  warbandId,
}: {
  unit: Unit;
  warbandId: string;
}) => {
  const { updateUnit, roster } = useRosterBuildingState();
  const { useDenseMode } = useUserPreferences();

  const { palette, breakpoints } = useTheme();
  const isMobile = useMediaQuery(breakpoints.down("sm"));

  const warband = roster.warbands.find(({ id }) => warbandId === id);
  const hero = warband?.hero;
  const warbandHasHero = isDefinedUnit(hero);
  const warbandIsCappedOnUnits = warband.num_units >= Number(warband.max_units);

  const handleIncrement = () => {
    updateUnit(warbandId, unit.id, {
      quantity: unit.quantity + 1,
    });
  };

  const handleDecrement = () => {
    const quantity = unit.quantity - 1;
    updateUnit(warbandId, unit.id, {
      quantity: quantity > 1 ? quantity : 1, // if value goes below 1, clamp the value to 1.
    });
  };

  const iconSize = isMobile && useDenseMode ? "1rem" : "1.5rem";
  return (
    <>
      {unit.unit_type == "Warrior" && (
        <>
          <IconButton
            onClick={handleDecrement}
            disabled={unit.quantity === 1 || !warbandHasHero}
            sx={{
              borderRadius: 2,
              backgroundColor: palette.primary.main,
              color: palette.primary.contrastText,
              "&:hover": {
                backgroundColor: palette.primary.dark,
              },
            }}
          >
            <RemoveOutlined sx={{ fontSize: iconSize }} />
          </IconButton>
          <IconButton
            onClick={handleIncrement}
            disabled={!warbandHasHero || warbandIsCappedOnUnits}
            sx={{
              borderRadius: 2,
              backgroundColor: palette.primary.main,
              color: palette.primary.contrastText,
              "&:hover": {
                backgroundColor: palette.primary.dark,
              },
            }}
          >
            <AddOutlined sx={{ fontSize: iconSize }} />
          </IconButton>
        </>
      )}
    </>
  );
};

export const WarriorActions = ({
  unit,
  warbandId,
}: {
  unit: Unit;
  warbandId: string;
}) => {
  const { roster, deleteUnit, duplicateUnit, updateBuilderSidebar } =
    useRosterBuildingState();
  const { setCurrentModal } = useAppState();
  const { useDenseMode } = useUserPreferences();

  const { palette, breakpoints } = useTheme();
  const isMobile = useMediaQuery(breakpoints.down("sm"));
  const scrollTo = useScrollToElement();
  const scrollToTop = useScrollToTop("sidebar");

  const hero = roster.warbands.find(({ id }) => warbandId === id)?.hero;
  const warbandHasHero = isDefinedUnit(hero);

  const handleReselect = () => {
    if (!warbandHasHero) {
      return;
    }

    const { faction } = hero;

    updateBuilderSidebar({
      heroSelection: false,
      warriorSelection: true,
      warriorSelectionFocus: [warbandId, unit.id],
      selectedFaction: faction,
    });
    setTimeout(scrollToTop, null);
  };

  const handleDelete = () => {
    deleteUnit(warbandId, unit.id);
    updateBuilderSidebar({
      heroSelection: false,
      warriorSelection: false,
    });
  };

  const handleDuplicate = () => {
    const newUnitId = duplicateUnit(warbandId, unit.id);
    updateBuilderSidebar({
      heroSelection: false,
      warriorSelection: false,
    });
    setTimeout(scrollTo, null, newUnitId);
  };

  const handleCardClick = (e) => {
    // Update the state variables so that the correct profile card is loaded, and the pop-up modal is displayed.
    e.stopPropagation();
    setCurrentModal(ModalTypes.PROFILE_CARD, {
      unitData: unit,
      title: `(${unit.faction}) ${unit.name}`,
    });
  };

  const iconSize = isMobile && useDenseMode ? "0.8rem" : "1.5rem";
  return (
    <Stack justifyContent="end">
      <Stack
        direction="row"
        spacing={2}
        justifyContent={isMobile ? "center" : "end"}
        sx={{ width: "100%" }}
      >
        {unit.unit_type !== "Siege" && (
          <IconButton
            onClick={handleCardClick}
            sx={{
              borderRadius: 2,
              p: 1.5,
              color: "white",
              backgroundColor: palette.grey.A700,
              fontSize: iconSize,
              "&:hover": {
                backgroundColor: palette.grey["900"],
              },
            }}
          >
            <BsFillPersonVcardFill />
          </IconButton>
        )}

        {(unit.unit_type === "Warrior" || unit.unit_type === "Siege") && (
          <>
            {unit.unit_type === "Warrior" && (
              <IconButton
                onClick={handleDuplicate}
                size="large"
                disabled={!warbandHasHero}
                sx={{
                  borderRadius: 2,
                  backgroundColor: palette.info.light,
                  color: palette.info.contrastText,
                  "&:hover": {
                    backgroundColor: palette.info.main,
                  },
                }}
              >
                <ContentCopyOutlined sx={{ fontSize: iconSize }} />
              </IconButton>
            )}
          </>
        )}
        <IconButton
          onClick={handleReselect}
          size="large"
          disabled={!warbandHasHero}
          sx={{
            borderRadius: 2,
            backgroundColor: palette.warning.main,
            color: palette.warning.contrastText,
            "&:hover": {
              backgroundColor: palette.warning.light,
            },
          }}
        >
          <RestartAlt sx={{ fontSize: iconSize }} />
        </IconButton>
        <IconButton
          onClick={handleDelete}
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
          <Cancel sx={{ fontSize: iconSize }} />
        </IconButton>
      </Stack>
    </Stack>
  );
};
