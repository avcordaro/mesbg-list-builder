import PriorityHighIcon from "@mui/icons-material/PriorityHigh";
import Box from "@mui/material/Box";
import Divider from "@mui/material/Divider";
import Stack from "@mui/material/Stack";
import Typography from "@mui/material/Typography";
import { useStore } from "../../../../../state/store.ts";

export function RosterWarnings() {
  const { rosterBuildingWarnings: warnings } = useStore();

  if (warnings.length === 0) return null;

  return (
    <Box sx={{ mt: 2 }}>
      <Divider>
        <Stack direction="row" justifyContent="center" alignItems="center">
          <PriorityHighIcon />
          <Typography variant="h6">Warnings</Typography>
        </Stack>
      </Divider>
      {warnings.map((w, i) => (
        <Typography key={i} color="error">
          {w}
        </Typography>
      ))}
    </Box>
  );
}
