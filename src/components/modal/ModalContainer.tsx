import CloseIcon from "@mui/icons-material/Close";
import { Dialog } from "@mui/material";
import Box from "@mui/material/Box";
import Divider from "@mui/material/Divider";
import IconButton from "@mui/material/IconButton";
import Typography from "@mui/material/Typography";
import { useTheme } from "@mui/material/styles";
import useMediaQuery from "@mui/material/useMediaQuery";
import { useAppState } from "../../state/app";
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
  const state = useAppState();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("md"));

  if (!state.currentlyOpenendModal) {
    // No model is shown, return...
    return null;
  }

  const currentModal = modals.get(state.currentlyOpenendModal);
  const { title, onClose } = state?.modalContext || {};
  return (
    <Dialog
      open={true} // handled by the modal container, so this should always be true
      onClose={onClose ? onClose : () => state.closeModal()}
      scroll="paper"
    >
      <Box
        sx={{
          ...style,
          minWidth: isMobile ? "90vw" : "64ch",
          maxWidth: "90vw",
          maxHeight: "90vh",
          overflowY: "scroll",
        }}
      >
        {!currentModal.customModalHeader && (
          <>
            <Box sx={{ display: "flex", alignItems: "center", p: 1 }}>
              <Typography
                variant="h6"
                component="h2"
                flexGrow={1}
                sx={{
                  display: "flex",
                  alignItems: "center",
                  gap: 1,
                }}
              >
                {currentModal.icon} {title || currentModal.title}
              </Typography>
              <IconButton
                onClick={onClose ? onClose : () => state.closeModal()}
                sx={{ ml: "auto" }}
              >
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
