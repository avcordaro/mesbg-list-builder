import { ChevronLeftOutlined, ChevronRightOutlined } from "@mui/icons-material";
import IconButton from "@mui/material/IconButton";
import Stack from "@mui/material/Stack";
import Typography from "@mui/material/Typography";
import { useTheme } from "@mui/material/styles";
import useMediaQuery from "@mui/material/useMediaQuery";
import { FaSkullCrossbones } from "react-icons/fa";
import { GiCrackedShield } from "react-icons/gi";
import { useStore } from "../../state/store.ts";

const Counter = () => {
  const { roster, gameState, updateGameState } = useStore();
  const { palette } = useTheme();

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
    <Stack
      direction="row"
      justifyContent="center"
      alignItems="center"
      flexGrow={1}
      spacing={1}
    >
      <Typography variant="h6" component="span">
        Casualties:
      </Typography>
      <IconButton
        onClick={handleDecrement}
        disabled={gameState.casualties === 0}
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
      <Typography sx={{ minWidth: "2rem", textAlign: "center" }}>
        <b>{gameState.casualties + gameState.heroCasualties}</b>
      </Typography>
      <IconButton
        onClick={handleIncrement}
        disabled={
          gameState.casualties >=
          roster.num_units - Object.values(gameState.heroes).flat().length
        }
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
  );
};

export const Casualties = () => {
  const { roster, gameState } = useStore();
  const { breakpoints } = useTheme();
  const isMobile = useMediaQuery(breakpoints.down("md"));

  const tillBroken = Math.max(
    Math.floor(0.5 * roster.num_units) +
      1 -
      (gameState.casualties + gameState.heroCasualties),
    0,
  );
  const tillDefeat = Math.max(
    Math.ceil(0.75 * roster.num_units) -
      (gameState.casualties + gameState.heroCasualties),
    0,
  );
  return (
    <Stack
      direction={isMobile ? "column" : "row"}
      spacing={1}
      justifyContent="center"
      alignItems="center"
      sx={{
        p: "0 1rem",
        width: "100%",
      }}
    >
      {!isMobile && <Counter />}

      <Typography variant="h6" color={tillBroken ? "textPrimary" : "error"}>
        {!tillBroken ? (
          <>
            You are Broken <GiCrackedShield />
          </>
        ) : (
          <>
            Until Broken: <b>{tillBroken}</b>
          </>
        )}
      </Typography>

      <Typography variant="h6" color={tillDefeat ? "textPrimary" : "error"}>
        {!tillDefeat ? (
          <>
            You are Defeated <FaSkullCrossbones />
          </>
        ) : (
          <>
            Until Defeated: <b>{tillDefeat}</b>
          </>
        )}
      </Typography>

      {isMobile && <Counter />}
    </Stack>
  );
};
