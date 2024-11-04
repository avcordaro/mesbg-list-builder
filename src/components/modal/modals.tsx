import { ListAlt, SaveAs } from "@mui/icons-material";
import EmojiEventsIcon from "@mui/icons-material/EmojiEvents";
import FortIcon from "@mui/icons-material/Fort";
import RestartAltIcon from "@mui/icons-material/RestartAlt";
import SaveIcon from "@mui/icons-material/Save";
import WarningAmberRoundedIcon from "@mui/icons-material/WarningAmberRounded";
import { ReactNode } from "react";
import { FaFileImport } from "react-icons/fa";
import { FaImage } from "react-icons/fa6";
import { ChartsModal } from "./modals/ChartsModal.tsx";
import { ContinueGameModal } from "./modals/ContinueGameModal.tsx";
import { CreateGameResultModal } from "./modals/CreateGameResultModal.tsx";
import { CreateNewRosterModal } from "./modals/CreateNewRosterModal.tsx";
import { EndGameResultModal } from "./modals/EndGameResultModal.tsx";
import { ExportRosterModal } from "./modals/ExportRosterModal.tsx";
import { ImportRosterModal } from "./modals/ImportRosterModal.tsx";
import { IncompleteWarbandWarningModal } from "./modals/IncompleteWarbandWarningModal.tsx";
import { ModalRosterTable } from "./modals/ModalRosterTable";
import { ProfileCardModal } from "./modals/ProfileCardModal.tsx";
import { SaveRosterAsModal } from "./modals/SaveRosterAsModal.tsx";
import { ScreenshotRosterModal } from "./modals/ScreenshotRosterModal.tsx";

export enum ModalTypes {
  CONTINUE_GAME = "CONTINUE_GAME",
  PROFILE_CARD = "PROFILE_CARD",
  CHART = "CHART",
  RESET_GAME_MODE = "RESET_GAME_MODE",
  CREATE_GAME_RESULT = "CREATE_GAME_RESULT",
  ROSTER_TABLE = "ROSTER_TABLE",
  ROSTER_SCREENSHOT = "ROSTER_SCREENSHOT",
  CREATE_NEW_ROSTER = "CREATE_NEW_ROSTER",
  SAVE_AS_NEW_ROSTER = "SAVE_AS_NEW_ROSTER",
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
      icon: <RestartAltIcon />,
      title: "Game results",
      children: <EndGameResultModal />,
    },
  ],
  [
    ModalTypes.CREATE_GAME_RESULT,
    {
      icon: <EmojiEventsIcon />,
      title: "Game results",
      children: <CreateGameResultModal />,
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
    ModalTypes.SAVE_AS_NEW_ROSTER,
    {
      icon: <SaveAs />,
      title: "Save as new roster",
      children: <SaveRosterAsModal />,
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
