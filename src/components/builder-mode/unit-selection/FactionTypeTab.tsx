import ClearIcon from "@mui/icons-material/Clear";
import { InputAdornment, TextField } from "@mui/material";
import IconButton from "@mui/material/IconButton";
import Stack from "@mui/material/Stack";
import { ChangeEvent, useEffect, useState } from "react";
import { useRosterBuildingState } from "../../../state/roster-building";
import { Tabs } from "../../../state/roster-building/builder-selection";
import { FactionType } from "../../../types/factions.ts";
import { FactionPickerDropdown } from "./FactionPickerDropdown.tsx";
import { HeroSelectionList } from "./selection-list/HeroSelectionList.tsx";
import { SiegeEquipmentSelectionList } from "./selection-list/SiegeEquipmentSelectionList.tsx";
import { WarriorSelectionList } from "./selection-list/WarriorSelectionList.tsx";

export function FactionTypeTab({
  type,
  activeTab,
}: {
  type: FactionType;
  activeTab: Tabs;
}) {
  const { heroSelection, factionSelection } = useRosterBuildingState();
  const [filterValue, setFilterValue] = useState("");

  useEffect(() => {
    setFilterValue("");
  }, [heroSelection, factionSelection]);

  const handleClear = () => {
    setFilterValue("");
  };

  return (
    <div
      role="tabpanel"
      hidden={activeTab !== type}
      id={`simple-tabpanel-${type}`}
      aria-labelledby={`simple-tab-${type}`}
    >
      <Stack spacing={1} sx={{ mt: 1 }}>
        <FactionPickerDropdown type={type} />
        <TextField
          id="selection-filter"
          label="Filter"
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
          <HeroSelectionList
            faction={factionSelection[type]}
            filter={filterValue}
          />
        ) : (
          <>
            <WarriorSelectionList filter={filterValue} />
            <SiegeEquipmentSelectionList filter={filterValue} />
          </>
        )}
      </Stack>
    </div>
  );
}
