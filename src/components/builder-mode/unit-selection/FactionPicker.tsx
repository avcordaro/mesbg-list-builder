import { Autocomplete, ListItemIcon, TextField, Tooltip } from "@mui/material";
import ListItem from "@mui/material/ListItem";
import ListItemText from "@mui/material/ListItemText";
import Typography from "@mui/material/Typography";
import { useTheme } from "@mui/material/styles";
import { FunctionComponent, useEffect, useState } from "react";
import { AllianceLevel } from "../../../constants/alliances.ts";
import { useMesbgData } from "../../../hooks/mesbg-data.ts";
import { useRosterBuildingState } from "../../../state/roster-building";
import { getAllianceLevel } from "../../../state/roster-building/roster/calculations";
import { Faction, FactionType } from "../../../types/factions.ts";
import { FactionLogo } from "../../common/images/FactionLogo.tsx";

type Option = {
  title: Faction;
  type: FactionType;
};

export type FactionPickerProps = {
  onChange: (values: Option) => void;
};

export const FactionPicker: FunctionComponent<FactionPickerProps> = (props) => {
  const theme = useTheme();
  const { factionsGroupedByType } = useMesbgData();
  const { factions, factionType, selectedFaction, heroSelection } =
    useRosterBuildingState();

  const getInitialOption = (): Option => {
    const fallbackOption = allOptions[0];
    if (selectedFaction) {
      return (
        allOptions.find((option) => option.title === selectedFaction) ||
        fallbackOption
      );
    }

    if (factions[0]) {
      return (
        allOptions.find((option) => option.title === factions[0]) ||
        fallbackOption
      );
    }

    return fallbackOption;
  };

  const makeOptions = (type: FactionType): Option[] =>
    [...factionsGroupedByType[type]].map((f) => ({
      title: f,
      type,
    }));

  const allOptions = [
    ...makeOptions("Good Army"),
    ...makeOptions("Evil Army"),
    ...makeOptions("Good LL"),
    ...makeOptions("Evil LL"),
  ];

  const [value, setValue] = useState<Option>(null);

  const onOptionSelectionChanged = (newSelection: Option) => {
    if (!newSelection) {
      return;
    }
    setValue(newSelection);
    props.onChange(newSelection);
  };

  const getFactionColor = (faction: Faction) => {
    if (factions.length === 0) return "black";

    const selectionIncludingFaction = [...new Set([...factions, faction])];
    const allianceLevel: AllianceLevel = getAllianceLevel(
      selectionIncludingFaction,
    );
    switch (allianceLevel) {
      case "Historical":
        return theme.palette.success.main;
      case "Convenient":
        return theme.palette.warning.light;
      case "Impossible":
        return theme.palette.error.main;
      default:
        return "black";
    }
  };

  useEffect(() => {
    const initialOption = getInitialOption();
    onOptionSelectionChanged(initialOption);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <Tooltip
      title={
        !heroSelection
          ? "You can only select an army when selecting an hero"
          : factionType.includes("LL")
            ? "Legendary legions cannot ally therefore you cannot select a second army."
            : ""
      }
    >
      <Autocomplete
        disableClearable
        options={allOptions.filter(
          (option) => !factionType || option.type === factionType,
        )}
        getOptionLabel={(option) => option.title}
        renderOption={(props, option) => {
          return (
            <ListItem {...props} key={option.title}>
              <ListItemIcon>
                <FactionLogo faction={option.title} />
              </ListItemIcon>
              <ListItemText>
                <Typography color={getFactionColor(option.title)}>
                  {option.title}
                </Typography>
              </ListItemText>
            </ListItem>
          );
        }}
        groupBy={(option) => option.type}
        disabled={factionType.includes("LL") || !heroSelection}
        value={value}
        onChange={(_, newValue) => {
          onOptionSelectionChanged(newValue);
        }}
        filterSelectedOptions
        blurOnSelect={true}
        renderInput={(params) => (
          <TextField {...params} placeholder="Army" size="small" />
        )}
      />
    </Tooltip>
  );
};
