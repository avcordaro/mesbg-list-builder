import { useState } from "react";
import Modal from "react-bootstrap/Modal";
import Form from "react-bootstrap/Form";
import Button from "react-bootstrap/Button";
import { BiSolidFileImport } from "react-icons/bi";
import { useStore } from "../state/store";

/* Displays a modal for the user to enter their JSON army list into a textbox. */

export function ModalImportJSON({ showImportModal, setShowImportModal }) {
  const setRoster = useStore((store) => store.setRoster);

  const [JSONImport, setJSONImport] = useState("");
  const [importAlert, setImportAlert] = useState(false);

  const handleImportJSON = (e) => {
    // Attempts to read the input, convert it to JSON, and assigns the JSON dictionary to the roster state variable.
    e.preventDefault();
    try {
      let json = JSON.parse(JSONImport);
      let valid_json = ["num_units", "points", "bow_count", "warbands"].every(
        (key) => json.hasOwnProperty(key),
      );
      if (valid_json) {
        setRoster(json);
        setShowImportModal(false);
        setJSONImport("");
      } else {
        setImportAlert(true);
        window.setTimeout(() => setImportAlert(false), 5000);
      }
    } catch (err) {
      setImportAlert(true);
      window.setTimeout(() => setImportAlert(false), 5000);
    }
  };

  return (
    <Modal
      show={showImportModal}
      onHide={() => setShowImportModal(false)}
      size="lg"
      centered
    >
      <Modal.Header closeButton>
        <Modal.Title>Import JSON</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <Form
          noValidate
          style={{ textAlign: "right" }}
          onSubmit={handleImportJSON}
          className="me-4"
        >
          <Form.Control
            value={JSONImport}
            onChange={(e) =>
              setJSONImport(
                e.target.value.replace(/^"(.*)"$/, "$1").replaceAll('""', '"'),
              )
            }
            placeholder="Paste your army roster JSON string..."
          />
          {importAlert && (
            <p style={{ textAlign: "left" }} className="mt-2 ms-2 text-danger">
              JSON string for army list is invalid.
            </p>
          )}
          <Button
            className="ms-auto mt-3"
            onClick={handleImportJSON}
            type="submit"
          >
            <BiSolidFileImport /> Import JSON
          </Button>
        </Form>
      </Modal.Body>
    </Modal>
  );
}
