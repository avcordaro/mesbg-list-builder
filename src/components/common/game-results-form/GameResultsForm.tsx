import {
  Autocomplete,
  Box,
  Button,
  FormHelperText,
  Grid2,
  TextField,
} from "@mui/material";
import Alert from "@mui/material/Alert";
import {
  ChangeEvent,
  forwardRef,
  SyntheticEvent,
  useImperativeHandle,
  useState,
} from "react";
import { useGameModeState } from "../../../state/gamemode";

type Result = "Won" | "Lost" | "Draw";

interface FormValues {
  armies: string;
  alliance: string;
  points: number;
  bows: number;
  heroes: string;
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
    gameMetaData: { factions, points, bows, heroes, alliance },
  } = useGameModeState();

  const gameStartTime = new Date(started);
  const gameEndTime = new Date();
  const gameDuration = gameEndTime.getTime() - gameStartTime.getTime();

  const [formValues, setFormValues] = useState<FormValues>({
    armies: factions.join(", "),
    alliance: factions.length === 1 ? "Pure" : alliance,
    points: Math.ceil(points / 50) * 50, // rounds to the nearest full 50.
    bows: bows,
    heroes: heroes
      .map((h) => (h.quantity > 1 ? `${h.quantity}x ${h.name}` : h.name))
      .join(", "),
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

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormValues({
      ...formValues,
      [name as keyof FormValues]: value,
    });
  };

  const handleAllianceChange = (_: SyntheticEvent, newValue: string | null) => {
    setFormValues((prevValues) => ({
      ...prevValues,
      alliance: newValue,
    }));
  };

  const handleResultChange = (_: SyntheticEvent, newValue: Result | null) => {
    setFormValues((prevValues) => ({
      ...prevValues,
      result: newValue,
    }));
  };

  const handleScenarioChange = (_: SyntheticEvent, newValue: string | null) => {
    setFormValues((prevValues) => ({
      ...prevValues,
      scenarioPlayed: newValue,
    }));
  };

  const saveToState = (): boolean => {
    const missingFields = [];
    if (!formValues.armies) missingFields.push("Armies");
    if (!formValues.points) missingFields.push("Points");
    if (!formValues.bows) missingFields.push("Bows");
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
            onChange={handleChange}
          />
        </Grid2>
        <Grid2 size={4}>
          <TextField
            fullWidth
            label="Duration"
            name="duration"
            value={formValues.duration}
            onChange={handleChange}
          />
        </Grid2>

        <Grid2 size={8}>
          <TextField
            required
            error={missingRequiredFields.includes("Armies")}
            fullWidth
            label="Armies"
            name="armies"
            value={formValues.armies}
            onChange={handleChange}
          />
          <FormHelperText sx={{ px: 1 }}>
            A comma separated list of the armies you played.
          </FormHelperText>
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
            onChange={handleChange}
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
            onChange={handleChange}
          />
        </Grid2>
        <Grid2 size={12}>
          <Autocomplete
            options={allianceLevels}
            value={formValues.alliance}
            onChange={handleAllianceChange}
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
        <Grid2 size={12}>
          <TextField
            fullWidth
            label="Heroes"
            name="heroes"
            value={formValues.heroes}
            onChange={handleChange}
          />
          <FormHelperText sx={{ px: 1 }}>
            A comma separated list of the heroes you used.
          </FormHelperText>
        </Grid2>

        <Grid2 size={7}>
          <TextField
            fullWidth
            label="Opponent Armies"
            name="opponentArmies"
            value={formValues.opponentArmies}
            onChange={handleChange}
            autoFocus
          />
          <FormHelperText sx={{ px: 1 }}>
            A comma separated list of the armies your opponent played.
          </FormHelperText>
        </Grid2>
        <Grid2 size={5}>
          <TextField
            fullWidth
            label="Opponent Name"
            name="opponentName"
            value={formValues.opponentName}
            onChange={handleChange}
          />
        </Grid2>
        <Grid2 size={9}>
          <Autocomplete
            options={results}
            value={formValues.result}
            onChange={handleResultChange}
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
            onChange={handleChange}
          />
        </Grid2>
        <Grid2 size={12}>
          <Autocomplete
            options={scenarios}
            value={formValues.scenarioPlayed}
            onChange={handleScenarioChange}
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
