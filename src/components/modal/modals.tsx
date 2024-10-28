import { ListAlt } from "@mui/icons-material";
import FortIcon from "@mui/icons-material/Fort";
import SaveIcon from "@mui/icons-material/Save";
import WarningAmberRoundedIcon from "@mui/icons-material/WarningAmberRounded";
import { ReactNode } from "react";
import { FaFileImport } from "react-icons/fa";
import { FaImage } from "react-icons/fa6";
import { TbRefresh } from "react-icons/tb";
import { ChartsModal } from "./modals/ChartsModal.tsx";
import { ContinueGameModal } from "./modals/ContinueGameModal.tsx";
import { CreateNewRosterModal } from "./modals/CreateNewRosterModal.tsx";
import { ExportRosterModal } from "./modals/ExportRosterModal.tsx";
import { ImportRosterModal } from "./modals/ImportRosterModal.tsx";
import { IncompleteWarbandWarningModal } from "./modals/IncompleteWarbandWarningModal.tsx";
import { ModalRosterTable } from "./modals/ModalRosterTable";
import { ProfileCardModal } from "./modals/ProfileCardModal.tsx";
import { ResetGameModeModal } from "./modals/ResetGameModeModal.tsx";
import { ScreenshotRosterModal } from "./modals/ScreenshotRosterModal.tsx";

export enum ModalTypes {
  CONTINUE_GAME = "CONTINUE_GAME",
  PROFILE_CARD = "PROFILE_CARD",
  CHART = "CHART",
  RESET_GAME_MODE = "RESET_GAME_MODE",
  ROSTER_TABLE = "ROSTER_TABLE",
  ROSTER_SCREENSHOT = "ROSTER_SCREENSHOT",
  CREATE_NEW_ROSTER = "CREATE_NEW_ROSTER",
  EXPORT_ROSTER = "EXPORT_ROSTER",
  IMPORT_ROSTER = "IMPORT_ROSTER",
  INCOMPLETE_WARBAND_WARNING = "INCOMPLETE_WARBAND_WARNING",
}

export type ModalProps = {
  children: ReactNode;
  icon: ReactNode;
  title: string;
  customModalHeader?: boolean;
};

export const modals = new Map<ModalTypes, ModalProps>([
  [
    ModalTypes.CONTINUE_GAME,
    {
      icon: <FortIcon />,
      title: "Continue existing game",
      children: <ContinueGameModal />,
    },
  ],
  [
    ModalTypes.IMPORT_ROSTER,
    {
      icon: <FaFileImport />,
      title: "Import roster",
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
      icon: <ListAlt />,
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
  [
    ModalTypes.EXPORT_ROSTER,
    {
      icon: <SaveIcon />,
      title: "Export roster",
      children: <ExportRosterModal />,
    },
  ],
  [
    ModalTypes.CREATE_NEW_ROSTER,
    {
      icon: <SaveIcon />,
      title: "Create new roster",
      children: <CreateNewRosterModal />,
    },
  ],
  [
    ModalTypes.INCOMPLETE_WARBAND_WARNING,
    {
      icon: <WarningAmberRoundedIcon />,
      title: "Incomplete warband",
      children: <IncompleteWarbandWarningModal />,
    },
  ],
]);
