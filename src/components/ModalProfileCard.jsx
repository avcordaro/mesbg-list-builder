import Modal from "react-bootstrap/Modal";
import hero_constraint_data from "../assets/data/hero_constraint_data.json";
import { UnitProfileCard } from "./UnitProfilePicture.tsx";

/* Displays a modal with an image of the chosen profile card of the unit. */

export function ModalProfileCard({
  showCardModal,
  setShowCardModal,
  cardUnitData,
}) {
  return (
    <Modal
      show={showCardModal}
      onHide={() => setShowCardModal(false)}
      size="xl"
      centered
    >
      <Modal.Header closeButton>
        <div>
          <h5>
            <b>
              {cardUnitData != null &&
                "(" + cardUnitData.faction + ") " + cardUnitData.name}
            </b>
          </h5>
          <h6>
            You can download a zip of all profile cards for your current army
            list by clicking{" "}
            <b className="text-primary">Roster Table {">"} Profile Cards</b>
          </h6>
        </div>
      </Modal.Header>
      <Modal.Body style={{ textAlign: "center" }}>
        {cardUnitData != null && (
          <>
            <UnitProfileCard
              className="profile_card border border-secondary"
              army={cardUnitData.profile_origin}
              profile={cardUnitData.name}
            />
            {cardUnitData.unit_type.includes("Hero") &&
              hero_constraint_data[cardUnitData.model_id][0]["extra_profiles"]
                .length !== 0 &&
              hero_constraint_data[cardUnitData.model_id][0][
                "extra_profiles"
              ].map((profile) => (
                <UnitProfileCard
                  className="profile_card border border-secondary mt-3"
                  army={cardUnitData.profile_origin}
                  profile={profile}
                />
              ))}
          </>
        )}
      </Modal.Body>
    </Modal>
  );
}
