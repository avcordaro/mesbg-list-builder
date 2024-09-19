import { Button, DialogActions, DialogContent } from "@mui/material";
import Alert from "@mui/material/Alert";
import Typography from "@mui/material/Typography";
import { useStore } from "../../../state/store.ts";
import { isDefinedUnit } from "../../../types/unit.ts";

export const IncompleteWarbandWarningModal = () => {
  const { roster, closeModal, startNewGame } = useStore();

  const continueToGameMode = () => {
    startNewGame();
    closeModal();
  };

  const incorrectWarbands = roster.warbands
    .filter((warband) => !isDefinedUnit(warband.hero))
    .map((warband) => warband.num);

  return (
    <>
      <DialogContent>
        <Alert severity="warning" icon={false}>
          Your current roster has some warbands without a captain to lead them.
        </Alert>
        <Typography variant="body1" sx={{ p: 1, mt: 1 }}>
          Currently{" "}
          {incorrectWarbands.length === 1 ? (
            <>
              <b>warband {incorrectWarbands[0]}</b> has
            </>
          ) : (
            <>
              <b>
                warbands{" "}
                {incorrectWarbands.join(", ").replace(/, ([^,]*)$/, " & $1")}
              </b>{" "}
              have
            </>
          )}{" "}
          no leader. For the correct and best gamemode experience please add a
          hero to this warband.
        </Typography>
      </DialogContent>
      <DialogActions>
        <Button variant="text" onClick={continueToGameMode}>
          Continue anyway
        </Button>
        <Button variant="contained" color="primary" onClick={closeModal}>
          Go back
        </Button>
      </DialogActions>
    </>
  );
};
