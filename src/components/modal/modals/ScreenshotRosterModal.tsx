import { Button, DialogContent } from "@mui/material";
import Typography from "@mui/material/Typography";
import { useTheme } from "@mui/material/styles";
import useMediaQuery from "@mui/material/useMediaQuery";
import { IoArrowBackCircle } from "react-icons/io5";
import { useStore } from "../../../state/store.ts";
import { ModalTypes } from "../../modal/modals.tsx";

export const ScreenshotRosterModal = () => {
  const { modalContext, setCurrentModal } = useStore();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));

  return (
    <DialogContent>
      <Button
        variant="contained"
        onClick={() => setCurrentModal(ModalTypes.ROSTER_TABLE)}
        startIcon={<IoArrowBackCircle />}
        fullWidth={isMobile}
        sx={{ mb: 2 }}
      >
        Back to Roster
      </Button>
      <Typography variant="subtitle2">
        The following is a screenshot image of your roster list which you can
        download, or copy to your clipboard as you wish.
      </Typography>
      {modalContext.screenshot != null && (
        <img
          src={modalContext.screenshot}
          alt="roster screenshot"
          style={{
            margin: "1rem 0",
            border: "1px solid black",
            boxShadow: "1px 1px 5px 0px #000000AA",
          }}
        />
      )}
    </DialogContent>
  );
};
