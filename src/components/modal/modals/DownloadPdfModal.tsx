import { Button, DialogActions, DialogContent } from "@mui/material";
import Alert from "@mui/material/Alert";
import Box from "@mui/material/Box";
import { useDownload } from "../../../hooks/download.ts";
import { useAppState } from "../../../state/app";
import { AlertTypes } from "../../alerts/alert-types.tsx";
import { PdfView } from "../../common/roster/PdfView.tsx";

export const DownloadPdfModal = () => {
  const { closeModal, triggerAlert } = useAppState();
  const { downloadPDF } = useDownload();

  const handleDownload = async () => {
    downloadPDF()
      .catch(() => triggerAlert(AlertTypes.DOWNLOAD_FAILED))
      .finally(closeModal);
  };

  return (
    <>
      <DialogContent>
        <Alert severity="info" sx={{ mb: 2 }}>
          Below is a preview of the PDF that is going to be downloaded
        </Alert>
        <Box sx={{ maxHeight: "50svh" }}>
          <Box sx={{ border: 1, p: 3 }}>
            <PdfView />
          </Box>
        </Box>
      </DialogContent>
      <DialogActions>
        <Button
          variant="text"
          color="inherit"
          onClick={closeModal}
          sx={{ minWidth: "20ch" }}
        >
          Cancel
        </Button>
        <Button
          variant="contained"
          color="primary"
          onClick={handleDownload}
          sx={{ minWidth: "20ch" }}
        >
          Download
        </Button>
      </DialogActions>
    </>
  );
};
