import Modal from "react-bootstrap/Modal";
import { useStore } from "../../state/store.ts";
import { modals } from "./modals.tsx";

export const ModalContainer = () => {
  const state = useStore();

  if (!state.currentlyOpenendModal) {
    // No model is shown, return...
    return null;
  }

  const currentModal = modals.get(state.currentlyOpenendModal);
  const { title } = state?.modelContext || {};
  return (
    <Modal
      show={true} // handled by the modal container, so this should always be true
      onHide={() => state.closeModal()}
      size="xl"
      centered
    >
      <Modal.Header closeButton>
        <Modal.Title>
          {currentModal.icon} {title || currentModal.title}
        </Modal.Title>
      </Modal.Header>
      {currentModal.children}
    </Modal>
  );
};
