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
  const { startNewGame } = useGameModeState();
  const { roster, allianceLevel } = useRosterBuildingState();
  const { setCurrentModal } = useAppState();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("md"));
  const isMediumScreen = useMediaQuery(theme.breakpoints.between("lg", "xl"));

  const openResetGameModal = () =>
    setCurrentModal(ModalTypes.RESET_GAME_MODE, {
      handleReset: () => startNewGame(roster, allianceLevel),
    });

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
