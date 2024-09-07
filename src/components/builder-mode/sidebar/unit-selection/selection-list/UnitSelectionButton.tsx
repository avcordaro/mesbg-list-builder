import Badge from "react-bootstrap/Badge";
import Button from "react-bootstrap/Button";
import Stack from "react-bootstrap/Stack";
import { BsFillPersonVcardFill } from "react-icons/bs";
import { useStore } from "../../../../../state/store";
import { Unit } from "../../../../../types/unit.ts";
import { UnitProfilePicture } from "../../../../common/images/UnitProfilePicture";
import { ModalTypes } from "../../../../modal/modals";

export function UnitSelectionButton({ unitData }: { unitData: Unit }) {
  const {
    setCurrentModal,
    selectUnit,
    warriorSelectionFocus,
    heroSelection,
    updateBuilderSidebar,
    assignHeroToWarband,
  } = useStore();
  const [focusedWarbandId, focusedUnitId] = warriorSelectionFocus;

  const handleClick = () => {
    (heroSelection ? assignHeroToWarband : selectUnit)(
      focusedWarbandId,
      focusedUnitId,
      unitData,
    );
    updateBuilderSidebar({
      warriorSelection: false,
      heroSelection: false,
    });
  };

  const handleCardClick = (e) => {
    // Update the state variables so that the correct profile card is loaded, and the pop-up modal is displayed.
    e.stopPropagation();
    setCurrentModal(ModalTypes.PROFILE_CARD, {
      unitData,
      title: `(${unitData.faction}) ${unitData.name}`,
    });
  };

  return (
    <Button
      variant="light"
      style={{ width: "461px", textAlign: "left" }}
      onClick={handleClick}
      className="border shadow-sm"
    >
      <Stack direction="horizontal" gap={3}>
        <UnitProfilePicture
          army={unitData.profile_origin}
          profile={unitData.name}
          className="profile"
        />
        <div>
          <b>{unitData.name}</b>
          <br />
          Points: {unitData.base_points}
          {unitData.MWFW && unitData.MWFW.length > 0 ? (
            <>
              <br />
              <div className="mt-1">
                <span className="m-0 mwf-name border border-secondary">
                  M W F
                </span>
                <span className="m-0 mwf-value border border-secondary">
                  {unitData.MWFW[0][1].split(":")[0]}{" "}
                  <span className="m-0" style={{ color: "lightgrey" }}>
                    /
                  </span>{" "}
                  {unitData.MWFW[0][1].split(":")[1]}{" "}
                  <span className="m-0" style={{ color: "lightgrey" }}>
                    /
                  </span>{" "}
                  {unitData.MWFW[0][1].split(":")[2]}
                </span>
              </div>
            </>
          ) : (
            <div></div>
          )}
          {unitData.unit_type !== "Warrior" && (
            <Badge className="mt-2" bg="dark">
              {unitData.unit_type}
            </Badge>
          )}
        </div>
        <Button
          className="ms-auto me-2 border"
          variant="secondary"
          onClick={handleCardClick}
        >
          <BsFillPersonVcardFill />
        </Button>
      </Stack>
    </Button>
  );
}
