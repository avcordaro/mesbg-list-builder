import {
  AlertTitle,
  Button,
  DialogActions,
  DialogContent,
  FormControl,
  FormControlLabel,
  Radio,
  RadioGroup,
} from "@mui/material";
import Alert from "@mui/material/Alert";
import Box from "@mui/material/Box";
import Stack from "@mui/material/Stack";
import Typography from "@mui/material/Typography";
import { useTheme } from "@mui/material/styles";
import useMediaQuery from "@mui/material/useMediaQuery";
import { ChangeEvent, useRef, useState } from "react";
import { useAppState } from "../../../state/app";
import { useGameModeState } from "../../../state/gamemode";
import { useRecentGamesState } from "../../../state/recent-games";
import {
  GameResultsForm,
  GameResultsFormHandlers,
} from "../../common/game-results-form/GameResultsForm.tsx";

export const ResetGameModeModal = () => {
  const theme = useTheme();
  const isTablet = useMediaQuery(theme.breakpoints.down("xl"));
  const isMobile = useMediaQuery(theme.breakpoints.down("md"));
  const { closeModal } = useAppState();
  const {
    setGameMode,
    updateGameState,
    initializeGameState,
    gameMetaData: { iGameState },
  } = useGameModeState();
  const { setShowHistory } = useRecentGamesState();
  const childRef = useRef<GameResultsFormHandlers>(null);
  const [afterCloseAction, setAfterCloseAction] = useState("restart");

  const handleSkip = () => {
    console.log(afterCloseAction);
    switch (afterCloseAction) {
      case "restart":
        setGameMode(true);
        setShowHistory(false);
        updateGameState({ ...iGameState }); // iGameState = the initial gamestate, when the game was started.
        break;
      case "return-to-builder":
        setGameMode(false);
        setShowHistory(false);
        // initializeGameState clears any previous state, allowing a new match te be started
        // The previous game was ended, right? ... RIGHT?!
        initializeGameState();
        break;
      case "open-recent-matches":
        setGameMode(true);
        setShowHistory(true);
        // initializeGameState clears any previous state, allowing a new match te be started
        // The previous game was ended, right? ... RIGHT?!
        initializeGameState();
        break;
    }

    closeModal();
  };

  const handleChange = (event: ChangeEvent<HTMLInputElement>) => {
    setAfterCloseAction((event.target as HTMLInputElement).value);
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

        <FormControl sx={{ width: "100%" }}>
          <RadioGroup
            row
            aria-labelledby="Action after submitting form"
            name="action"
            sx={{
              justifyContent: "center",
            }}
            value={afterCloseAction}
            onChange={handleChange}
          >
            <FormControlLabel
              value="restart"
              control={<Radio />}
              label="Reset trackers & start new match"
            />
            <FormControlLabel
              value="return-to-builder"
              control={<Radio />}
              label="Return to roster builder"
            />
            <FormControlLabel
              value="open-recent-matches"
              control={<Radio />}
              label="Open your recent matches"
            />
          </RadioGroup>
        </FormControl>
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
