import { AlertColor, Portal, Slide, Snackbar } from "@mui/material";
import Alert from "@mui/material/Alert";
import Box from "@mui/material/Box";
import { useEffect } from "react";
import { useStore } from "../../state/store.ts";
import { alertMap } from "./alert-types.tsx";

export const Alerts = () => {
  const { activeAlert, dismissAlert } = useStore();

  // Auto hide of alerts, if configured
  useEffect(() => {
    if (activeAlert) {
      const { options } = alertMap.get(activeAlert);
      if (options.autoHideAfter && options.autoHideAfter) {
        const timeout = setTimeout(dismissAlert, options.autoHideAfter);
        return () => {
          clearTimeout(timeout);
        };
      }
    }
    return () => null;
  }, [activeAlert, dismissAlert]);

  if (!activeAlert) {
    // no active alert to display
    return null;
  }

  const { variant, content } = alertMap.get(activeAlert);
  return (
    <Portal>
      <Snackbar
        open={true}
        anchorOrigin={{ vertical: "top", horizontal: "center" }}
        TransitionComponent={Slide}
        onClose={dismissAlert}
      >
        <Alert
          onClose={dismissAlert}
          variant="standard"
          sx={{ width: "100%" }}
          severity={variant as AlertColor}
        >
          <Box sx={{ maxWidth: "72ch" }}>{content}</Box>
        </Alert>
      </Snackbar>
    </Portal>
  );
};
