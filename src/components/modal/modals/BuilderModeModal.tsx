import Button from "react-bootstrap/Button";
import Modal from "react-bootstrap/Modal";
import { useStore } from "../../../state/store";

export const BuilderModeModal = () => {
  const { setGameMode, closeModal } = useStore();

  const handleContinue = () => {
    closeModal();
    setGameMode(false);
    window.scrollTo(0, 0);
  };

  return (
    <>
      <Modal.Body>
        You will lose all current progress in this game if you switch back to
        Builder Mode. Are you sure you want to continue?
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
