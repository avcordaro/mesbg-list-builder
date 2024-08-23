import Button from "react-bootstrap/Button";
import Stack from "react-bootstrap/Stack";
import { TbRefresh } from "react-icons/tb";
import { useStore } from "../../state/store.ts";
import { ModalTypes } from "../modal/modals.tsx";
import { Casualties } from "./Casualties.tsx";
import { GameModeInfo } from "./GameModeInfo.jsx";
import { ProfileCards } from "./ProfileCards.tsx";
import { HeroStatTrackers } from "./hero/HeroStatTrackers";

export const GameMode = () => {
  const { startNewGame, setCurrentModal } = useStore();
  const openResetGameModal = () =>
    setCurrentModal(ModalTypes.RESET_GAME_MODE, { handleReset: startNewGame });
  return (
    <div>
      <GameModeInfo />
      <div style={{ marginLeft: "535px", minWidth: "720px" }}>
        <Stack direction="horizontal" style={{ minWidth: "800px" }}>
          <Button className="m-2" onClick={openResetGameModal}>
            <TbRefresh /> Reset All
          </Button>
          <Casualties />
        </Stack>
        <h6 className="m-0 ms-2 mt-3 text-muted">
          Note: Heroes will be automatically added as a casualty when they reach
          zero wounds below.
        </h6>
        <hr className="mb-5" style={{ width: "720px" }} />
        <HeroStatTrackers />
        <hr className="mt-5 mb-3" style={{ width: "720px" }} />
        <ProfileCards />
      </div>
    </div>
  );
};
