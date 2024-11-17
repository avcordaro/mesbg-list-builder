import { AlertColor } from "@mui/material";
import { ReactNode } from "react";
import { DownloadFailed } from "./alerts/DownloadFailed.tsx";
import { ExportAlert } from "./alerts/ExportAlert.tsx";
import { ExportHistoryAlert } from "./alerts/ExportHistoryAlert.tsx";
import { GameModeAlert } from "./alerts/GameModeAlert.tsx";
import { ScreenshotCopiedAlert } from "./alerts/ScreenshotCopiedAlert.tsx";

export enum AlertTypes {
  EXPORT_ALERT = "EXPORT_ALERT",
  EXPORT_HISTORY_ALERT = "EXPORT_HISTORY_ALERT",
  SCREENSHOT_COPIED_ALERT = "SCREENSHOT_COPIED_ALERT",
  GAMEMODE_ALERT = "GAMEMODE_ALERT",
  DOWNLOAD_FAILED = "DOWNLOAD_FAILED",
}

type AlertOptions = {
  autoHideAfter?: number;
};

export type AlertProps = {
  variant: AlertColor;
  content: ReactNode;
  options?: AlertOptions;
};

export const alertMap = new Map<AlertTypes, AlertProps>([
  [
    AlertTypes.GAMEMODE_ALERT,
    {
      variant: "error",
      content: <GameModeAlert />,
      options: {
        // autoHideAfter: 12000,
      },
    },
  ],
  [
    AlertTypes.EXPORT_ALERT,
    {
      variant: "success",
      content: <ExportAlert />,
      options: {
        autoHideAfter: 5000,
      },
    },
  ],
  [
    AlertTypes.EXPORT_HISTORY_ALERT,
    {
      variant: "success",
      content: <ExportHistoryAlert />,
      options: {
        autoHideAfter: 5000,
      },
    },
  ],
  [
    AlertTypes.SCREENSHOT_COPIED_ALERT,
    {
      variant: "success",
      content: <ScreenshotCopiedAlert />,
      options: {
        autoHideAfter: 5000,
      },
    },
  ],
  [
    AlertTypes.SCREENSHOT_COPIED_ALERT,
    {
      variant: "error",
      content: <DownloadFailed />,
      options: {
        // autoHideAfter: 5000,
      },
    },
  ],
]);
