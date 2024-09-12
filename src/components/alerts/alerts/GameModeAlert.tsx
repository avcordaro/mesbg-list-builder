import { Refresh } from "@mui/icons-material";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import { Fragment } from "react";
import { useStore } from "../../../state/store";

export const GameModeAlert = () => {
  const { setRoster, dismissAlert } = useStore();

  const handleResetList = () => {
    setRoster({
      version: BUILD_VERSION,
      num_units: 0,
      points: 0,
      bow_count: 0,
      leader_warband_id: null,
      warbands: [],
    });
    dismissAlert();
  };
  return (
    <Fragment>
      <b>Outdated Army List for Game Mode</b>
      <hr />
      <p>
        Sorry, but your army list contains outdated data. This can happen when
        importing a list built using an older version of the application. Game
        Mode is only supported for army lists built in <b>v5.0.0</b> or later.
        You will need to reset your list and rebuild it in order to use Game
        Mode.
      </p>
      <hr />
      <Box
        sx={{
          mt: 2,
          display: "flex",
          justifyContent: "end",
        }}
      >
        <Button
          onClick={() => dismissAlert()}
          variant="outlined"
          color="inherit"
          sx={{
            mr: 2,
          }}
        >
          Nevermind
        </Button>
        <Button
          onClick={() => handleResetList()}
          variant="contained"
          color="error"
          startIcon={<Refresh />}
        >
          Reset List
        </Button>
      </Box>
    </Fragment>
  );
};
