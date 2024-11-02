import {
  Autocomplete,
  Box,
  FormHelperText,
  Grid2,
  InputAdornment,
  TextField,
} from "@mui/material";
import Alert from "@mui/material/Alert";
import { useTheme } from "@mui/material/styles";
import useMediaQuery from "@mui/material/useMediaQuery";
import { ChangeEvent, forwardRef, useImperativeHandle, useState } from "react";
import { useGameModeState } from "../../../state/gamemode";
import { useRecentGamesState } from "../../../state/recent-games";
import { ArmyPicker } from "./ArmyPicker.tsx";

type Result = "Won" | "Lost" | "Draw";

interface FormValues {
  armies: string;
  alliance: string;
  points: number;
  bows: number;
  gameDate: string;
  duration: number;
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
  "Domination",
  "To the death!",
  "Hold ground",
  "Lords of battle",
  "Reconnoitre",
  "A clash by moonlight",
  "Seize the price",
  "Contest of champions",
  "Capture and control",
  "Heirloom of ages past",
  "Fog of war",
  "Storm the camp",
  "Command the battlefield",
  "Retrieval",
  "Breakthrough",
  "Destroy the supplies",
  "Device & Conquer",
  "Assassination",
  "No escape",
  "Total conquest",
  "Take and hold",
  "Clash of champions",
  "Cornered",
  "Duel of wits",
].map((s) => s.replace(/(^\w)|(\s+\w)/g, (letter) => letter.toUpperCase()));

export type GameResultsFormHandlers = {
  saveToState: () => boolean;
};

// eslint-disable-next-line react/display-name
export const GameResultsForm = forwardRef<GameResultsFormHandlers>((_, ref) => {
  const {
    gameState: { started },
    gameMetaData: { factions, points, bows, alliance },
  } = useGameModeState();
  const { addGame } = useRecentGamesState();

  const theme = useTheme();
  const isSmallDesktop = useMediaQuery(theme.breakpoints.down("lg"));
  const isTablet = useMediaQuery(theme.breakpoints.down("md"));
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));

  const gameStartTime = new Date(started);
  const gameEndTime = new Date();
  const gameDuration = gameEndTime.getTime() - gameStartTime.getTime();

  const [formValues, setFormValues] = useState<FormValues>({
    armies: factions.join(", "),
    alliance: factions.length === 1 ? "Pure" : alliance,
    points: Math.ceil(points / 50) * 50, // rounds to the nearest full 50.
    bows: bows,
    gameDate: gameStartTime.toISOString().slice(0, 10),
    duration: Math.ceil(gameDuration / 60000),
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
    setFormValues((formValues) => ({
      ...formValues,
      [name]: value,
    }));
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

    addGame({ ...formValues });
    setFormValues({
      armies: "",
      alliance: "",
      points: null,
      bows: null,
      gameDate: "",
      duration: null,
      opponentArmies: "",
      opponentName: "",
      result: null,
      victoryPoints: null,
      scenarioPlayed: null,
    });
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
        <Grid2 size={isMobile ? 12 : 8}>
          <TextField
            fullWidth
            label="Date of the game"
            name="gameDate"
            type="date"
            slotProps={{ inputLabel: { shrink: true } }}
            value={formValues.gameDate}
            onChange={handleChangeByEvent}
          />
        </Grid2>
        <Grid2 size={isMobile ? 12 : 4}>
          <TextField
            fullWidth
            label="Duration"
            name="duration"
            value={formValues.duration}
            onChange={handleChangeByEvent}
            slotProps={{
              input: {
                endAdornment: (
                  <InputAdornment position="end">minutes</InputAdornment>
                ),
              },
            }}
          />
        </Grid2>

        <Grid2 size={12}>
          <ArmyPicker
            label="Armies"
            placeholder="Your armies"
            onChange={(values) => {
              handleChangeField(
                "armies",
                values.map((v) => v.title).join(", "),
              );

              if (values.length === 1 && values[0].type.includes("LL"))
                // Single army roster in LL format are always considered a Legendary Legion
                handleChangeField("alliance", "Legendary Legion");
              else if (values.length === 1)
                // Single army roster in outside the LL format are always considered Pure
                handleChangeField("alliance", "Pure");
              else if (
                values.length > 1 &&
                ["Pure", "Legendary Legion"].includes(formValues.alliance)
              )
                // Multi army rosters cannot be considered pure or Legendary Legion, and should be set to something else.
                handleChangeField("alliance", "Historical");
            }}
            defaultSelection={formValues.armies.split(",").map((o) => o.trim())}
          />
        </Grid2>

        <Grid2 size={isSmallDesktop ? 12 : 8}>
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
            getOptionDisabled={(option) =>
              ["Pure", "Legendary Legion"].includes(option)
            }
            disabled={["Pure", "Legendary Legion"].includes(
              formValues.alliance,
            )}
            fullWidth
          />
          <FormHelperText sx={{ px: 1 }}>
            The level of alliance your armies are. Forces consisting of only one
            faction could be considered pure.
          </FormHelperText>
        </Grid2>
        <Grid2 size={isSmallDesktop ? 6 : 2}>
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
        <Grid2 size={isSmallDesktop ? 6 : 2}>
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

        <Grid2 size={isTablet ? 12 : 5}>
          <TextField
            fullWidth
            label="Opponent Name"
            name="opponentName"
            value={formValues.opponentName}
            onChange={handleChangeByEvent}
            autoFocus
          />
        </Grid2>
        <Grid2 size={isTablet ? 12 : 7}>
          <ArmyPicker
            label="Opponent Armies"
            placeholder="Your opponents armies"
            onChange={(values) =>
              handleChangeField(
                "opponentArmies",
                values.map((v) => v.title).join(", "),
              )
            }
            autoFocus={true}
          />
        </Grid2>

        <Grid2 size={isTablet ? 7 : 9}>
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
        <Grid2 size={isTablet ? 5 : 3}>
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
            filterOptions={(options, { inputValue }) => {
              const filtered = options.filter((option) =>
                option.toLowerCase().includes(inputValue.toLowerCase()),
              );

              const isExisting = options.some(
                (option) => inputValue.toLowerCase() === option.toLowerCase(),
              );
              if (inputValue !== "" && !isExisting) {
                filtered.push(`Custom: "${inputValue}"`);
              }

              return filtered;
            }}
            fullWidth
          />
        </Grid2>
      </Grid2>
    </Box>
  );
});
