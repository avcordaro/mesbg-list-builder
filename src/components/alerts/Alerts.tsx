import { useEffect } from "react";
import Alert from "react-bootstrap/Alert";
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
    <Alert
      style={{ width: "850px", zIndex: 1050, marginLeft: "535px" }}
      className="position-fixed"
      show={true}
      variant={variant}
      onClose={dismissAlert}
      dismissible
    >
      {content}
    </Alert>
  );
};
