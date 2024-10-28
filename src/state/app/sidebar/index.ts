import { DrawerTypes } from "../../../components/drawer/drawers.tsx";
import { Slice } from "../../Slice.ts";
import { ApplicationState } from "../index.ts";

export type SidebarState = {
  currentlyOpenendSidebar: DrawerTypes | null;
  openSidebar: (sidebarType: DrawerTypes) => void;
  closeSidebar: () => void;
};

const initialState = {
  currentlyOpenendSidebar: null,
};

export const sidebarSlice: Slice<ApplicationState, SidebarState> = (set) => ({
  ...initialState,

  openSidebar: (sidebar) =>
    set({ currentlyOpenendSidebar: sidebar }, undefined, "OPEN_SIDEBAR"),
  closeSidebar: () =>
    set({ currentlyOpenendSidebar: null }, undefined, "CLOSE_SIDEBAR"),
});
