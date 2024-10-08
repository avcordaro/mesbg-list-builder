import SaveIcon from "@mui/icons-material/Save";
import WarningAmberRoundedIcon from "@mui/icons-material/WarningAmberRounded";
import { ReactNode } from "react";
import { FaFileImport } from "react-icons/fa";
import { FaHammer, FaImage } from "react-icons/fa6";
import { TbRefresh } from "react-icons/tb";
import { BuilderModeModal } from "./modals/BuilderModeModal.tsx";
import { ChartsModal } from "./modals/ChartsModal.tsx";
import { ExportRosterModal } from "./modals/ExportRosterModal.tsx";
import { ImportRosterModal } from "./modals/ImportRosterModal.tsx";
import { IncompleteWarbandWarningModal } from "./modals/IncompleteWarbandWarningModal.tsx";
import { ModalRosterTable } from "./modals/ModalRosterTable";
import { ProfileCardModal } from "./modals/ProfileCardModal.tsx";
import { ResetGameModeModal } from "./modals/ResetGameModeModal.tsx";
import { ScreenshotRosterModal } from "./modals/ScreenshotRosterModal.tsx";

export enum ModalTypes {
  BUILDER_MODE = "BUILDER_MODE",
  PROFILE_CARD = "PROFILE_CARD",
  CHART = "CHART",
  RESET_GAME_MODE = "RESET_GAME_MODE",
  ROSTER_TABLE = "ROSTER_TABLE",
  ROSTER_SCREENSHOT = "ROSTER_SCREENSHOT",
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
    ModalTypes.BUILDER_MODE,
    {
      icon: <FaHammer />,
      title: "Back to Builder Mode",
      children: <BuilderModeModal />,
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
      icon: <></>,
      title: "",
      children: <ModalRosterTable />,
      customModalHeader: true,
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
    ModalTypes.INCOMPLETE_WARBAND_WARNING,
    {
      icon: <WarningAmberRoundedIcon />,
      title: "Incomplete warband",
      children: <IncompleteWarbandWarningModal />,
    },
  ],
]);
