import Modal from "react-bootstrap/Modal";
import hero_constraint_data from "../data/hero_constraint_data.json";
import React from "react";

/* Displays a modal with an image of the chosen profile card of the unit. */

export function ModalProfileCard({
                                   showCardModal, setShowCardModal, cardUnitData,
                                 }) {
  return (<Modal
    show={showCardModal}
    onHide={() => setShowCardModal(false)}
    size="xl"
    centered
  >
    <Modal.Header closeButton>
      <div>
        <h5>
          <b>
            {cardUnitData != null && "(" + cardUnitData.faction + ") " + cardUnitData.name}
          </b>
        </h5>
        <h6>
          You can download a zip of all profile cards for your current army
          list by clicking{" "}
          <b className="text-primary">Roster Table {">"} Profile Cards</b>
        </h6>
      </div>
    </Modal.Header>
    <Modal.Body style={{textAlign: "center"}}>
      {cardUnitData != null && (<>
        <img
          className="profile_card border border-secondary"
          src={(() => {
            try {
              return require("../images/" + cardUnitData.profile_origin + "/cards/" + cardUnitData.name + ".jpg");
            } catch (e) {
              return require("../images/default_card.jpg");
            }
          })()}
          alt=""
        />
        {cardUnitData.unit_type.includes("Hero") && hero_constraint_data[cardUnitData.model_id][0]["extra_profiles"].length !== 0 && hero_constraint_data[cardUnitData.model_id][0]["extra_profiles"].map((profile) => (
          <img
            className="profile_card border border-secondary mt-3"
            src={(() => {
              try {
                return require("../images/" + cardUnitData.profile_origin + "/cards/" + profile + ".jpg");
              } catch (e) {
                return require("../images/default_card.jpg");
              }
            })()}
            alt=""
          />))}
      </>)}
    </Modal.Body>
  </Modal>);
}
