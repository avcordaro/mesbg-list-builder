import { AddOutlined, RemoveOutlined } from "@mui/icons-material";
import IconButton from "@mui/material/IconButton";
import Stack from "@mui/material/Stack";
import Typography from "@mui/material/Typography";
import { Option, Unit } from "../../../types/unit.ts";

const MWF_MAP = { Might: 0, Will: 1, Fate: 2 };

export const OptionCounter = ({
  warbandId,
  unit,
  option,
  updateState,
}: {
  warbandId: string;
  unit: Unit;
  option: Option;
  updateState: (
    warbandId: string,
    unitId: string,
    update: Partial<Unit>,
  ) => void;
}) => {
  const updateMwfw = (option, value): [string | number, string][] => {
    if (["Might", "Will", "Fate"].includes(option)) {
      const mwfw = unit.MWFW[0][1].split(":");
      mwfw[MWF_MAP[option]] = String(value);
      return [["", mwfw.join(":")]];
    } else {
      return unit.MWFW;
    }
  };

  const handleQuantity = (newQuantity) => {
    /* Handles updates for options that require a quantity, rather than a toggle. This includes
                        updating any changes to points and bow count when the quantity is changed.*/
    if (newQuantity > option.max || newQuantity < option.min) {
      return null;
    }

    updateState(warbandId, unit.id, {
      options: unit.options.map((o) => {
        if (option.option_id !== o.option_id) {
          return o;
        }
        return {
          ...o,
          opt_quantity: newQuantity,
        };
      }),
      MWFW: updateMwfw(option.option, newQuantity),
    });
  };

  return (
    <Stack
      direction="row"
      spacing={2}
      alignItems="center"
      gap={1}
      sx={{ mt: 1 }}
    >
      <IconButton
        onClick={() => handleQuantity(option.opt_quantity - 1)}
        aria-label="remove one"
        sx={{
          border: 1,
          borderRadius: 2,
          backgroundColor: "inherit",
          color: "grey",
        }}
        size="small"
      >
        <RemoveOutlined />
      </IconButton>
      <b style={{ width: "20px", textAlign: "center" }}>
        {option.opt_quantity}
      </b>

      <IconButton
        onClick={() => handleQuantity(option.opt_quantity + 1)}
        aria-label="add one"
        sx={{
          border: 1,
          borderRadius: 2,
          backgroundColor: "inherit",
          color: "grey",
        }}
        size="small"
      >
        <AddOutlined />
      </IconButton>
      <Typography>
        {option.option + " (" + option.points + " points)"}
      </Typography>
    </Stack>
  );
};
