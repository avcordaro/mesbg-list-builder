import {
  Button,
  DialogActions,
  DialogContent,
  FormControl,
  FormHelperText,
  Input,
  InputLabel,
} from "@mui/material";
import { useState } from "react";
import { useAppState } from "../../../state/app";
import { useRosterBuildingState } from "../../../state/roster-building";
import {
  useCurrentRosterState,
  useSavedRostersState,
} from "../../../state/rosters";

export const SaveRosterAsModal = () => {
  const { closeModal } = useAppState();
  const { rosters, saveNewRoster, setLastOpenedRoster } =
    useSavedRostersState();
  const { setActiveRoster } = useCurrentRosterState();
  const { setRoster, roster } = useRosterBuildingState();

  const [rosterName, setRosterName] = useState("");
  const [rosterNameValid, setRosterNameValid] = useState(true);

  const handleSaveAs = (e) => {
    e.preventDefault();
    const rosterNameValue = rosterName.trim();
    const validRosterName =
      rosterNameValue.length > 0 && !rosters.includes(rosterNameValue);
    setRosterNameValid(validRosterName);
    if (validRosterName) {
      saveNewRoster(rosterNameValue);
      setLastOpenedRoster(rosterNameValue);
      setActiveRoster(rosterNameValue);
      useRosterBuildingState.persist.setOptions({
        name: "mlb-builder-" + rosterNameValue.replaceAll(" ", "_"),
      });
      setRoster(roster);
      closeModal();
    }
  };

  return (
    <>
      <DialogContent>
        <FormControl error={!rosterNameValid} variant="standard" fullWidth>
          <InputLabel htmlFor="component-error">Roster name</InputLabel>
          <Input
            value={rosterName}
            onChange={(e) => {
              const filename = e.target.value;
              setRosterName(filename);
              const validFilename = filename.length > 0;
              setRosterNameValid(validFilename);
            }}
          />
          {!rosterNameValid && (
            <FormHelperText id="component-error-text">
              Roster name cannot be empty and must not already exist
            </FormHelperText>
          )}
        </FormControl>
      </DialogContent>
      <DialogActions sx={{ display: "flex", gap: 2 }}>
        <Button
          variant="contained"
          onClick={handleSaveAs}
          disabled={!rosterNameValid}
        >
          Save roster as...
        </Button>
      </DialogActions>
    </>
  );
};
