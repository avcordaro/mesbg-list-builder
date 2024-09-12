import { ChevronLeftOutlined, ChevronRightOutlined } from "@mui/icons-material";
import IconButton from "@mui/material/IconButton";
import Stack from "@mui/material/Stack";
import Typography from "@mui/material/Typography";
import { useTheme } from "@mui/material/styles";
import { FunctionComponent } from "react";
import { useStore } from "../../../state/store.ts";
import { GameModeHero } from "../types.ts";

type TrackedStat = "Might" | "Will" | "Fate" | "Wounds";

const valueIndexMap: Record<TrackedStat, number> = {
  Might: 0,
  Will: 1,
  Fate: 2,
  Wounds: 3,
};

const woundsLeftForModel = ([azog, warg]: GameModeHero[]): number => {
  const azogWounds = Number(azog.xMWFW.split(":")[3]);
  const wargWounds = Number(warg.xMWFW.split(":")[3]);

  return azogWounds + wargWounds;
};

type GameModeMWFCounterProps = {
  name: TrackedStat;
  hero_id: string;
  hero_idx: number;
};

export const HeroStatTracker: FunctionComponent<GameModeMWFCounterProps> = ({
  name,
  hero_id,
  hero_idx,
}) => {
  const { gameState, updateGameState } = useStore();
  const { palette } = useTheme();

  if (!gameState) return <></>; // If we don't have a game state, there is nothing to track.
  const hero = gameState.heroes[hero_id][hero_idx];

  const initialValue = Number(hero.MWFW.split(":")[valueIndexMap[name]]);
  const currentValue = Number(hero.xMWFW.split(":")[valueIndexMap[name]]);

  const handleDeathMechanics = (
    woundsLeft: number,
    direction: -1 | 1,
  ): number => {
    const backAlive = woundsLeft === 1 && direction === 1;
    const justDied = woundsLeft === 0 && direction === -1;

    if (!justDied && !backAlive) {
      // Nothing needs to be adjusted if nobody just died or nobody was revived.
      return 0;
    }

    if (hero.name === "Azog" || hero.name === "The White Warg") {
      const woundsLeftOnModel = woundsLeftForModel(gameState.heroes[hero_id]);
      const notFullyDead = woundsLeftOnModel > 0 && direction === -1;
      const notJustRevived = woundsLeftOnModel !== 1 && direction === 1;
      if (notFullyDead || notJustRevived) {
        return 0;
      }
    }

    return -direction;
  };

  const updateStat = (direction: -1 | 1) => {
    const newValue = currentValue + direction;
    const currentValues = hero.xMWFW.split(":");
    currentValues[valueIndexMap[name]] = String(newValue);
    hero.xMWFW = currentValues.join(":");
    gameState.heroes[hero_id][hero_idx] = hero;
    if (name === "Wounds") {
      gameState.heroCasualties += handleDeathMechanics(newValue, direction);
    }
    updateGameState(gameState);
  };

  const handleIncrement = () => {
    if (currentValue >= initialValue) {
      // cannot increment over the initial value
      return;
    }

    updateStat(+1);
  };

  const handleDecrement = () => {
    if (currentValue <= 0) {
      // cannot decrement below value of 0
      return;
    }

    updateStat(-1);
  };

  return (
    <Stack alignItems="center">
      <Typography variant="h6">{name}</Typography>
      <Stack
        direction="row"
        alignItems="center"
        justifyContent="center"
        alignContent="center"
        alignSelf="center"
      >
        <IconButton
          onClick={handleDecrement}
          disabled={currentValue <= 0}
          size="small"
          sx={{
            borderRadius: 2,
            color: "white",
            backgroundColor: palette.grey.A400,
            "&:hover": {
              backgroundColor: palette.grey["600"],
            },
          }}
        >
          <ChevronLeftOutlined />
        </IconButton>
        <Typography
          textAlign="center"
          color={currentValue === 0 ? "error" : "textPrimary"}
          sx={{
            width: "4rem",
          }}
        >
          <b>{currentValue}</b>
        </Typography>
        <IconButton
          onClick={handleIncrement}
          disabled={currentValue >= initialValue}
          size="small"
          sx={{
            borderRadius: 2,
            color: "white",
            backgroundColor: palette.grey.A400,
            "&:hover": {
              backgroundColor: palette.grey["600"],
            },
          }}
        >
          <ChevronRightOutlined />
        </IconButton>
      </Stack>
    </Stack>
  );
};
