import Alert from "react-bootstrap/Alert";
import React from "react";

/* Displays an alert pop-up when the user clicks 'Export JSON' for their list. */

export function ExportAlert({exportAlert, setExportAlert}) {
  return (<Alert
    style={{width: "850px", zIndex: 1050}}
    className="position-fixed"
    show={exportAlert}
    variant="success"
    onClose={() => setExportAlert(false)}
    dismissible
  >
    <b>JSON string copied to your clipboard.</b>
    <hr/>
    You can keep this somewhere safe, such as in a text file, to reload your
    army list again later using 'Import JSON'.
  </Alert>);
}
