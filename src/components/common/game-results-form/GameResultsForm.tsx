import {
  Autocomplete,
  Box,
  FormHelperText,
  Grid2,
  InputAdornment,
  TextField,
  Tooltip,
} from "@mui/material";
import Alert from "@mui/material/Alert";
import Typography from "@mui/material/Typography";
import { useTheme } from "@mui/material/styles";
import useMediaQuery from "@mui/material/useMediaQuery";
import { ChangeEvent, forwardRef, useImperativeHandle, useState } from "react";
import { useGameModeState } from "../../../state/gamemode";
import { useRecentGamesState } from "../../../state/recent-games";
import { PastGame } from "../../../state/recent-games/history";
import { ArmyPicker } from "./ArmyPicker.tsx";
import { AdditionalTagsInput } from "./TagsInput.tsx";

type Result = "Won" | "Lost" | "Draw";

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

  const [formValues, setFormValues] = useState<PastGame>({
    gameDate: gameStartTime.toISOString().slice(0, 10),
    duration: Math.ceil(gameDuration / 60000),
    points: Math.ceil(points / 50) * 50, // rounds to the nearest full 50.
    result: "Won",
    scenarioPlayed: null,
    tags: [],
    armies: factions.join(", "),
    alliance: factions.length === 1 ? "Pure" : alliance,
    bows: bows,
    victoryPoints: "" as unknown as number,
    opponentArmies: "",
    opponentName: "",
    opponentVictoryPoints: "" as unknown as number,
  });

  const [missingRequiredFields, setMissingRequiredFields] = useState<string[]>(
    [],
  );

  const handleChangeByEvent = (e: ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormValues({
      ...formValues,
      [name as keyof PastGame]: value,
    });
  };

  const calculateResult = (
    vp: string | number,
    ovp: string | number,
    originalResult: Result,
  ): Result => {
    if (!hasValue(vp) || !hasValue(ovp)) {
      return originalResult;
    }

    console.log({ vp, ovp, originalResult });
    const resultList: Record<Result, boolean> = {
      Won: vp > ovp,
      Draw: vp === ovp,
      Lost: vp < ovp,
    };
    return Object.entries(resultList).find(([, value]) => value)[0] as Result;
  };

  const handleChangeVictoryPoints = (e: ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormValues((formValues) => ({
      ...formValues,
      result: calculateResult(
        name === "victoryPoints" ? value : formValues.victoryPoints,
        name === "opponentVictoryPoints"
          ? value
          : formValues.opponentVictoryPoints,
        formValues.result,
      ),
      [name as keyof PastGame]: value,
    }));
  };

  const handleChangeField = (name: keyof PastGame, value: unknown) => {
    setFormValues((formValues) => ({
      ...formValues,
      [name]: value,
    }));
  };

  function hasValue(value: string | number | unknown) {
    return (
      (typeof value === "string" && value.trim() !== "") ||
      typeof value === "number"
    );
  }

  function isAboveZero(value: number) {
    return hasValue(value) && value > 0;
  }

  const saveToState = (): boolean => {
    const missingFields = [];

    if (!hasValue(formValues.gameDate)) missingFields.push("Date of the game");
    if (!isAboveZero(formValues.points)) missingFields.push("Points");
    if (!hasValue(formValues.result)) missingFields.push("Match result");
    if (!hasValue(formValues.armies)) missingFields.push("Armies");
    if (!hasValue(formValues.alliance)) missingFields.push("Alliance level");
    if (!hasValue(formValues.victoryPoints))
      missingFields.push("Victory points");
    if (!hasValue(formValues.bows)) missingFields.push("Bows");
    if (
      hasValue(formValues.opponentName) ||
      hasValue(formValues.opponentVictoryPoints)
    ) {
      if (!hasValue(formValues.opponentName))
        missingFields.push("Opponent's Victory points");
      if (!hasValue(formValues.opponentVictoryPoints)) {
        missingFields.push("Opponent name");
      }
    }

    setMissingRequiredFields(missingFields);
    if (missingFields.length > 0) {
      return false;
    }

    addGame({ ...formValues });
    setFormValues({
      gameDate: "",
      duration: 0,
      tags: [],
      result: "Won",
      scenarioPlayed: null,
      armies: "",
      alliance: "",
      points: 0,
      bows: 0,
      victoryPoints: 0,
      opponentArmies: "",
      opponentName: "",
      opponentVictoryPoints: 0,
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
        <Grid2 container component="fieldset">
          <Typography component="legend" sx={{ mb: 1 }}>
            General game information
          </Typography>
          <Grid2 size={isTablet ? 12 : 7}>
            <TextField
              fullWidth
              label="Date of the game"
              name="gameDate"
              type="date"
              slotProps={{ inputLabel: { shrink: true } }}
              value={formValues.gameDate}
              onChange={handleChangeByEvent}
              required
              size="small"
            />
          </Grid2>
          <Grid2 size={isTablet ? (isMobile ? 12 : 6) : 3}>
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
              size="small"
            />
          </Grid2>
          <Grid2 size={isTablet ? (isMobile ? 12 : 6) : 2}>
            <TextField
              required
              error={missingRequiredFields.includes("Points")}
              fullWidth
              label="Points"
              name="points"
              type="number"
              slotProps={{ htmlInput: { min: 0 } }}
              value={formValues.points}
              onChange={handleChangeByEvent}
              size="small"
            />
          </Grid2>
          <Grid2 size={isMobile ? 12 : 9}>
            <Autocomplete
              options={scenarios}
              value={formValues.scenarioPlayed}
              onChange={(_, newValue) =>
                handleChangeField("scenarioPlayed", newValue)
              }
              renderInput={(params) => (
                <TextField {...params} label="Scenario Played" autoFocus />
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
              size="small"
            />
          </Grid2>
          <Grid2 size={isMobile ? 12 : 3}>
            <Tooltip
              title={
                hasValue(formValues.victoryPoints) &&
                hasValue(formValues.opponentVictoryPoints)
                  ? "The state of this field is managed by the VP's"
                  : ""
              }
            >
              <Autocomplete
                options={results}
                value={formValues.result}
                onChange={(_, newValue) =>
                  handleChangeField("result", newValue)
                }
                renderInput={(params) => (
                  <TextField
                    {...params}
                    label="Match results"
                    required
                    error={missingRequiredFields.includes("Match result")}
                  />
                )}
                fullWidth
                disableClearable
                disabled={
                  hasValue(formValues.victoryPoints) &&
                  hasValue(formValues.opponentVictoryPoints)
                }
                size="small"
              />
            </Tooltip>
          </Grid2>
          <Grid2 size={12}>
            <AdditionalTagsInput
              values={formValues.tags}
              onChange={(values) => handleChangeField("tags", values)}
            />
          </Grid2>
        </Grid2>
        <Grid2 container component="fieldset">
          <Typography component="legend" sx={{ mb: 1 }}>
            Your army information
          </Typography>
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
              defaultSelection={formValues.armies
                .split(",")
                .map((o) => o.trim())}
            />
          </Grid2>
          <Grid2 size={isSmallDesktop ? 12 : 8}>
            <Tooltip
              title={
                {
                  Pure: "Your alliance is fixed on Pure as you have only 1 army selected.",
                  "Legendary Legion":
                    "Your alliance is fixed on Legendary Legion as you have selected an LL.",
                }[formValues.alliance]
              }
            >
              <Autocomplete
                options={allianceLevels}
                value={formValues.alliance}
                onChange={(_, newValue) =>
                  handleChangeField("alliance", newValue)
                }
                renderInput={(params) => (
                  <TextField
                    {...params}
                    label="Alliance level"
                    required
                    error={missingRequiredFields.includes("Alliance level")}
                    size="small"
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
            </Tooltip>
            <FormHelperText sx={{ px: 1 }}>
              The level of alliance your armies are. Forces consisting of only
              one faction could be considered pure.
            </FormHelperText>
          </Grid2>
          <Grid2 size={isSmallDesktop ? (isTablet ? 12 : 6) : 2}>
            <TextField
              required
              error={missingRequiredFields.includes("Bows")}
              fullWidth
              label="Bows"
              name="bows"
              type="number"
              slotProps={{ htmlInput: { min: 0 } }}
              value={formValues.bows}
              onChange={handleChangeByEvent}
              size="small"
            />
          </Grid2>
          <Grid2 size={isSmallDesktop ? (isTablet ? 12 : 6) : 2}>
            <TextField
              required
              error={missingRequiredFields.includes("Victory points")}
              fullWidth
              label="Victory Points"
              name="victoryPoints"
              type="number"
              slotProps={{ htmlInput: { min: 0 } }}
              value={formValues.victoryPoints}
              onChange={handleChangeVictoryPoints}
              size="small"
            />
          </Grid2>
        </Grid2>
        <Grid2 container component="fieldset" size={12}>
          <Typography component="legend" sx={{ mb: 1 }}>
            Your opponents information
          </Typography>
          <Grid2 size={isTablet ? 12 : 8}>
            <TextField
              fullWidth
              label="Opponent Name"
              name="opponentName"
              value={formValues.opponentName}
              onChange={handleChangeByEvent}
              required={
                !!formValues.opponentName || !!formValues.opponentVictoryPoints
              }
              size="small"
            />
          </Grid2>
          <Grid2 size={isTablet ? 12 : 4}>
            <TextField
              fullWidth
              label="Opponent's Victory Points"
              name="opponentVictoryPoints"
              value={formValues.opponentVictoryPoints}
              type="number"
              slotProps={{ htmlInput: { min: 0 } }}
              onChange={handleChangeVictoryPoints}
              size="small"
              required={
                !!formValues.opponentName || !!formValues.opponentVictoryPoints
              }
            />
          </Grid2>
          <Grid2 size={12}>
            <ArmyPicker
              label="Opponent Armies"
              placeholder="Your opponents armies"
              onChange={(values) =>
                handleChangeField(
                  "opponentArmies",
                  values.map((v) => v.title).join(", "),
                )
              }
            />
          </Grid2>
        </Grid2>
      </Grid2>
    </Box>
  );
});
