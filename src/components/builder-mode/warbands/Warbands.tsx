import AddIcon from "@mui/icons-material/Add";
import Button from "@mui/material/Button";
import Stack from "@mui/material/Stack";
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
    <Stack spacing={1} sx={{ pb: 16 }}>
      {roster.warbands.map((warband) => (
        <Warband key={warband.id} warband={warband} />
      ))}
      <Button
        onClick={() => handleNewWarband()}
        endIcon={<AddIcon />}
        variant="contained"
      >
        Add Warband
      </Button>
    </Stack>
  );
};
