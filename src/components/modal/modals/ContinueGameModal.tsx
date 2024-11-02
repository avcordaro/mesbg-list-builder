import { Button, DialogActions, DialogContent } from "@mui/material";
import Box from "@mui/material/Box";
import { useScrollToTop } from "../../../hooks/scroll-to.ts";
import { useAppState } from "../../../state/app";
import { useGameModeState } from "../../../state/gamemode";
import { useRecentGamesState } from "../../../state/recent-games";
import { useRosterBuildingState } from "../../../state/roster-building";
import { useCurrentRosterState } from "../../../state/rosters";
import { isDefinedUnit } from "../../../types/unit.ts";
import { AlertTypes } from "../../alerts/alert-types.tsx";
import { ModalTypes } from "../modals.tsx";

export const ContinueGameModal = () => {
  const { setGameMode, startNewGame, gameState } = useGameModeState();
  const { roster, allianceLevel } = useRosterBuildingState();
  const { activeRoster } = useCurrentRosterState();
  const { setShowHistory } = useRecentGamesState();
  const { closeModal, triggerAlert, setCurrentModal } = useAppState();
  const scrollToTop = useScrollToTop();

  const handleContinue = () => {
    setGameMode(true);
    setShowHistory(false);
    closeModal();
    scrollToTop();
  };

  const handleStartNewGame = () => {
    const warbandsWithoutHero = roster.warbands.filter(
      (warband) => !isDefinedUnit(warband.hero),
    );

    if (warbandsWithoutHero.length > 0) {
      setCurrentModal(ModalTypes.INCOMPLETE_WARBAND_WARNING);
      return;
    }

    startNewGame(roster, allianceLevel);
    setShowHistory(false);
    closeModal();
    scrollToTop();
  };

  const handleGameMode = (continueGame: boolean) => {
    if (parseInt(roster.version.substring(0, 1)) < 5) {
      triggerAlert(AlertTypes.GAMEMODE_ALERT);
      return;
    }

    if (continueGame) handleContinue();
    else handleStartNewGame();
  };

  return (
    <>
      <DialogContent>
        There is still recent a game for <b>{activeRoster}</b> present. Would
        you like to continue the game you started on{" "}
        {new Date(gameState.started).toLocaleDateString("en-UK", {
          day: "2-digit",
          month: "long",
          hour: "2-digit",
          minute: "2-digit",
        })}
        , or would you rather start a new game?
      </DialogContent>
      <DialogActions>
        <Button variant="contained" color="inherit" onClick={closeModal}>
          Cancel
        </Button>
        <Box flexGrow={1} />
        <Button
          variant="text"
          color="inherit"
          onClick={() => handleGameMode(false)}
          autoFocus
        >
          Start new game
        </Button>
        <Button
          variant="contained"
          color="primary"
          onClick={() => handleGameMode(true)}
          autoFocus
        >
          Continue game
        </Button>
      </DialogActions>
    </>
  );
};
