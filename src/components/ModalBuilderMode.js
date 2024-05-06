import Modal from "react-bootstrap/Modal";
import React from "react";
import Button from "react-bootstrap/Button";
import { FaHammer } from "react-icons/fa6";

export function ModalBuilderMode({showBuilderModal, setShowBuilderModal, setGameMode}) {

  const handleContinue = () => {
      setShowBuilderModal(false);
      setGameMode(false);
      sessionStorage.setItem("gameMode", "false")
      window.scrollTo(0, 0)
  };

  return (<Modal
    show={showBuilderModal}
    onHide={() => setShowBuilderModal(false)}
    size="xl"
    centered
  >
    <Modal.Header closeButton>
      <Modal.Title><FaHammer /> Back to Builder Mode</Modal.Title>
    </Modal.Header>
    <Modal.Body>
      You will lose all current progress in this game if you switch back to Builder Mode. Are you sure you want to continue?
    </Modal.Body>
    <Modal.Footer>
      <Button variant="secondary" onClick={() => setShowBuilderModal(false)}>
        Back
      </Button>
      <Button variant="primary" onClick={handleContinue}>
        Continue
      </Button>
    </Modal.Footer>
  </Modal>);
}
