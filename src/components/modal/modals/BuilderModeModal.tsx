import { DialogActions, DialogContent, Button } from "@mui/material";
import { useScrollToTop } from "../../../hooks/scroll-to.ts";
import { useStore } from "../../../state/store";

export const BuilderModeModal = () => {
  const { setGameMode, closeModal } = useStore();
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
