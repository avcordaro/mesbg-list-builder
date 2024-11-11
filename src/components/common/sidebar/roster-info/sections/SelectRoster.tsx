import { Cancel, SaveAs } from "@mui/icons-material";
import {
  Autocomplete,
  FormControl,
  InputAdornment,
  TextField,
  Tooltip,
} from "@mui/material";
import Divider from "@mui/material/Divider";
import IconButton from "@mui/material/IconButton";
import ListItem from "@mui/material/ListItem";
import ListItemText from "@mui/material/ListItemText";
import { ReactElement } from "react";
import { useAppState } from "../../../../../state/app";
import {
  useCurrentRosterState,
  useSavedRostersState,
} from "../../../../../state/rosters";
import { ModalTypes } from "../../../../modal/modals.tsx";

export const SelectRoster = () => {
  const { activeRoster, setActiveRoster } = useCurrentRosterState();
  const {
    rosters,
    setLastOpenedRoster,
    deleteRoster: deleteRosterFromState,
  } = useSavedRostersState();
  const { setCurrentModal } = useAppState();

  function switchRoster(roster: string | null) {
    if (roster === "create a new roster") {
      setCurrentModal(ModalTypes.CREATE_NEW_ROSTER);
      return;
    }

    if (roster !== null) {
      setActiveRoster(roster);
      setLastOpenedRoster(roster);
    }
  }

  function saveRosterAs() {
    setCurrentModal(ModalTypes.SAVE_AS_NEW_ROSTER);
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
          value={activeRoster}
          onChange={(_, newValue) => {
            switchRoster(newValue);
          }}
          options={[
            ...rosters.sort((a, b) => a.localeCompare(b)),
            "create a new roster",
          ]}
          renderOption={(props, option) => (
            <>
              {option === "create a new roster" && (
                <Divider variant="middle" textAlign="left">
                  or
                </Divider>
              )}
              <ListItem
                {...props}
                key={option}
                secondaryAction={
                  ["default", "create a new roster"].includes(option) ? (
                    <></>
                  ) : (
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
                  )
                }
              >
                <ListItemText
                  primary={option}
                  sx={{ fontStyle: option === activeRoster ? "italic" : "" }}
                />
              </ListItem>
            </>
          )}
          renderInput={(params) => (
            <TextField
              {...params}
              label="Current roster"
              variant="outlined"
              size="small"
              fullWidth
              slotProps={{
                input: {
                  ...params.InputProps,
                  endAdornment: (
                    <InputAdornment
                      {...(params.InputProps.endAdornment as ReactElement)
                        .props}
                      position="end"
                      style={{ position: "absolute" }}
                    >
                      <Tooltip title="Save the current roster with a name">
                        <IconButton onClick={saveRosterAs}>
                          <SaveAs />
                        </IconButton>
                      </Tooltip>
                    </InputAdornment>
                  ),
                },
              }}
            />
          )}
          disableClearable
        />
      </FormControl>
    </>
  );
};
