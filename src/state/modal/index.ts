import { ModalTypes } from "../../components/modal/modals.tsx";
import { Slice } from "../store.ts";

// eslint-disable-next-line @typescript-eslint/no-explicit-any
type ModalContext = any;

export type ModalState = {
  currentlyOpenendModal: ModalTypes | null;
  modalContext?: ModalContext;
  setCurrentModal: (key: ModalTypes, context?: ModalContext) => void;
  closeModal: () => void;
};

const initialModalState = {
  currentlyOpenendModal: null,
  modalContext: null,
};

export const modalSlice: Slice<ModalState> = (set) => ({
  ...initialModalState,

  setCurrentModal: (modal, context) =>
    set({ currentlyOpenendModal: modal, modalContext: context }),
  closeModal: () =>
    set({
      currentlyOpenendModal: null,
      modalContext: null,
    }),
});
