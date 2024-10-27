import { ModalTypes } from "../../../components/modal/modals.tsx";
import { Slice } from "../../Slice.ts";
import { ApplicationState } from "../index.ts";

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

export const modalSlice: Slice<ApplicationState, ModalState> = (set) => ({
  ...initialModalState,

  setCurrentModal: (modal, context) =>
    set(
      { currentlyOpenendModal: modal, modalContext: context },
      undefined,
      "OPEN_MODAL",
    ),
  closeModal: () =>
    set(
      {
        currentlyOpenendModal: null,
        modalContext: null,
      },
      undefined,
      "CLOSE_MODAL",
    ),
});
