import Button from "react-bootstrap/Button";
import Stack from "react-bootstrap/Stack";
import { BsFillPersonVcardFill } from "react-icons/bs";
import { FaMinus, FaPlus } from "react-icons/fa";
import { HiDuplicate } from "react-icons/hi";
import { ImCross } from "react-icons/im";
import { useStore } from "../../../state/store.ts";
import { Unit } from "../../../types/unit.ts";
import { ModalTypes } from "../../modal/modals.tsx";

export const WarriorActions = ({
  unit,
  warbandId,
}: {
  unit: Unit;
  warbandId: string;
}) => {
  const { setCurrentModal, updateUnit, deleteUnit, duplicateUnit } = useStore();

  const handleIncrement = () => {
    updateUnit(warbandId, unit.id, {
      quantity: unit.quantity + 1,
    });
  };

  const handleDecrement = () => {
    const quantity = unit.quantity - 1;
    updateUnit(warbandId, unit.id, {
      quantity: quantity > 1 ? quantity : 1, // if value goes below 1, clamp the value to 1.
    });
  };

  const handleDelete = () => {
    deleteUnit(warbandId, unit.id);
  };

  const handleDuplicate = () => {
    duplicateUnit(warbandId, unit.id);
  };

  const handleCardClick = (e) => {
    // Update the state variables so that the correct profile card is loaded, and the pop-up modal is displayed.
    e.stopPropagation();
    setCurrentModal(ModalTypes.PROFILE_CARD, {
      unitData: unit,
      title: `(${unit.faction}) ${unit.name}`,
    });
  };

  return (
    <Stack direction="horizontal" gap={3} className="ms-auto mt-auto">
      {unit.unit_type !== "Siege" && (
        <Button
          className="border"
          variant="secondary"
          onClick={handleCardClick}
        >
          <BsFillPersonVcardFill />
        </Button>
      )}

      {(unit.unit_type === "Warrior" || unit.unit_type === "Siege") && (
        <>
          <Button onClick={handleDecrement} disabled={unit.quantity === 1}>
            <FaMinus />
          </Button>
          <p className="mt-3">
            <b>{unit.quantity}</b>
          </p>
          <Button onClick={handleIncrement}>
            <FaPlus />
          </Button>

          {unit.unit_type === "Warrior" && (
            <Button onClick={handleDuplicate} variant="info">
              <HiDuplicate />
            </Button>
          )}
        </>
      )}
      <Button
        style={{ marginRight: "10px" }}
        variant="warning"
        onClick={handleDelete}
      >
        <ImCross />
      </Button>
    </Stack>
  );
};
