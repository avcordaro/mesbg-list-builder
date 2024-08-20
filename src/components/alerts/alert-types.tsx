import { ReactNode } from "react";
import { Variant } from "react-bootstrap/types";
import { ExportAlert } from "./alerts/ExportAlert.tsx";
import { GameModeAlert } from "./alerts/GameModeAlert.tsx";

export enum AlertTypes {
  EXPORT_ALERT = "EXPORT_ALERT",
  GAMEMODE_ALERT = "GAMEMODE_ALERT",
}

type AlertOptions = {
  autoHideAfter?: number;
};

export type AlertProps = {
  variant: Variant;
  content: ReactNode;
  options?: AlertOptions;
};

export const alertMap = new Map<AlertTypes, AlertProps>([
  [
    AlertTypes.GAMEMODE_ALERT,
    {
      variant: "danger",
      content: <GameModeAlert />,
      options: {
        autoHideAfter: 12000,
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
]);
