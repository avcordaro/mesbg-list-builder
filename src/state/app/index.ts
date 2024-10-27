import { create } from "zustand";
import { devtools } from "zustand/middleware";
import { alertSlice, AlertState } from "./alert";
import { modalSlice, ModalState } from "./modal";
import { sidebarSlice, SidebarState } from "./sidebar";

export type ApplicationState = ModalState & SidebarState & AlertState;

export const useAppState = create<
  ApplicationState,
  [["zustand/devtools", unknown]]
>(
  devtools((...args) => ({
    ...modalSlice(...args),
    ...sidebarSlice(...args),
    ...alertSlice(...args),
  })),
);
