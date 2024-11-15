import { Redo, Undo } from "@mui/icons-material";
import { Badge, Fab } from "@mui/material";
import Box from "@mui/material/Box";
import Stack from "@mui/material/Stack";
import { useTheme } from "@mui/material/styles";
import useMediaQuery from "@mui/material/useMediaQuery";
import { useTemporalRosterBuildingState } from "../../../state/roster-building";

export const FloatingUndoButtons = ({ bottom }: { bottom: string }) => {
  const theme = useTheme();
  const isTablet = useMediaQuery(theme.breakpoints.down("lg"));
  const isSmallScreen = useMediaQuery(theme.breakpoints.down("sm"));
  const { undo, redo, pastStates, futureStates } =
    useTemporalRosterBuildingState((state) => state);

  if (!isTablet) return <></>;

  return (
    <Box
      sx={{
        position: "fixed",
        bottom: bottom, // Adjust the distance from the bottom
        left: "50%",
        transform: "translateX(-50%)",
        zIndex: 1000, // Ensure it stays on top
        width: "100%",
      }}
    >
      <Stack direction="row" gap={2} justifyContent="center">
        <Badge badgeContent={pastStates.length} color="primary">
          <Fab
            color="default"
            aria-label="undo"
            variant={isSmallScreen ? "circular" : "extended"}
            onClick={() => undo()}
            disabled={pastStates.length === 0}
          >
            <Undo sx={{ mr: 1 }} />
            {!isSmallScreen && <>Undo</>}
          </Fab>
        </Badge>
        <Badge badgeContent={futureStates.length} color="primary">
          <Fab
            color="default"
            aria-label="redo"
            variant={isSmallScreen ? "circular" : "extended"}
            onClick={() => redo()}
            disabled={futureStates.length === 0}
          >
            {!isSmallScreen && <>Redo</>}
            <Redo sx={{ ml: 1 }} />
          </Fab>
        </Badge>
      </Stack>
    </Box>
  );
};
