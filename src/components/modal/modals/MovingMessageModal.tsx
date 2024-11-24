import { Button, DialogActions, DialogContent } from "@mui/material";
import Alert from "@mui/material/Alert";
import Stack from "@mui/material/Stack";
import Typography from "@mui/material/Typography";
import { useAppState } from "../../../state/app";

export const MovingMessageModal = () => {
  const { closeModal } = useAppState();
  return (
    <>
      <DialogContent>
        <Stack gap={2}>
          <Typography variant="h6">A New Path to Tread</Typography>
          <Typography>
            Hail, noble traveler! We embark on a new journey, and our home has
            moved to a new domain:{" "}
            <a href="https://v2018.mesbg-list-builder.com">
              v2018.mesbg-list-builder.com
            </a>
            . This change opens new realms to explore, allowing us to grow and
            craft new wonders for you.
          </Typography>

          <Alert icon={false} variant="outlined" severity="info">
            <Typography>
              Fear not, noble traveler, for thy rosters may be carried forth
              from this realm and into the new – with but a simple export and
              import, your lists shall journey unharmed to the land that awaits.
            </Typography>
          </Alert>

          <Typography>
            The journey is one of progress, and we welcome you to walk it with
            us.
          </Typography>
          <Typography textAlign="right">
            <i>~ Your MESBG List Builder Team</i>
          </Typography>
        </Stack>
      </DialogContent>
      <DialogActions>
        <Button variant="contained" onClick={closeModal}>
          Acknowledge
        </Button>
      </DialogActions>
    </>
  );
};
