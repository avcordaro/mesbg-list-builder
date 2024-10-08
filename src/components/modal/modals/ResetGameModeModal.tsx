import { DialogActions, DialogContent, Button } from "@mui/material";
import { useStore } from "../../../state/store.ts";

export const ResetGameModeModal = () => {
  const { modalContext, closeModal } = useStore();

  const handleContinue = () => {
    modalContext.handleReset();
    closeModal();
  };

  return (
    <>
      <DialogContent>
        This will reset all Might, Will, Fate and Wound counters for your
        heroes, and also reset the casualty counter. Are you sure you want to
        continue?
      </DialogContent>
      <DialogActions>
        <Button variant="outlined" color="inherit" onClick={closeModal}>
          Back
        </Button>
        <Button variant="contained" color="warning" onClick={handleContinue}>
          Continue
        </Button>
      </DialogActions>
    </>
  );
};
