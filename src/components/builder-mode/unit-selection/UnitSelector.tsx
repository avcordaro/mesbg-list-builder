import { Close } from "@mui/icons-material";
import ClearIcon from "@mui/icons-material/Clear";
import { InputAdornment, TextField } from "@mui/material";
import Box from "@mui/material/Box";
import IconButton from "@mui/material/IconButton";
import Stack from "@mui/material/Stack";
import { useTheme } from "@mui/material/styles";
import useMediaQuery from "@mui/material/useMediaQuery";
import { ChangeEvent, useEffect, useState } from "react";
import { useRosterBuildingState } from "../../../state/roster-building";
import { FactionPicker } from "./FactionPicker.tsx";
import { HeroSelectionList } from "./selection-list/HeroSelectionList.tsx";
import { SiegeEquipmentSelectionList } from "./selection-list/SiegeEquipmentSelectionList.tsx";
import { WarriorSelectionList } from "./selection-list/WarriorSelectionList.tsx";

const CloseUnitSelectorButton = () => {
  const { updateBuilderSidebar } = useRosterBuildingState();

  return (
    <IconButton
      onClick={() =>
        updateBuilderSidebar({
          warriorSelection: false,
        })
      }
      sx={{
        borderRadius: 2,
        backgroundColor: "inherit",
        color: "grey",
      }}
    >
      <Close />
    </IconButton>
  );
};

export const UnitSelector = () => {
  const theme = useTheme();
  const isTablet = useMediaQuery(theme.breakpoints.down("xl"));
  const { updateBuilderSidebar, heroSelection, selectedFaction, factionType } =
    useRosterBuildingState();

  const [filterValue, setFilterValue] = useState("");

  useEffect(() => {
    setFilterValue("");
  }, [heroSelection, selectedFaction]);

  const handleClear = () => {
    setFilterValue("");
  };

  return (
    <Stack sx={{ width: "calc(100% - 1px)" }}>
      <Stack
        direction={isTablet ? "column-reverse" : "row"}
        alignItems="end"
        spacing={1}
      >
        <Box sx={{ width: "100%" }}>
          <FactionPicker
            onChange={(v) =>
              updateBuilderSidebar({
                selectedFaction: v.title,
              })
            }
          />
        </Box>
        <Box>
          <CloseUnitSelectorButton />
        </Box>
      </Stack>
      <Stack spacing={1} sx={{ mt: 1 }}>
        <TextField
          id="selection-filter"
          placeholder={
            heroSelection
              ? factionType.includes("LL")
                ? `Search for any hero inside ${selectedFaction}`
                : `Search for any hero ${factionType ? "from the forces of " + factionType.split(" ")[0].toLowerCase() : ""}`
              : `Search for a unit in ${selectedFaction}`
          }
          size="small"
          value={filterValue}
          onChange={(event: ChangeEvent<HTMLInputElement>) => {
            setFilterValue(event.target.value);
          }}
          slotProps={{
            input: {
              endAdornment: filterValue && (
                <InputAdornment position="end">
                  <IconButton onClick={handleClear} edge="end">
                    <ClearIcon />
                  </IconButton>
                </InputAdornment>
              ),
            },
          }}
        />
        {heroSelection ? (
          <HeroSelectionList faction={selectedFaction} filter={filterValue} />
        ) : (
          <>
            <WarriorSelectionList filter={filterValue} />
            <SiegeEquipmentSelectionList filter={filterValue} />
          </>
        )}
      </Stack>
    </Stack>
  );
};
