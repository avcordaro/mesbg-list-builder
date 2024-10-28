import { Button, DialogActions, DialogContent } from "@mui/material";
import { useScrollToTop } from "../../../hooks/scroll-to.ts";
import { useAppState } from "../../../state/app";
import { useGameModeState } from "../../../state/gamemode";

export const BuilderModeModal = () => {
  const { setGameMode } = useGameModeState();
  const { closeModal } = useAppState();
  const scrollToTop = useScrollToTop();

  const handleContinue = () => {
    closeModal();
    setGameMode(false);
    scrollToTop();
  };

  return (
    <>
      <DialogContent>
        You will lose all current progress in this game if you switch back to
        Builder Mode. Are you sure you want to continue?
      </DialogContent>
      <DialogActions>
        <Button variant="contained" color="inherit" onClick={closeModal}>
          Back
        </Button>
        <Button
          variant="contained"
          color="primary"
          onClick={handleContinue}
          autoFocus
        >
          Continue
        </Button>
      </DialogActions>
    </>
  );
};
