import Modal from "react-bootstrap/Modal";
import React from "react";
import Button from "react-bootstrap/Button";
import {TbRefresh} from "react-icons/tb";

export function ModalGameModeReset({showResetModal, setShowResetModal, handleReset}) {

  const handleContinue = () => {
    handleReset();
    setShowResetModal(false); 
  };

  return (<Modal
    show={showResetModal}
    onHide={() => setShowResetModal(false)}
    size="xl"
    centered
  >
    <Modal.Header closeButton>
      <Modal.Title><TbRefresh /> {"Reset Game Mode?"}</Modal.Title>
    </Modal.Header>
    <Modal.Body>
      This will reset all Might, Will, Fate and Wound counters for your heroes, and also reset the casualty counter. Are you sure you want to continue?
    </Modal.Body>
    <Modal.Footer>
      <Button variant="secondary" onClick={() => setShowResetModal(false)}>
        Back
      </Button>
      <Button variant="primary" onClick={handleContinue}>
        Continue
      </Button>
    </Modal.Footer>
  </Modal>);
}
