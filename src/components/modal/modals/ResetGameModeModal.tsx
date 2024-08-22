import Button from "react-bootstrap/Button";
import Modal from "react-bootstrap/Modal";
import { useStore } from "../../../state/store.ts";

export const ResetGameModeModal = () => {
  const { modalContext, closeModal } = useStore();

  const handleContinue = () => {
    modalContext.handleReset();
    closeModal();
  };

  return (
    <>
      <Modal.Body>
        This will reset all Might, Will, Fate and Wound counters for your
        heroes, and also reset the casualty counter. Are you sure you want to
        continue?
      </Modal.Body>
      <Modal.Footer>
        <Button variant="secondary" onClick={closeModal}>
          Back
        </Button>
        <Button variant="primary" onClick={handleContinue}>
          Continue
        </Button>
      </Modal.Footer>
    </>
  );
};
