import { ContentCopyOutlined } from "@mui/icons-material";
import { Button, DialogActions, DialogContent } from "@mui/material";
import Typography from "@mui/material/Typography";
import { useStore } from "../../../state/store.ts";
import { AlertTypes } from "../../alerts/alert-types.tsx";

export const ScreenshotRosterModal = () => {
  const { modalContext, triggerAlert } = useStore();

  const copyImageToClipboard = () => {
    if (!modalContext.rawScreenshot) return;
    modalContext.rawScreenshot.toBlob((screenshot: Blob) => {
      navigator.clipboard
        .write([
          new ClipboardItem({
            "image/png": screenshot,
          }),
        ])
        .then(() => triggerAlert(AlertTypes.SCREENSHOT_COPIED_ALERT));
    });
  };

  return (
    <>
      <DialogContent>
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
      <DialogActions>
        <Button
          variant="contained"
          onClick={copyImageToClipboard}
          color="primary"
          startIcon={<ContentCopyOutlined />}
        >
          Copy image to clipboard
        </Button>
      </DialogActions>
    </>
  );
};
