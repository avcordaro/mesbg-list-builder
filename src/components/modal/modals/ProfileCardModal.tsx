import { Fragment } from "react";
import Modal from "react-bootstrap/Modal";
import hero_constraint_data from "../../../assets/data/hero_constraint_data.json";
import { useStore } from "../../../state/store.ts";
import { Unit } from "../../../types/unit.ts";
import { UnitProfileCard } from "../../UnitProfilePicture.tsx";

/* Displays a modal with an image of the chosen profile card of the unit. */

export const ProfileCardModal = () => {
  const {
    modelContext: { unitData },
  } = useStore();

  const ExtraProfileCards = ({ unit }: { unit: Unit }) => {
    if (!unit.unit_type.includes("Hero")) {
      return null;
    }

    const [heroData] = hero_constraint_data[unitData.model_id];
    return heroData?.extra_profiles?.map((profile) => (
      <Fragment key={profile}>
        <UnitProfileCard
          className="profile_card border border-secondary mt-3"
          army={unitData.profile_origin}
          profile={profile}
        />
      </Fragment>
    ));
  };

  return (
    <>
      <Modal.Body style={{ textAlign: "center" }}>
        <h6>
          You can download a zip of all profile cards for your current army list
          by clicking{" "}
          <b className="text-primary">Roster Table {">"} Profile Cards</b>
        </h6>

        {unitData != null && (
          <>
            <UnitProfileCard
              className="profile_card border border-secondary"
              army={unitData.profile_origin}
              profile={unitData.name}
            />
            <ExtraProfileCards unit={unitData} />
          </>
        )}
      </Modal.Body>
      <Modal.Footer></Modal.Footer>
    </>
  );
};
