import { AlertTypes } from "../../../components/alerts/alert-types.tsx";
import { Slice } from "../../Slice.ts";
import { ApplicationState } from "../index.ts";

export type AlertState = {
  activeAlert: AlertTypes | null;
  triggerAlert: (alert: AlertTypes) => void;
  dismissAlert: () => void;
};

const initialState = {
  activeAlert: null,
};

export const alertSlice: Slice<ApplicationState, AlertState> = (set) => ({
  ...initialState,

  triggerAlert: (alert) =>
    set({ activeAlert: alert }, undefined, "TRIGGER_ALERT"),
  dismissAlert: () => set({ activeAlert: null }, undefined, "DISMISS_ALERT"),
});
