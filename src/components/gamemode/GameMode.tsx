import RestartAltIcon from "@mui/icons-material/RestartAlt";
import { Button } from "@mui/material";
import Divider from "@mui/material/Divider";
import Stack from "@mui/material/Stack";
import Typography from "@mui/material/Typography";
import { useTheme } from "@mui/material/styles";
import useMediaQuery from "@mui/material/useMediaQuery";
import { useAppState } from "../../state/app";
import { useGameModeState } from "../../state/gamemode";
import { useRosterBuildingState } from "../../state/roster-building";
import { ModalTypes } from "../modal/modals.tsx";
import { Casualties } from "./Casualties.tsx";
import { ProfileCards } from "./ProfileCards.tsx";
import { HeroStatTrackers } from "./hero/HeroStatTrackers";

export const GameMode = () => {
  const {
    gameState: { started },
  } = useGameModeState();
  const {
    factions,
    allianceLevel,
    roster: { bow_count, points },
  } = useRosterBuildingState();
  const { setCurrentModal } = useAppState();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("md"));
  const isMediumScreen = useMediaQuery(theme.breakpoints.between("lg", "xl"));

  const openResetGameModal = () => {
    const gameStartTime = new Date(started);
    const gameEndTime = new Date();
    const gameDuration = gameEndTime.getTime() - gameStartTime.getTime();
    setCurrentModal(ModalTypes.RESET_GAME_MODE, {
      gameDate: gameStartTime.toISOString().slice(0, 10),
      duration: Math.ceil(gameDuration / 60000),
      points: Math.ceil(points / 50) * 50, // rounds to the nearest full 50.
      result: "Won",
      scenarioPlayed: null,
      tags: [],
      armies: factions.join(", "),
      alliance: factions.length === 1 ? "Pure" : allianceLevel,
      bows: bow_count,
      victoryPoints: "" as unknown as number,
      opponentArmies: "",
      opponentName: "",
      opponentVictoryPoints: "" as unknown as number,
    });
  };

  return (
    <Stack>
      <Stack
        direction={isMobile || isMediumScreen ? "column" : "row"}
        spacing={1}
      >
        <Button
          variant="contained"
          startIcon={<RestartAltIcon />}
          onClick={openResetGameModal}
          sx={{
            minWidth: "32ch",
          }}
        >
          End / Restart Game
        </Button>
        <Casualties />
      </Stack>
      <Typography variant="subtitle1" component="center" sx={{ mt: 1 }}>
        Note: Heroes will be automatically added as a casualty when they reach
        zero wounds below.
      </Typography>
      <Divider
        sx={{
          m: 1,
        }}
      />
      <HeroStatTrackers />
      <Divider
        sx={{
          m: 1,
        }}
      />
      <ProfileCards />
    </Stack>
  );
};
