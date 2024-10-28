import { Cancel } from "@mui/icons-material";
import { Autocomplete, FormControl, TextField } from "@mui/material";
import IconButton from "@mui/material/IconButton";
import ListItem from "@mui/material/ListItem";
import ListItemText from "@mui/material/ListItemText";
import {
  useCurrentRosterState,
  useSavedRostersState,
} from "../../../../../state/rosters";

export const SelectRoster = () => {
  const { activeRoster, setActiveRoster } = useCurrentRosterState();
  const {
    rosters,
    setLastOpenedRoster,
    deleteRoster: deleteRosterFromState,
  } = useSavedRostersState();

  function switchRoster(roster: string | null) {
    if (roster !== null) {
      setActiveRoster(roster);
      setLastOpenedRoster(roster);
    }
  }

  function deleteRoster(roster: string) {
    if (activeRoster === roster) {
      switchRoster("default");
    }
    localStorage.removeItem("mlb-builder-" + roster.replaceAll(" ", "_"));
    deleteRosterFromState(roster);
  }

  return (
    <>
      <FormControl size="small" fullWidth>
        <Autocomplete
          freeSolo
          value={activeRoster}
          onChange={(_, newValue) => {
            switchRoster(newValue);
          }}
          options={rosters.sort((a, b) => a.localeCompare(b))}
          renderOption={(props, option) => (
            <ListItem
              {...props}
              key={option}
              secondaryAction={
                option !== "default" && option !== activeRoster ? (
                  <IconButton
                    edge="end"
                    aria-label="delete"
                    color="error"
                    onClick={(e) => {
                      e.stopPropagation();
                      deleteRoster(option);
                    }}
                  >
                    <Cancel />
                  </IconButton>
                ) : (
                  <></>
                )
              }
            >
              <ListItemText
                primary={option}
                sx={{ fontStyle: option === activeRoster ? "italic" : "" }}
              />
            </ListItem>
          )}
          renderInput={(params) => (
            <TextField
              {...params}
              label="Editing Roster:"
              variant="outlined"
              size="small"
              fullWidth
            />
          )}
        />
      </FormControl>
    </>
  );
};
