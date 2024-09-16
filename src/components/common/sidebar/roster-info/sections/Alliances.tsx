import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import Chip from "@mui/material/Chip";
import Stack from "@mui/material/Stack";
import Typography from "@mui/material/Typography";
import { useTheme } from "@mui/material/styles";
import useMediaQuery from "@mui/material/useMediaQuery";
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

  const theme = useTheme();
  const isMobileScreen = useMediaQuery(theme.breakpoints.down("sm"));
  const isLargeScreen = useMediaQuery(theme.breakpoints.up("lg"));

  const shouldWrapButtons = isMobileScreen || isLargeScreen;

  return (
    <Box sx={{ my: 2 }}>
      <Stack
        direction={shouldWrapButtons ? "column" : "row"}
        justifyContent="center"
        spacing={3}
      >
        <Stack direction="row" spacing={1} flexGrow={1}>
          <Typography variant="h6">Alliance Level:</Typography>
          <Chip
            sx={{
              color: "white",
              fontWeight: "bolder",
              background: theme.palette[allianceColours[allianceLevel]].light,
            }}
            label={allianceLevel}
          />
        </Stack>
        {!gameMode ? (
          <Button
            variant="outlined"
            color="inherit"
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
