import Modal from "react-bootstrap/Modal";
import React from "react";

export function ModalWoundChart({showWoundModal, setShowWoundModal}) {
  return (<Modal
    show={showWoundModal}
    onHide={() => setShowWoundModal(false)}
    size="xl"
    centered
  >
    <Modal.Header closeButton></Modal.Header>
    <Modal.Body style={{textAlign: "center"}}>
        <img
          className="border border-secondary"
          src={require("../images/to-wound-chart.png")}
          alt=""
          style={{width: "60%"}}
        />
    </Modal.Body>
  </Modal>);
}
