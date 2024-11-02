import {
  Autocomplete,
  Box,
  Button,
  FormHelperText,
  Grid2,
  TextField,
} from "@mui/material";
import Alert from "@mui/material/Alert";
import { ChangeEvent, forwardRef, useImperativeHandle, useState } from "react";
import { useGameModeState } from "../../../state/gamemode";
import { ArmyPicker } from "./ArmyPicker.tsx";

type Result = "Won" | "Lost" | "Draw";

interface FormValues {
  armies: string;
  alliance: string;
  points: number;
  bows: number;
  startTime: string;
  duration: string;
  opponentArmies: string;
  opponentName: string;
  result: Result;
  victoryPoints: number;
  scenarioPlayed: string | null;
}

const results: Result[] = ["Won", "Lost", "Draw"];

const allianceLevels: string[] = [
  "Pure",
  "Historical",
  "Convenient",
  "Impossible",
  "Legendary Legion",
];

const scenarios = [
  "Scenario 1",
  "Scenario 2",
  "Scenario 3",
  "Scenario 4",
  "Scenario 5",
];

export type GameResultsFormHandlers = {
  saveToState: () => boolean;
};

// eslint-disable-next-line react/display-name
export const GameResultsForm = forwardRef<GameResultsFormHandlers>((_, ref) => {
  const {
    gameState: { started },
    gameMetaData: { factions, points, bows, alliance },
  } = useGameModeState();

  const gameStartTime = new Date(started);
  const gameEndTime = new Date();
  const gameDuration = gameEndTime.getTime() - gameStartTime.getTime();

  const [formValues, setFormValues] = useState<FormValues>({
    armies: factions.join(", "),
    alliance: factions.length === 1 ? "Pure" : alliance,
    points: Math.ceil(points / 50) * 50, // rounds to the nearest full 50.
    bows: bows,
    startTime: gameStartTime.toISOString().slice(0, 10),
    duration: Math.ceil(gameDuration / 60000) + " minutes",
    opponentArmies: "",
    opponentName: "",
    result: null,
    victoryPoints: null,
    scenarioPlayed: null,
  });

  const [missingRequiredFields, setMissingRequiredFields] = useState<string[]>(
    [],
  );

  const handleChangeByEvent = (e: ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormValues({
      ...formValues,
      [name as keyof FormValues]: value,
    });
  };

  const handleChangeField = (name: keyof FormValues, value: unknown) => {
    setFormValues({
      ...formValues,
      [name]: value,
    });
  };

  const saveToState = (): boolean => {
    const missingFields = [];
    if (!formValues.armies) missingFields.push("Armies");
    if (
      formValues.points === null ||
      formValues.points === undefined ||
      formValues.points === 0
    )
      missingFields.push("Points");
    if (formValues.bows === null || formValues.bows === undefined)
      missingFields.push("Bows");
    if (!formValues.alliance) missingFields.push("Alliance level");
    if (!formValues.result) missingFields.push("Match result");
    if (!formValues.victoryPoints) missingFields.push("Victory points");
    setMissingRequiredFields(missingFields);
    if (missingFields.length > 0) {
      return false;
    }

    // TODO: write the match to state.
    console.log(formValues);

    return true;
  };

  useImperativeHandle(ref, () => ({
    saveToState,
  }));

  return (
    <Box sx={{ py: 3 }}>
      {missingRequiredFields.length > 0 && (
        <Alert severity="error" sx={{ mb: 3 }}>
          Please fill in the following required fields:{" "}
          {missingRequiredFields.join(", ").replace(/,([^,]*)$/, " & $1")}
        </Alert>
      )}

      <Grid2 container spacing={2}>
        <Grid2 size={8}>
          <TextField
            fullWidth
            label="Start Time"
            name="startTime"
            type="date"
            slotProps={{ inputLabel: { shrink: true } }}
            value={formValues.startTime}
            onChange={handleChangeByEvent}
          />
        </Grid2>
        <Grid2 size={4}>
          <TextField
            fullWidth
            label="Duration"
            name="duration"
            value={formValues.duration}
            onChange={handleChangeByEvent}
          />
        </Grid2>

        <Grid2 size={8}>
          <ArmyPicker
            label={"Armies"}
            placeholder={"Your armies"}
            onChange={(values) =>
              handleChangeField("armies", values.join(", "))
            }
            defaultSelection={formValues.armies.split(",").map((o) => o.trim())}
          />
        </Grid2>
        <Grid2 size={2}>
          <TextField
            required
            error={missingRequiredFields.includes("Points")}
            fullWidth
            label="Points"
            name="points"
            type="number"
            value={formValues.points}
            onChange={handleChangeByEvent}
          />
        </Grid2>
        <Grid2 size={2}>
          <TextField
            required
            error={missingRequiredFields.includes("Bows")}
            fullWidth
            label="Bows"
            name="bows"
            type="number"
            value={formValues.bows}
            onChange={handleChangeByEvent}
          />
        </Grid2>
        <Grid2 size={12}>
          <Autocomplete
            options={allianceLevels}
            value={formValues.alliance}
            onChange={(_, newValue) => handleChangeField("alliance", newValue)}
            renderInput={(params) => (
              <TextField
                {...params}
                label="Alliance level"
                required
                error={missingRequiredFields.includes("Alliance level")}
              />
            )}
            fullWidth
          />
          <FormHelperText sx={{ px: 1 }}>
            The level of alliance your armies are. Forces consisting of only one
            faction could be considered pure.
          </FormHelperText>
        </Grid2>

        <Grid2 size={5}>
          <TextField
            fullWidth
            label="Opponent Name"
            name="opponentName"
            value={formValues.opponentName}
            onChange={handleChangeByEvent}
            autoFocus
          />
        </Grid2>
        <Grid2 size={7}>
          <ArmyPicker
            label={"Opponent Armies"}
            placeholder={"Your opponents armies"}
            onChange={(values) =>
              handleChangeField("opponentArmies", values.join(", "))
            }
            autoFocus={true}
          />
        </Grid2>

        <Grid2 size={9}>
          <Autocomplete
            options={results}
            value={formValues.result}
            onChange={(_, newValue) => handleChangeField("result", newValue)}
            renderInput={(params) => (
              <TextField
                {...params}
                label="Match results"
                required
                error={missingRequiredFields.includes("Match result")}
              />
            )}
            fullWidth
          />
        </Grid2>
        <Grid2 size={3}>
          <TextField
            required
            error={missingRequiredFields.includes("Victory points")}
            fullWidth
            label="Victory Points"
            name="victoryPoints"
            type="number"
            value={formValues.victoryPoints}
            onChange={handleChangeByEvent}
          />
        </Grid2>
        <Grid2 size={12}>
          <Autocomplete
            options={scenarios}
            value={formValues.scenarioPlayed}
            onChange={(_, newValue) =>
              handleChangeField("scenarioPlayed", newValue)
            }
            renderInput={(params) => (
              <TextField {...params} label="Scenario Played" />
            )}
            fullWidth
          />
        </Grid2>
      </Grid2>

      <Button
        type="submit"
        variant="contained"
        color="primary"
        sx={{ display: "none" }}
      >
        Submit
      </Button>
    </Box>
  );
});
