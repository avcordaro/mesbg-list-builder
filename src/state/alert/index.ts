import { AlertTypes } from "../../components/alerts/alert-types.tsx";
import { Slice } from "../store.ts";

export type AlertState = {
  activeAlert: AlertTypes | null;
  triggerAlert: (alert: AlertTypes) => void;
  dismissAlert: () => void;
};

const initialState = {
  activeAlert: null,
};

export const alertSlice: Slice<AlertState> = (set) => ({
  ...initialState,

  triggerAlert: (alert) => set({ activeAlert: alert }),
  dismissAlert: () => set({ activeAlert: null }),
});
