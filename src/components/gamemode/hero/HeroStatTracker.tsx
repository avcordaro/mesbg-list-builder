import { FunctionComponent } from "react";
import Button from "react-bootstrap/Button";
import Stack from "react-bootstrap/Stack";
import { FaChevronLeft, FaChevronRight } from "react-icons/fa";
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
    <Stack style={{ alignItems: "center" }}>
      <h6>{name}</h6>
      <Stack direction="horizontal" style={{ alignSelf: "center" }}>
        <Button
          variant="secondary"
          size="sm"
          onClick={handleDecrement}
          disabled={currentValue <= 0}
        >
          <FaChevronLeft />
        </Button>
        <b
          className={currentValue === 0 ? "text-danger" : ""}
          style={{ width: "35px", textAlign: "center" }}
        >
          {currentValue}
        </b>
        <Button
          variant="secondary"
          size="sm"
          onClick={handleIncrement}
          disabled={currentValue >= initialValue}
        >
          <FaChevronRight />
        </Button>
      </Stack>
    </Stack>
  );
};
