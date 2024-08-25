import { SidebarTypes } from "../../components/sidebar-drawer/sidebars.tsx";
import { Slice } from "../store.ts";

export type SidebarState = {
  currentlyOpenendSidebar: SidebarTypes | null;
  openSidebar: (sidebarType: SidebarTypes) => void;
  closeSidebar: () => void;
};

const initialState = {
  currentlyOpenendSidebar: null,
};

export const sidebarSlice: Slice<SidebarState> = (set) => ({
  ...initialState,

  openSidebar: (sidebar) =>
    set({ currentlyOpenendSidebar: sidebar }, undefined, "OPEN_SIDEBAR"),
  closeSidebar: () =>
    set({ currentlyOpenendSidebar: null }, undefined, "CLOSE_SIDEBAR"),
});
