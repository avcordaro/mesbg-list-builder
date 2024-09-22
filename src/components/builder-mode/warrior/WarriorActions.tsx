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
import { useStore } from "../../../state/store.ts";
import { isDefinedUnit, Unit } from "../../../types/unit.ts";
import { ModalTypes } from "../../modal/modals.tsx";

export const QuantityButtons = ({
  unit,
  warbandId,
}: {
  unit: Unit;
  warbandId: string;
}) => {
  const { updateUnit } = useStore();
  const { palette } = useTheme();

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

  return (
    <>
      {unit.unit_type == "Warrior" && (
        <>
          <IconButton
            onClick={handleDecrement}
            disabled={unit.quantity === 1}
            sx={{
              borderRadius: 2,
              backgroundColor: palette.primary.main,
              color: palette.primary.contrastText,
              "&:hover": {
                backgroundColor: palette.primary.dark,
              },
            }}
          >
            <RemoveOutlined />
          </IconButton>
          <IconButton
            onClick={handleIncrement}
            sx={{
              borderRadius: 2,
              backgroundColor: palette.primary.main,
              color: palette.primary.contrastText,
              "&:hover": {
                backgroundColor: palette.primary.dark,
              },
            }}
          >
            <AddOutlined />
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
  const {
    roster,
    factionSelection,
    setCurrentModal,
    deleteUnit,
    duplicateUnit,
    updateBuilderSidebar,
  } = useStore();
  const { palette, breakpoints } = useTheme();
  const isMobile = useMediaQuery(breakpoints.down("sm"));

  const hero = roster.warbands.find(({ id }) => warbandId === id)?.hero;
  const warbandHasHero = isDefinedUnit(hero);

  const handleReselect = () => {
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
    setTimeout(() => {
      document
        .querySelectorAll(`[data-scroll-id="${newUnitId}"]`)
        .item(0)
        ?.scrollIntoView({
          behavior: "smooth",
        });
    });
  };

  const handleCardClick = (e) => {
    // Update the state variables so that the correct profile card is loaded, and the pop-up modal is displayed.
    e.stopPropagation();
    setCurrentModal(ModalTypes.PROFILE_CARD, {
      unitData: unit,
      title: `(${unit.faction}) ${unit.name}`,
    });
  };

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
                sx={{
                  borderRadius: 2,
                  backgroundColor: palette.info.light,
                  color: palette.info.contrastText,
                  "&:hover": {
                    backgroundColor: palette.info.main,
                  },
                }}
              >
                <ContentCopyOutlined />
              </IconButton>
            )}
          </>
        )}
        <IconButton
          onClick={handleReselect}
          size="large"
          sx={{
            borderRadius: 2,
            backgroundColor: palette.warning.main,
            color: palette.warning.contrastText,
            "&:hover": {
              backgroundColor: palette.warning.light,
            },
          }}
        >
          <RestartAlt />
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
          <Cancel />
        </IconButton>
      </Stack>
    </Stack>
  );
};
