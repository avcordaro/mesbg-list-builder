import { Close } from "@mui/icons-material";
import ClearIcon from "@mui/icons-material/Clear";
import { InputAdornment, TextField } from "@mui/material";
import Box from "@mui/material/Box";
import IconButton from "@mui/material/IconButton";
import Stack from "@mui/material/Stack";
import { ChangeEvent, useEffect, useRef, useState } from "react";
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
  const { updateBuilderSidebar, heroSelection, selectedFaction, factionType } =
    useRosterBuildingState();

  const listRef = useRef<HTMLDivElement>();
  const [listHeight, setListHeight] = useState("");
  const [filterValue, setFilterValue] = useState("");

  const updateListHeight = () => {
    const listRect = listRef.current?.getBoundingClientRect();
    if (listRect.top > 0) {
      const height = `calc(100svh - ${listRect.top}px)`;
      setListHeight(height);
    }
  };

  useEffect(() => {
    window.addEventListener("resize", updateListHeight);
    window.addEventListener("scroll", updateListHeight);
    return () => {
      window.removeEventListener("resize", updateListHeight);
      window.removeEventListener("scroll", updateListHeight);
    };
  }, []);

  useEffect(() => updateListHeight());

  useEffect(() => {
    setFilterValue("");
  }, [heroSelection, selectedFaction]);

  const handleClear = () => {
    setFilterValue("");
  };

  return (
    <Stack sx={{ width: "calc(100% - 1px)" }}>
      <Stack direction="row" alignItems="end" spacing={1}>
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
      <Stack spacing={1} sx={{ mt: 1, position: "relative" }}>
        <TextField
          id="selection-filter"
          placeholder={
            heroSelection
              ? factionType.includes("LL")
                ? `Search for any hero from ${selectedFaction}`
                : `Search for any hero ${factionType ? "from the forces of " + factionType.split(" ")[0].toLowerCase() : ""}`
              : `Search for any unit from ${selectedFaction}`
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
        <Stack
          ref={listRef}
          spacing={1}
          sx={{
            mt: 1,
            position: "sticky",
            height: listHeight,
            overflowY: "scroll",
            scrollbarWidth: 0,
          }}
        >
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
    </Stack>
  );
};
