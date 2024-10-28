import { RefreshOutlined } from "@mui/icons-material";
import { Button } from "@mui/material";
import Divider from "@mui/material/Divider";
import Stack from "@mui/material/Stack";
import Typography from "@mui/material/Typography";
import { useTheme } from "@mui/material/styles";
import useMediaQuery from "@mui/material/useMediaQuery";
import { useEffect } from "react";
import { useAppState } from "../../state/app";
import { useGameModeState } from "../../state/gamemode";
import { ModalTypes } from "../modal/modals.tsx";
import { Casualties } from "./Casualties.tsx";
import { ProfileCards } from "./ProfileCards.tsx";
import { HeroStatTrackers } from "./hero/HeroStatTrackers";

export const GameMode = () => {
  const { startNewGame } = useGameModeState();
  const { setCurrentModal } = useAppState();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("md"));
  const isMediumScreen = useMediaQuery(theme.breakpoints.between("lg", "xl"));

  const openResetGameModal = () =>
    setCurrentModal(ModalTypes.RESET_GAME_MODE, { handleReset: startNewGame });

  useEffect(() => {
    const handleBeforeUnload = (event: BeforeUnloadEvent) => {
      event.preventDefault();
    };
    window.addEventListener("beforeunload", handleBeforeUnload);
    return () => {
      window.removeEventListener("beforeunload", handleBeforeUnload);
    };
  }, []);

  return (
    <Stack>
      <Stack
        direction={isMobile || isMediumScreen ? "column" : "row"}
        spacing={1}
      >
        <Button
          variant="contained"
          startIcon={<RefreshOutlined />}
          onClick={openResetGameModal}
          sx={{
            minWidth: "24ch",
          }}
        >
          Reset All
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
