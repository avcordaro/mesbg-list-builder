import { RefreshOutlined } from "@mui/icons-material";
import { Button } from "@mui/material";
import Divider from "@mui/material/Divider";
import Stack from "@mui/material/Stack";
import Typography from "@mui/material/Typography";
import { useStore } from "../../state/store.ts";
import { ModalTypes } from "../modal/modals.tsx";
import { Casualties } from "./Casualties.tsx";
import { ProfileCards } from "./ProfileCards.tsx";
import { HeroStatTrackers } from "./hero/HeroStatTrackers";

export const GameMode = () => {
  const { startNewGame, setCurrentModal } = useStore();
  const openResetGameModal = () =>
    setCurrentModal(ModalTypes.RESET_GAME_MODE, { handleReset: startNewGame });
  return (
    <Stack>
      <Stack direction="row">
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
