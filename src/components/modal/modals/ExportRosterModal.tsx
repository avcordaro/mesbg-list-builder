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
import { useExternalStorage } from "../../../hooks/external-storage.ts";
import { useAppState } from "../../../state/app";
import { useCurrentRosterState } from "../../../state/rosters";

export const ExportRosterModal = () => {
  const { closeModal } = useAppState();
  const { activeRoster } = useCurrentRosterState();
  const { exportRoster, copyToClipboard } = useExternalStorage();

  const [filename, setFilename] = useState(
    activeRoster !== "default" ? activeRoster : "",
  );
  const [filenameValid, setFilenameValid] = useState(true);

  const handleExport = (e) => {
    e.preventDefault();
    const validFilename = filename.trim().length > 0;
    setFilenameValid(validFilename);
    if (validFilename) {
      exportRoster(filename + ".json");
      closeModal();
    }
  };

  const handleCopy = (e) => {
    e.preventDefault();
    copyToClipboard();
    closeModal();
  };

  return (
    <>
      <DialogContent>
        <FormControl error={!filenameValid} variant="standard" fullWidth>
          <InputLabel htmlFor="component-error">Roster filename</InputLabel>
          <Input
            value={filename}
            onChange={(e) => {
              const filename = e.target.value.trim();
              setFilename(filename);
              const validFilename = filename.length > 0;
              setFilenameValid(validFilename);
            }}
            endAdornment=".json"
          />
          {!filenameValid && (
            <FormHelperText id="component-error-text">
              Filename cannot be empty
            </FormHelperText>
          )}
        </FormControl>
      </DialogContent>
      <DialogActions sx={{ display: "flex", gap: 2 }}>
        <Button onClick={handleCopy}>copy to clipboard</Button>
        <Button
          variant="contained"
          onClick={handleExport}
          disabled={!filenameValid}
        >
          Save file
        </Button>
      </DialogActions>
    </>
  );
};
