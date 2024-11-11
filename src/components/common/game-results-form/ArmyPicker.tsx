import { Autocomplete, ListItemIcon, TextField } from "@mui/material";
import ListItem from "@mui/material/ListItem";
import ListItemText from "@mui/material/ListItemText";
import Typography from "@mui/material/Typography";
import { FunctionComponent, useEffect, useState } from "react";
import { useMesbgData } from "../../../hooks/mesbg-data.ts";
import { Faction, FactionType } from "../../../types/factions.ts";
import { FactionLogo } from "../images/FactionLogo.tsx";

type Option = {
  title: Faction;
  type: FactionType;
};

export type ArmyPickerProps = {
  label: string;
  placeholder?: string;
  defaultSelection?: string[];
  onChange: (values: Option[]) => void;
  autoFocus?: boolean;
  required?: boolean;
  error?: boolean;
};

export const ArmyPicker: FunctionComponent<ArmyPickerProps> = (props) => {
  const { factionsGroupedByType } = useMesbgData();

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

  const [value, setValue] = useState<Option[]>([]);
  const [options, setOptions] = useState<Option[]>(allOptions);

  const onOptionSelectionChanged = (newSelection: Option[]) => {
    setValue(newSelection); // update the selection in state
    if (newSelection.length > 0) {
      const armyType = newSelection[0].type;
      if (armyType.includes("LL")) {
        // If an LL is selected, it will be the only available option, nothing can be added.
        setOptions(newSelection);
      } else {
        // Else (so Good/Evil Army), only armies of that same type can be selected.
        setOptions(makeOptions(armyType));
      }
    } else {
      // If the input was cleared, all options become available.
      setOptions(allOptions);
    }

    // Forward the change to the parent component.
    props.onChange(newSelection);
  };

  useEffect(() => {
    if (props.defaultSelection) {
      const defaultSelection = allOptions.filter((option) =>
        props.defaultSelection.includes(option.title),
      );
      onOptionSelectionChanged(defaultSelection);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <Autocomplete
      multiple
      options={options}
      getOptionLabel={(option) => option.title}
      renderOption={(props, option) => {
        return (
          <ListItem {...props}>
            <ListItemIcon>
              <FactionLogo faction={option.title} />
            </ListItemIcon>
            <ListItemText>
              <Typography>{option.title}</Typography>
            </ListItemText>
          </ListItem>
        );
      }}
      groupBy={(option) => option.type}
      value={value}
      onChange={(_, newValue) => {
        onOptionSelectionChanged(newValue);
      }}
      filterSelectedOptions
      renderInput={(params) => (
        <TextField
          {...params}
          label={props.label}
          placeholder={props.placeholder}
          size="small"
          required={props.required}
          error={props.error}
        />
      )}
      autoFocus={props.autoFocus}
    />
  );
};
