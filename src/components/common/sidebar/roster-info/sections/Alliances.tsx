import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import Chip from "@mui/material/Chip";
import Stack from "@mui/material/Stack";
import Typography from "@mui/material/Typography";
import { LuSwords } from "react-icons/lu";
import { allianceColours } from "../../../../../constants/alliances.ts";
import { useStore } from "../../../../../state/store.ts";
import { DrawerTypes } from "../../../../drawer/drawers.tsx";
import { ChartsDropdown } from "./ChartsDropdown.tsx";

export const Alliance = () => {
  const {
    openSidebar,
    factions: factionList,
    allianceLevel,
    factionType,
    gameMode,
  } = useStore();

  return (
    <Box sx={{ mt: 2 }}>
      <Stack
        direction="row"
        justifyContent="center"
        alignItems="center"
        spacing={3}
      >
        <Typography variant="h6">Alliance Level:</Typography>
        <Chip label={allianceLevel} color={allianceColours[allianceLevel]} />
        {!gameMode ? (
          <Button
            variant="outlined"
            color="inherit"
            sx={{
              ml: "auto !important",
            }}
            onClick={() => openSidebar(DrawerTypes.ALLIANCE)}
            disabled={!factionList.length || factionType.includes("LL")}
            startIcon={<LuSwords />}
          >
            Alliances
          </Button>
        ) : (
          <ChartsDropdown />
        )}
      </Stack>
    </Box>
  );
};
