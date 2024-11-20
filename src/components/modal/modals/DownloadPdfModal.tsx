import { Button, DialogActions, DialogContent } from "@mui/material";
import { useState } from "react";
import { useDownload } from "../../../hooks/download.ts";
import { useAppState } from "../../../state/app";
import { AlertTypes } from "../../alerts/alert-types.tsx";
import { PdfView } from "../../common/roster/PdfView.tsx";

export const DownloadPdfModal = () => {
  const { closeModal, triggerAlert } = useAppState();
  const { downloadPDF } = useDownload();
  const [loading, setLoading] = useState(false);

  const handleDownload = async () => {
    if (loading === true) return;
    setLoading(true);
    downloadPDF()
      .then(closeModal)
      .catch(() => triggerAlert(AlertTypes.DOWNLOAD_FAILED))
      .finally(() => setLoading(false));
  };

  return (
    <>
      <DialogContent>
        <PdfView />
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
          disabled={loading}
          sx={{ minWidth: "20ch" }}
        >
          Download
        </Button>
      </DialogActions>
    </>
  );
};
