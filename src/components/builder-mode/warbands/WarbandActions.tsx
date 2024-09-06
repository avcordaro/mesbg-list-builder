import Button from "react-bootstrap/Button";
import { HiDuplicate } from "react-icons/hi";
import { MdDelete } from "react-icons/md";
import { useStore } from "../../../state/store.ts";
import { Warband } from "../../../types/warband.ts";

export const WarbandActions = ({ warband }: { warband: Warband }) => {
  const { duplicateWarband, deleteWarband, updateBuilderSidebar } = useStore();

  const handleCopyWarband = () => {
    duplicateWarband(warband.id);
    updateBuilderSidebar({
      warriorSelection: false,
      heroSelection: false,
    });
  };

  const handleDeleteWarband = () => {
    deleteWarband(warband.id);
    updateBuilderSidebar({
      warriorSelection: false,
      heroSelection: false,
    });
  };

  return (
    <>
      <Button
        onClick={() => handleCopyWarband()}
        className="mt-1 ms-auto mb-2"
        style={{ marginRight: "10px" }}
        variant="info"
      >
        <HiDuplicate />
      </Button>
      <Button
        onClick={() => handleDeleteWarband()}
        className="mt-1 mb-2"
        style={{ marginRight: "10px" }}
        variant="danger"
      >
        <MdDelete />
      </Button>
    </>
  );
};
