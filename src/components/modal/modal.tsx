import Modal from "react-bootstrap/Modal";
import { useStore } from "../../state/store.ts";
import { modalMap } from "./modal-map.tsx";

export const ModalContainer = () => {
  const state = useStore();

  if (!state.currentlyOpenendModal) {
    // No model is shown, return...
    return null;
  }

  const currentModal = modalMap.get(state.currentlyOpenendModal);
  return (
    <Modal
      show={true} // handled by the modal container, so this should always be true
      onHide={() => state.closeModal()}
      size="xl"
      centered
    >
      <Modal.Header closeButton>
        <Modal.Title>
          {currentModal.icon} {currentModal.title}
        </Modal.Title>
      </Modal.Header>
      {currentModal.children}
    </Modal>
  );
};
