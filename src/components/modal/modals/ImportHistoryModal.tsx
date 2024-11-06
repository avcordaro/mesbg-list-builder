import { AttachFileOutlined } from "@mui/icons-material";
import {
  Button,
  DialogActions,
  DialogContent,
  FormControl,
  FormControlLabel,
  FormHelperText,
  FormLabel,
  Grid2,
  Input,
  InputLabel,
  Radio,
  RadioGroup,
} from "@mui/material";
import { useTheme } from "@mui/material/styles";
import useMediaQuery from "@mui/material/useMediaQuery";
import { ChangeEvent, useState } from "react";
import { useJsonValidation } from "../../../hooks/json-validation.ts";
import { useAppState } from "../../../state/app";
import { useRecentGamesState } from "../../../state/recent-games";
import { PastGame } from "../../../state/recent-games/history";
import { csvToObject } from "../../../utils/csv.ts";

const requiredKeys = [
  "id",
  "gameDate",
  "duration",
  "points",
  "result",
  "scenarioPlayed",
  "tags",
  "armies",
  "alliance",
  "bows",
  "victoryPoints",
  "opponentArmies",
  "opponentName",
  "opponentVictoryPoints",
];

export const ImportGameHistoryModal = () => {
  const theme = useTheme();
  const isTablet = useMediaQuery(theme.breakpoints.down("xl"));
  const { validateKeys } = useJsonValidation();
  const { importGames } = useRecentGamesState();
  const { closeModal } = useAppState();
  const [importedData, setImportedData] = useState("");
  const [importedDataType, setImportedDataType] = useState("");
  const [importAlert, setImportAlert] = useState(false);
  const [onDuplicate, setOnDuplicate] = useState<
    "overwrite" | "ignore" | "create-new"
  >("create-new");

  const handleChangeOnDuplicate = (event: ChangeEvent<HTMLInputElement>) => {
    setOnDuplicate(
      (event.target as HTMLInputElement).value as
        | "overwrite"
        | "ignore"
        | "create-new",
    );
  };

  const handleChangeOnDataType = (event: ChangeEvent<HTMLInputElement>) => {
    setImportedDataType((event.target as HTMLInputElement).value);
    setImportAlert(false);
  };

  const displayImportAlert = () => {
    setImportAlert(true);
  };

  const handleImport = (e) => {
    e.preventDefault();
    let history: PastGame[] = null;
    if (importedDataType === "application/json") {
      try {
        history = JSON.parse(importedData);
      } catch {
        /* ignored, error handled elsewhere. */
      }
    } else if (importedDataType === "text/csv") {
      history = csvToObject<PastGame>(importedData);
    }

    if (!history || !Array.isArray(history) || history.length === 0) {
      displayImportAlert();
      return;
    }

    for (const game of history) {
      const validGame = validateKeys(game, requiredKeys);
      if (!validGame) {
        displayImportAlert();
        return;
      }
    }

    importGames(
      history.map((game) => ({
        ...game,
        // make sure the tags is an array and not just a string.
        tags: typeof game.tags === "string" ? [game.tags] : game.tags,
      })),
      onDuplicate,
    );
    closeModal();
  };

  // Handler for file selection
  const handleFileChange = (event) => {
    const file = event.target.files[0]; // Get the selected file

    if (file) {
      // Check if the file is a JSON file
      if (file.type === "application/json" || file.type === "text/csv") {
        const reader = new FileReader();
        // Handler for when the file is successfully read
        reader.onload = () => {
          setImportAlert(false);

          try {
            setImportedDataType(file.type);
            setImportedData(reader.result as string);
          } catch (error) {
            console.error("Error parsing JSON:", error);
            alert("Invalid file type. Please use CSV or JSON.");
          }
        };

        // Read the file as text
        reader.readAsText(file);
      } else {
        alert("Please select a JSON or CSV file" + file.type);
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
      <DialogContent sx={{ minWidth: isTablet ? "80vw" : "50vw" }}>
        <Grid2 container columnSpacing={1} rowSpacing={3}>
          <Grid2 size={12}>
            <FormControl error={importAlert} variant="standard" fullWidth>
              <InputLabel htmlFor="component-error">History</InputLabel>
              <Input
                multiline
                maxRows={4}
                value={importedData}
                onChange={(e) =>
                  setImportedData(
                    e.target.value
                      .replace(/^"(.*)"$/, "$1")
                      .replaceAll('""', '"'),
                  )
                }
              />
              {importAlert && (
                <FormHelperText id="component-error-text">
                  {importedDataType.split("/").length > 1 ? (
                    <>
                      Importing the data as {importedDataType.split("/")[1]}{" "}
                      resulted in an error.
                    </>
                  ) : (
                    <>
                      Importing the data resulted in an error. Please check the
                      import and verify a data type has been selected!
                    </>
                  )}
                </FormHelperText>
              )}
            </FormControl>
          </Grid2>
          <Grid2
            size={12}
            sx={{
              display: "flex",
              justifyContent: "end",
            }}
          >
            <input
              id="file-input"
              type="file"
              accept=".json, .csv"
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
          <Grid2 size={12}>
            <FormControl>
              <FormLabel id="demo-controlled-radio-buttons-group">
                What is the format of the data you are importing?
              </FormLabel>
              <RadioGroup
                row
                name="importedDataType"
                value={importedDataType}
                onChange={handleChangeOnDataType}
              >
                <FormControlLabel
                  value="application/json"
                  control={<Radio />}
                  label="JSON"
                />
                <FormControlLabel
                  value="text/csv"
                  control={<Radio />}
                  label="CSV"
                />
              </RadioGroup>
            </FormControl>
            <Grid2 size={12}>
              <FormControl>
                <FormLabel id="demo-controlled-radio-buttons-group">
                  What action should be taken for duplicated games found between
                  current match history and the imported data?
                </FormLabel>
                <RadioGroup
                  row
                  name="filetype"
                  value={onDuplicate}
                  onChange={handleChangeOnDuplicate}
                >
                  <FormControlLabel
                    value="create-new"
                    control={<Radio />}
                    label="Insert duplicated games as new games (risking duplicated data)"
                  />
                  <FormControlLabel
                    value="overwrite"
                    control={<Radio />}
                    label="Overwrite the existing game and keep the data as is in the import"
                  />
                  <FormControlLabel
                    value="ignore"
                    control={<Radio />}
                    label="Keep existing game and ignore the duplicated values in the import"
                  />
                </RadioGroup>
              </FormControl>
            </Grid2>
          </Grid2>
        </Grid2>
      </DialogContent>
      <DialogActions>
        <Button variant="contained" onClick={handleImport}>
          Import
        </Button>
      </DialogActions>
    </>
  );
};
