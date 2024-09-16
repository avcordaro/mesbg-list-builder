import {
  AddOutlined,
  Cancel,
  ContentCopyOutlined,
  RemoveOutlined,
} from "@mui/icons-material";
import IconButton from "@mui/material/IconButton";
import Stack from "@mui/material/Stack";
import Typography from "@mui/material/Typography";
import { useTheme } from "@mui/material/styles";
import useMediaQuery from "@mui/material/useMediaQuery";
import { BsFillPersonVcardFill } from "react-icons/bs";
import { useStore } from "../../../state/store.ts";
import { Unit } from "../../../types/unit.ts";
import { ModalTypes } from "../../modal/modals.tsx";

const QuantityButtons = ({
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
      <IconButton
        onClick={handleDecrement}
        disabled={unit.quantity === 1}
        size="large"
        sx={{
          borderRadius: 2,
          backgroundColor: palette.primary.light,
          color: palette.primary.contrastText,
          "&:hover": {
            backgroundColor: palette.primary.main,
          },
        }}
      >
        <RemoveOutlined />
      </IconButton>
      <Typography variant="body1" component="p" sx={{ pt: 1.5 }}>
        <b>{unit.quantity}</b>
      </Typography>
      <IconButton
        onClick={handleIncrement}
        size="large"
        sx={{
          borderRadius: 2,
          backgroundColor: palette.primary.light,
          color: palette.primary.contrastText,
          "&:hover": {
            backgroundColor: palette.primary.main,
          },
        }}
      >
        <AddOutlined />
      </IconButton>
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
  const { setCurrentModal, deleteUnit, duplicateUnit } = useStore();
  const { palette, breakpoints } = useTheme();
  const isMobile = useMediaQuery(breakpoints.down("sm"));

  const handleDelete = () => {
    deleteUnit(warbandId, unit.id);
  };

  const handleDuplicate = () => {
    duplicateUnit(warbandId, unit.id);
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
    <Stack>
      {isMobile && (
        <Stack
          direction="row"
          spacing={2}
          justifyContent={isMobile ? "center" : "end"}
          sx={{ width: "100%", p: 2 }}
        >
          <QuantityButtons unit={unit} warbandId={warbandId} />
        </Stack>
      )}
      <Stack
        direction="row"
        spacing={2}
        justifyContent={isMobile ? "center" : "end"}
        sx={{ width: "100%", p: 2 }}
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
            {!isMobile && <QuantityButtons unit={unit} warbandId={warbandId} />}
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
          onClick={handleDelete}
          size="large"
          sx={{
            borderRadius: 2,
            backgroundColor: palette.warning.light,
            color: palette.warning.contrastText,
            "&:hover": {
              backgroundColor: palette.warning.main,
            },
          }}
        >
          <Cancel />
        </IconButton>
      </Stack>
    </Stack>
  );
};
