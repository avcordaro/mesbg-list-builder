import Button from "react-bootstrap/Button";
import Stack from "react-bootstrap/Stack";
import {
  FaChevronLeft,
  FaChevronRight,
  FaSkullCrossbones,
} from "react-icons/fa";
import { GiCrackedShield } from "react-icons/gi";
import { useStore } from "../../state/store.ts";

export const Casualties = () => {
  const { roster, gameState, updateGameState } = useStore();

  const handleIncrement = () => {
    updateGameState({
      casualties: gameState.casualties + 1,
    });
  };

  const handleDecrement = () => {
    if (gameState.casualties > 0) {
      updateGameState({
        casualties: gameState.casualties - 1,
      });
    }
  };

  return (
    <Stack direction="horizontal" gap={3} className="ms-3">
      <Stack direction="horizontal">
        <h5 className="m-0">Casualties: </h5>
        <Button
          className="ms-2"
          variant="secondary"
          size="sm"
          onClick={handleDecrement}
          disabled={gameState.casualties === 0}
        >
          <FaChevronLeft />
        </Button>
        <h5 className="m-0" style={{ width: "40px", textAlign: "center" }}>
          <b>{gameState.casualties + gameState.heroCasualties}</b>
        </h5>
        <Button
          variant="secondary"
          size="sm"
          onClick={handleIncrement}
          disabled={
            gameState.casualties >=
            roster.num_units - Object.keys(gameState.heroes).length
          }
        >
          <FaChevronRight />
        </Button>
      </Stack>
      {Math.floor(0.5 * roster.num_units) +
        1 -
        (gameState.casualties + gameState.heroCasualties) <=
      0 ? (
        <h5 className="m-0 ms-5 text-danger">
          You are Broken <GiCrackedShield />
        </h5>
      ) : (
        <h5 className="m-0 ms-5">
          Until Broken:{" "}
          <b>
            {Math.max(
              Math.floor(0.5 * roster.num_units) +
                1 -
                (gameState.casualties + gameState.heroCasualties),
              0,
            )}
          </b>
        </h5>
      )}
      {Math.ceil(0.75 * roster.num_units) -
        (gameState.casualties + gameState.heroCasualties) <=
      0 ? (
        <h5 className="m-0 text-danger">
          You are Defeated <FaSkullCrossbones />
        </h5>
      ) : (
        <h5 className="m-0">
          Until Defeated:{" "}
          <b>
            {Math.max(
              Math.ceil(0.75 * roster.num_units) -
                (gameState.casualties + gameState.heroCasualties),
              0,
            )}
          </b>
        </h5>
      )}
    </Stack>
  );
};
