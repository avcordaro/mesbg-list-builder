import { ContentCopyOutlined, DownloadDoneOutlined } from "@mui/icons-material";
import { Button, DialogActions, DialogContent } from "@mui/material";
import Typography from "@mui/material/Typography";
import { useStore } from "../../../state/store.ts";
import { AlertTypes } from "../../alerts/alert-types.tsx";

export const ScreenshotRosterModal = () => {
  const { modalContext, triggerAlert, closeModal } = useStore();

  const supportsCopyImageToClipboard =
    navigator.clipboard && window.ClipboardItem;

  const copyToClipboard = () => {
    modalContext.rawScreenshot.toBlob((screenshot) => {
      navigator.clipboard
        .write([new ClipboardItem({ "image/png": screenshot })])
        .then(() => triggerAlert(AlertTypes.SCREENSHOT_COPIED_ALERT))
        .catch((e) => alert("error: " + JSON.stringify(e)));
      closeModal();
    });
  };

  function downloadScreenshot() {
    const canvas = document.createElement("canvas");
    const ctx = canvas.getContext("2d");
    const img = new Image();

    img.src = modalContext.screenshot;
    img.onload = () => {
      canvas.width = img.width;
      canvas.height = img.height;
      ctx.drawImage(img, 0, 0);

      const link = document.createElement("a");
      link.href = canvas.toDataURL("image/png");

      const timestamp = new Date()
        .toLocaleDateString("en-UK", {
          hour: "2-digit",
          minute: "2-digit",
          second: "2-digit",
        })
        .replace(/ /g, "-");

      link.download = `mesbg-list-builder-screenshot-${timestamp}.png`;
      link.click();

      closeModal();
    };
  }

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
        {supportsCopyImageToClipboard ? (
          <Button
            variant="contained"
            onClick={copyToClipboard}
            color="primary"
            startIcon={<ContentCopyOutlined />}
          >
            Copy image to clipboard
          </Button>
        ) : (
          <Button
            variant="contained"
            onClick={downloadScreenshot}
            color="primary"
            startIcon={<DownloadDoneOutlined />}
          >
            Download image
          </Button>
        )}
      </DialogActions>
    </>
  );
};
