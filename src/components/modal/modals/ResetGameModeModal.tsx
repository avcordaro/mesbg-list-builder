import {
  AlertTitle,
  Button,
  DialogActions,
  DialogContent,
} from "@mui/material";
import Alert from "@mui/material/Alert";
import Box from "@mui/material/Box";
import Stack from "@mui/material/Stack";
import Typography from "@mui/material/Typography";
import { useTheme } from "@mui/material/styles";
import useMediaQuery from "@mui/material/useMediaQuery";
import { useRef } from "react";
import { useAppState } from "../../../state/app";
import {
  GameResultsForm,
  GameResultsFormHandlers,
} from "../../common/game-results-form/GameResultsForm.tsx";

export const ResetGameModeModal = () => {
  const theme = useTheme();
  const isTablet = useMediaQuery(theme.breakpoints.down("xl"));
  const isMobile = useMediaQuery(theme.breakpoints.down("md"));
  const { closeModal } = useAppState();
  const childRef = useRef<GameResultsFormHandlers>(null);

  const handleSkip = () => {
    // TODO: Based on the ant-switch, return to game- or builder-mode.
    closeModal();
  };

  const saveGameToState = () => {
    if (childRef.current) {
      if (childRef.current.saveToState()) {
        // TODO: Based on the ant-switch, return to game- or builder-mode.
        closeModal();
      }
    }
  };

  return (
    <>
      <DialogContent sx={{ minWidth: isTablet ? "80vw" : "50vw" }}>
        <Alert severity="info">
          <AlertTitle>
            <strong>Saving game results</strong>
          </AlertTitle>
          <Typography variant="body2">
            Ending your game allows you to save the results of said game. If you
            do not wish to save game results you can use the <em>skip</em>{" "}
            button to close the dialog and skip saving the results.
          </Typography>
        </Alert>

        <GameResultsForm ref={childRef} />

        {/*  TODO: Add ant style switch indicating to stay in game mode or go back to builder mode */}
      </DialogContent>
      <DialogActions>
        <Stack
          direction={isMobile ? "column" : "row"}
          gap={2}
          sx={{ width: "100%", p: 1 }}
        >
          {!isMobile && (
            <>
              <Button variant="outlined" color="inherit" onClick={closeModal}>
                Return to game
              </Button>
              <Box flexGrow={1} />
            </>
          )}
          <Button
            variant="text"
            color="inherit"
            onClick={handleSkip}
            sx={{ minWidth: "20ch" }}
          >
            Continue without saving
          </Button>
          <Button
            variant="contained"
            color="primary"
            onClick={saveGameToState}
            sx={{ minWidth: "20ch" }}
          >
            Save game
          </Button>
        </Stack>
      </DialogActions>
    </>
  );
};
