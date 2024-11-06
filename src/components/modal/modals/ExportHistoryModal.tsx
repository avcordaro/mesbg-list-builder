import {
  Button,
  DialogActions,
  DialogContent,
  FormControl,
  FormControlLabel,
  FormHelperText,
  FormLabel,
  Input,
  InputLabel,
  Radio,
  RadioGroup,
} from "@mui/material";
import Stack from "@mui/material/Stack";
import { useState, ChangeEvent } from "react";
import { download } from "../../../hooks/external-storage.ts";
import { useAppState } from "../../../state/app";
import { useRecentGamesState } from "../../../state/recent-games";
import { objectToCSV } from "../../../utils/csv.ts";
import { AlertTypes } from "../../alerts/alert-types.tsx";

export const ExportHistoryModal = () => {
  const { closeModal, triggerAlert } = useAppState();
  const { recentGames } = useRecentGamesState();

  const [filename, setFilename] = useState("mesbg-game-history");
  const [filenameValid, setFilenameValid] = useState(true);
  const [fileType, setFileType] = useState("json");

  const handleChange = (event: ChangeEvent<HTMLInputElement>) => {
    setFileType((event.target as HTMLInputElement).value);
  };

  const handleExport = (e) => {
    e.preventDefault();
    const validFilename = filename.trim().length > 0;
    setFilenameValid(validFilename);
    if (validFilename) {
      download(
        fileType === "json"
          ? JSON.stringify(recentGames)
          : objectToCSV(recentGames),
        fileType === "json" ? filename + ".json" : filename + ".csv",
        fileType === "json" ? "application/json" : "text/csv",
      );
      closeModal();
    }
  };

  const handleCopy = (e) => {
    e.preventDefault();
    const content =
      fileType === "json"
        ? JSON.stringify(recentGames)
        : objectToCSV(recentGames);
    window.navigator.clipboard.writeText(content);
    triggerAlert(AlertTypes.EXPORT_HISTORY_ALERT);
    closeModal();
  };

  return (
    <>
      <DialogContent>
        <Stack gap={2}>
          <FormControl error={!filenameValid} variant="standard" fullWidth>
            <InputLabel htmlFor="component-error">Filename</InputLabel>
            <Input
              value={filename}
              onChange={(e) => {
                const filename = e.target.value.trim();
                setFilename(filename);
                const validFilename = filename.length > 0;
                setFilenameValid(validFilename);
              }}
              endAdornment={"." + fileType}
            />
            {!filenameValid && (
              <FormHelperText id="component-error-text">
                Filename cannot be empty
              </FormHelperText>
            )}
          </FormControl>
          <FormControl>
            <FormLabel id="demo-controlled-radio-buttons-group">
              Export to
            </FormLabel>
            <RadioGroup
              row
              name="filetype"
              value={fileType}
              onChange={handleChange}
            >
              <FormControlLabel value="json" control={<Radio />} label="JSON" />
              <FormControlLabel
                value="csv"
                control={<Radio />}
                label="CSV (importable in Excel)"
              />
            </RadioGroup>
          </FormControl>
        </Stack>
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
