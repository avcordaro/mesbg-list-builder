import { AttachFileOutlined } from "@mui/icons-material";
import {
  Button,
  Checkbox,
  DialogActions,
  DialogContent,
  FormControl,
  FormControlLabel,
  FormHelperText,
  Grid2,
  Input,
  InputLabel,
} from "@mui/material";
import { useTheme } from "@mui/material/styles";
import useMediaQuery from "@mui/material/useMediaQuery";
import { useState } from "react";
import { useExternalStorage } from "../../../hooks/external-storage.ts";
import { useAppState } from "../../../state/app";
import { useRosterBuildingState } from "../../../state/roster-building";
import {
  useCurrentRosterState,
  useSavedRostersState,
} from "../../../state/rosters";

export const ImportRosterModal = () => {
  const { closeModal } = useAppState();
  const { rosters, saveNewRoster, setLastOpenedRoster, deleteRoster } =
    useSavedRostersState();
  const { setActiveRoster, activeRoster } = useCurrentRosterState();

  const theme = useTheme();
  const isTablet = useMediaQuery(theme.breakpoints.down("md"));
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));
  const { importRoster } = useExternalStorage();

  const [name, setName] = useState("");
  const [JSONImport, setJSONImport] = useState("");
  const [importAlert, setImportAlert] = useState(false);
  const [nameError, setNameError] = useState(false);
  const [overwriteRoster, setChecked] = useState(false);

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setChecked(event.target.checked);
    if (event.target.checked) {
      setName("");
    }
  };
  const displayImportAlert = () => {
    setImportAlert(true);
    window.setTimeout(() => setImportAlert(false), 5000);
  };

  const handleImportJSON = (e) => {
    // Attempts to read the input, convert it to JSON, and assigns the JSON dictionary to the roster state variable.
    e.preventDefault();
    try {
      if (!overwriteRoster) {
        const rosterNameValue = name.trim();
        const rosterNameError =
          rosterNameValue.length === 0 || rosters.includes(rosterNameValue);
        setNameError(rosterNameError);
        if (rosterNameError) return;
        saveNewRoster(rosterNameValue);
        setLastOpenedRoster(rosterNameValue);
        setActiveRoster(rosterNameValue);
        useRosterBuildingState.persist.setOptions({
          name: "mlb-builder-" + rosterNameValue.replaceAll(" ", "_"),
        });
      }
      importRoster(JSONImport);
      closeModal();
    } catch {
      displayImportAlert();

      if (!overwriteRoster) {
        useRosterBuildingState.persist.setOptions({
          name: "mlb-builder-" + activeRoster.replaceAll(" ", "_"),
        });
        localStorage.removeItem(
          "mlb-builder-" + name.trim().replaceAll(" ", "_"),
        );
        setActiveRoster(activeRoster);
        deleteRoster(name.trim().replaceAll(" ", "_"));
        setLastOpenedRoster(activeRoster);
      }
    }
  };

  // Handler for file selection
  const handleFileChange = (event) => {
    const file = event.target.files[0]; // Get the selected file

    if (file) {
      // Check if the file is a JSON file
      if (file.type === "application/json") {
        const reader = new FileReader();

        // Handler for when the file is successfully read
        reader.onload = () => {
          try {
            setJSONImport(reader.result as string);
          } catch (error) {
            console.error("Error parsing JSON:", error);
            alert("Invalid JSON file");
          }
        };

        // Read the file as text
        reader.readAsText(file);
      } else {
        alert("Please select a JSON file");
      }
    }

    // Clear the file input value
    event.target.value = "";
  };

  const handleButtonClick = () => {
    document.getElementById("file-input").click();
  };

  return (
    <>
      <DialogContent>
        <Grid2 container columnSpacing={1}>
          <Grid2 size={12}>
            <FormControl
              error={nameError}
              variant="standard"
              fullWidth
              disabled={overwriteRoster}
            >
              <InputLabel htmlFor="component-name-error">
                Roster name
              </InputLabel>
              <Input value={name} onChange={(e) => setName(e.target.value)} />
              <FormHelperText>
                A new roster will be created with this name
              </FormHelperText>
              {nameError && (
                <FormHelperText id="component-error-text">
                  Roster name cannot be empty and must not already exist
                </FormHelperText>
              )}
            </FormControl>
            <FormControlLabel
              control={
                <Checkbox checked={overwriteRoster} onChange={handleChange} />
              }
              label={`Overwrite my current roster (${activeRoster})`}
            />
          </Grid2>
          <Grid2 size={isMobile ? 12 : isTablet ? 7 : 8}>
            <FormControl error={importAlert} variant="standard" fullWidth>
              <InputLabel htmlFor="component-error">
                Your army roster JSON...
              </InputLabel>
              <Input
                value={JSONImport}
                onChange={(e) =>
                  setJSONImport(
                    e.target.value
                      .replace(/^"(.*)"$/, "$1")
                      .replaceAll('""', '"'),
                  )
                }
              />
              {importAlert && (
                <FormHelperText id="component-error-text">
                  JSON string for army list is invalid.
                </FormHelperText>
              )}
            </FormControl>
          </Grid2>
          <Grid2
            size={isMobile ? 12 : isTablet ? 5 : 4}
            sx={{
              mt: 2,
              display: "flex",
              justifyContent: "end",
            }}
          >
            <input
              id="file-input"
              type="file"
              accept=".json"
              style={{ display: "none" }}
              onChange={handleFileChange}
            />
            <Button
              variant="contained"
              onClick={handleButtonClick}
              fullWidth
              startIcon={<AttachFileOutlined />}
            >
              Select a file
            </Button>
          </Grid2>
        </Grid2>
      </DialogContent>
      <DialogActions>
        <Button variant="contained" onClick={handleImportJSON}>
          Import
        </Button>
      </DialogActions>
    </>
  );
};
