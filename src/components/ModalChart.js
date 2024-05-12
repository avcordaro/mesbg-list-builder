import Modal from "react-bootstrap/Modal";
import React from "react";

export function ModalChart({selectedChart, showChartModal, setShowChartModal}) {
  return (<Modal
    show={showChartModal}
    onHide={() => setShowChartModal(false)}
    size="xl"
    centered
  >
    <Modal.Header closeButton></Modal.Header>
    <Modal.Body style={{textAlign: "center"}}>
        <img
          className="border border-secondary"
          src={require("../images/charts/" + selectedChart + ".png")}
          alt=""
          style={{maxWidth: "100%"}}
        />
    </Modal.Body>
  </Modal>);
}
