import { DialogActions, DialogContent, Button } from "@mui/material";
import { useStore } from "../../../state/store";

export const BuilderModeModal = () => {
  const { setGameMode, closeModal } = useStore();

  const handleContinue = () => {
    closeModal();
    setGameMode(false);
    window.scrollTo(0, 0);
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
