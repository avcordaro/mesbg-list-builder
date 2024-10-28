import PriorityHighIcon from "@mui/icons-material/PriorityHigh";
import Box from "@mui/material/Box";
import Divider from "@mui/material/Divider";
import Stack from "@mui/material/Stack";
import Typography from "@mui/material/Typography";
import { useRosterBuildingState } from "../../../../../state/roster-building";

export function RosterWarnings() {
  const { rosterBuildingWarnings } = useRosterBuildingState();

  if (rosterBuildingWarnings.length === 0) return null;

  return (
    <Box sx={{ mt: 2 }}>
      <Divider>
        <Stack direction="row" justifyContent="center" alignItems="center">
          <PriorityHighIcon />
          <Typography variant="h6">Warnings</Typography>
        </Stack>
      </Divider>
      {rosterBuildingWarnings.map((w, i) => (
        <Typography sx={{ mt: 1.5 }} key={i} color="error">
          {w}
        </Typography>
      ))}
    </Box>
  );
}
