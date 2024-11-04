import { Button, DialogActions, DialogContent } from "@mui/material";
import { useTheme } from "@mui/material/styles";
import useMediaQuery from "@mui/material/useMediaQuery";
import { useRef } from "react";
import { useAppState } from "../../../state/app";
import {
  GameResultsForm,
  GameResultsFormHandlers,
} from "../../common/game-results-form/GameResultsForm.tsx";

export const CreateGameResultModal = () => {
  const { closeModal, modalContext } = useAppState();
  const theme = useTheme();
  const isTablet = useMediaQuery(theme.breakpoints.down("xl"));
  const childRef = useRef<GameResultsFormHandlers>(null);

  const saveGameToState = () => {
    if (childRef.current) {
      if (childRef.current.saveToState()) {
        closeModal();
      }
    }
  };

  return (
    <>
      <DialogContent sx={{ minWidth: isTablet ? "80vw" : "50vw" }}>
        <GameResultsForm ref={childRef} />
      </DialogContent>
      <DialogActions>
        <Button
          variant="text"
          color="inherit"
          onClick={closeModal}
          sx={{ minWidth: "20ch" }}
        >
          Cancel
        </Button>
        <Button
          variant="contained"
          color="primary"
          onClick={saveGameToState}
          sx={{ minWidth: "20ch" }}
        >
          {modalContext.mode} game
        </Button>
      </DialogActions>
    </>
  );
};
