import { Refresh } from "@mui/icons-material";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import { Fragment } from "react";
import { useAppState } from "../../../state/app";

export const DownloadFailed = () => {
  const { dismissAlert } = useAppState();

  return (
    <Fragment>
      <b>Downloading failed</b>
      <hr />
      <p>
        Sorry, something went wrong while downloading the files. Please try
        again later. Please contact us if the problem persists.
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
          variant="contained"
          color="error"
          startIcon={<Refresh />}
        >
          Close
        </Button>
      </Box>
    </Fragment>
  );
};
