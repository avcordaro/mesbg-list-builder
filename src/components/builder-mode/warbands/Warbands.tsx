import Button from "react-bootstrap/Button";
import Stack from "react-bootstrap/Stack";
import { FaPlus } from "react-icons/fa";
import { useStore } from "../../../state/store.js";
import { Warband } from "./Warband.tsx";

/* Displays the list of all warbands, and also defines how each warband card looks. */

export const Warbands = () => {
  const { roster, addWarband, updateBuilderSidebar } = useStore();

  const handleNewWarband = () => {
    addWarband();
    updateBuilderSidebar({
      warriorSelection: false,
    });
  };

  return (
    <Stack style={{ marginLeft: "535px" }} gap={3}>
      {roster.warbands.map((warband) => (
        <Warband key={warband.id} warband={warband} />
      ))}
      <Button onClick={() => handleNewWarband()} style={{ width: "850px" }}>
        Add Warband <FaPlus />
      </Button>
    </Stack>
  );
};
