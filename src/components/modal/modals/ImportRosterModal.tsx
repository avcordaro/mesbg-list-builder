import { Button, DialogActions, DialogContent, TextField } from "@mui/material";
import Typography from "@mui/material/Typography";
import { useState } from "react";
import { useStore } from "../../../state/store";
import { Roster } from "../../../types/roster.ts";

export const ImportRosterModal = () => {
  const { setRoster, closeModal } = useStore();

  const [JSONImport, setJSONImport] = useState("");
  const [importAlert, setImportAlert] = useState(false);

  const displayImportAlert = () => {
    setImportAlert(true);
    window.setTimeout(() => setImportAlert(false), 5000);
  };

  const hasKeys = (obj: object, keys: string[]): obj is Roster =>
    keys.every((key) => key in obj);

  const tryImportJSON = () => {
    const json = JSON.parse(JSONImport);
    const valid_json = hasKeys(json, [
      "num_units",
      "points",
      "bow_count",
      "warbands",
    ]);

    if (!valid_json) {
      throw new Error("Invalid JSON!");
    }

    setRoster(json);
    setJSONImport("");
  };

  const handleImportJSON = (e) => {
    // Attempts to read the input, convert it to JSON, and assigns the JSON dictionary to the roster state variable.
    e.preventDefault();
    try {
      tryImportJSON();
      closeModal();
    } catch {
      displayImportAlert();
    }
  };

  return (
    <>
      <DialogContent>
        <TextField
          fullWidth
          value={JSONImport}
          onChange={(e) =>
            setJSONImport(
              e.target.value.replace(/^"(.*)"$/, "$1").replaceAll('""', '"'),
            )
          }
          placeholder="Paste your army roster JSON string..."
        />
        {importAlert && (
          <Typography variant="body1" component="strong" color="error">
            JSON string for army list is invalid.
          </Typography>
        )}
      </DialogContent>
      <DialogActions>
        <Button variant="contained" onClick={handleImportJSON}>
          Import
        </Button>
      </DialogActions>
    </>
  );
};
