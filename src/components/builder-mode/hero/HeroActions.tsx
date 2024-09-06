import { FunctionComponent, MouseEventHandler } from "react";
import Button from "react-bootstrap/Button";
import Stack from "react-bootstrap/Stack";
import { BsFillPersonVcardFill } from "react-icons/bs";
import { ImCross } from "react-icons/im";
import { useStore } from "../../../state/store.ts";
import { Unit } from "../../../types/unit.ts";
import { ModalTypes } from "../../modal/modals.tsx";

type HeroActionsProps = {
  warbandId: string;
  unit: Unit;
};

export const HeroActions: FunctionComponent<HeroActionsProps> = ({
  unit,
  warbandId,
}) => {
  const { setCurrentModal, deleteHero } = useStore();

  const handleDelete = () => deleteHero(warbandId, unit.id);

  const handleCardClick: MouseEventHandler<HTMLButtonElement> = (e) => {
    // Update the state variables so that the correct profile card is loaded, and the pop-up modal is displayed.
    e.stopPropagation();
    setCurrentModal(ModalTypes.PROFILE_CARD, {
      unitData: unit,
      title: `(${unit.faction}) ${unit.name}`,
    });
  };

  return (
    <Stack direction="horizontal" gap={3} className="ms-auto mt-auto">
      <Button
        style={{ marginBottom: "5px" }}
        className="border"
        variant="secondary"
        onClick={handleCardClick}
      >
        <BsFillPersonVcardFill />
      </Button>
      <Button
        style={{ marginRight: "10px", marginBottom: "5px" }}
        variant="warning"
        onClick={handleDelete}
      >
        <ImCross />
      </Button>
    </Stack>
  );
};
