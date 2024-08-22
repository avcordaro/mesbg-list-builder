import { ReactNode } from "react";
import { FaFileImport } from "react-icons/fa";
import { FaHammer, FaImage } from "react-icons/fa6";
import { TbRefresh } from "react-icons/tb";
import { BuilderModeModal } from "./modals/BuilderModeModal.tsx";
import { ChartsModal } from "./modals/ChartsModal.tsx";
import { ImportRosterModal } from "./modals/ImportRosterModal.tsx";
import { ModalRosterTable } from "./modals/ModalRosterTable";
import { ProfileCardModal } from "./modals/ProfileCardModal.tsx";
import { ResetGameModeModal } from "./modals/ResetGameModeModal.tsx";
import { ScreenshotRosterModal } from "./modals/ScreenshotRosterModal.tsx";

export enum ModalTypes {
  BUILDER_MODE = "BUILDER_MODE",
  IMPORT_ROSTER_JSON = "IMPORT_ROSTER_JSON",
  PROFILE_CARD = "PROFILE_CARD",
  CHART = "CHART",
  RESET_GAME_MODE = "RESET_GAME_MODE",
  ROSTER_TABLE = "ROSTER_TABLE",
  ROSTER_SCREENSHOT = "ROSTER_SCREENSHOT",
}

export type ModalProps = {
  children: ReactNode;
  icon: ReactNode;
  title: string;
};

export const modals = new Map<ModalTypes, ModalProps>([
  [
    ModalTypes.BUILDER_MODE,
    {
      icon: <FaHammer />,
      title: "Back to Builder Mode",
      children: <BuilderModeModal />,
    },
  ],
  [
    ModalTypes.IMPORT_ROSTER_JSON,
    {
      icon: <FaFileImport />,
      title: "Import JSON",
      children: <ImportRosterModal />,
    },
  ],
  [
    ModalTypes.PROFILE_CARD,
    {
      icon: <></>,
      title: "Profile card(s)",
      children: <ProfileCardModal />,
    },
  ],
  [
    ModalTypes.CHART,
    {
      icon: <></>,
      title: "",
      children: <ChartsModal />,
    },
  ],
  [
    ModalTypes.RESET_GAME_MODE,
    {
      icon: <TbRefresh />,
      title: "Reset Game Mode?",
      children: <ResetGameModeModal />,
    },
  ],
  [
    ModalTypes.ROSTER_TABLE,
    {
      icon: <></>,
      title: "Roster Table",
      children: <ModalRosterTable />,
    },
  ],
  [
    ModalTypes.ROSTER_SCREENSHOT,
    {
      icon: <FaImage />,
      title: "Screenshot",
      children: <ScreenshotRosterModal />,
    },
  ],
]);
