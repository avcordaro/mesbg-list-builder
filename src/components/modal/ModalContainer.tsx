import CloseIcon from "@mui/icons-material/Close";
import { Dialog } from "@mui/material";
import Box from "@mui/material/Box";
import Divider from "@mui/material/Divider";
import IconButton from "@mui/material/IconButton";
import Typography from "@mui/material/Typography";
import { useTheme } from "@mui/material/styles";
import useMediaQuery from "@mui/material/useMediaQuery";
import { useStore } from "../../state/store.ts";
import { modals } from "./modals.tsx";

const style = {
  position: "absolute" as const,
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  bgcolor: "background.paper",
  boxShadow: 24,
  borderRadius: 2,
};

export const ModalContainer = () => {
  const state = useStore();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("lg"));

  if (!state.currentlyOpenendModal) {
    // No model is shown, return...
    return null;
  }

  const currentModal = modals.get(state.currentlyOpenendModal);
  const { title } = state?.modalContext || {};
  return (
    <Dialog
      open={true} // handled by the modal container, so this should always be true
      onClose={() => state.closeModal()}
    >
      <Box sx={{ ...style, minWidth: isMobile ? "90vw" : "72ch" }}>
        {!currentModal.customModalHeader && (
          <>
            <Box sx={{ display: "flex", alignItems: "center", p: 1 }}>
              <Typography variant="h6" component="h2" flexGrow={1}>
                {currentModal.icon} {title || currentModal.title}
              </Typography>
              <IconButton onClick={state.closeModal} sx={{ ml: "auto" }}>
                <CloseIcon />
              </IconButton>
            </Box>
            <Divider />
          </>
        )}
        <Box>{currentModal.children}</Box>
      </Box>
    </Dialog>
  );
};
