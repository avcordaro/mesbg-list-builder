import Stack from "@mui/material/Stack";
import Typography from "@mui/material/Typography";
import { Unit } from "../../../types/unit.ts";

export const MwfBadge = ({ unit }: { unit: Unit }) => {
  if (!unit.MWFW || unit.MWFW.length === 0) {
    return null;
  }

  const [might, will, fate] = unit.MWFW[0][1].split(":");
  return (
    <Stack
      direction="row"
      component="div"
      sx={{
        m: 0,
        p: 0,
      }}
    >
      <Typography
        variant="body2"
        component="div"
        sx={{
          backgroundColor: "grey",
          color: "white",
          borderRadius: "5px 0px 0px 5px",
          pl: "8px",
          pr: "8px",
          fontSize: "13px",
          fontWeight: "bold",
          border: "1px solid grey",
        }}
      >
        M W F
      </Typography>
      <Typography
        variant="body2"
        component="span"
        sx={{
          color: "black",
          borderRadius: "0 5px 5px 0",
          pl: "8px",
          pr: "8px",
          fontSize: "13px",
          fontWeight: "bold",
          border: "1px solid grey",
        }}
      >
        {might} / {will} / {fate}
      </Typography>
    </Stack>
  );
};
