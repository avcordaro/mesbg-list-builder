import { AlertColor } from "@mui/material";
import { ReactNode } from "react";
import { ExportAlert } from "./alerts/ExportAlert.tsx";
import { GameModeAlert } from "./alerts/GameModeAlert.tsx";
import { ScreenshotCopiedAlert } from "./alerts/ScreenshotCopiedAlert.tsx";

export enum AlertTypes {
  EXPORT_ALERT = "EXPORT_ALERT",
  SCREENSHOT_COPIED_ALERT = "SCREENSHOT_COPIED_ALERT",
  GAMEMODE_ALERT = "GAMEMODE_ALERT",
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
    AlertTypes.SCREENSHOT_COPIED_ALERT,
    {
      variant: "success",
      content: <ScreenshotCopiedAlert />,
      options: {
        autoHideAfter: 5000,
      },
    },
  ],
]);
