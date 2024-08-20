import { useState } from "react";
import Button from "react-bootstrap/Button";
import Form from "react-bootstrap/Form";
import Modal from "react-bootstrap/Modal";
import { useStore } from "../../../state/store";
import { Roster } from "../../../types/roster.ts";

/* Displays a modal for the user to enter their JSON army list into a textbox. */

export const ImportRosterModal = () => {
  const { setRoster, closeModal } = useStore();

  const [JSONImport, setJSONImport] = useState("");
  const [importAlert, setImportAlert] = useState(false);

  const displayImportAlert = () => {
    setImportAlert(true);
    window.setTimeout(() => setImportAlert(false), 5000);
  };

  const hasKeys = (obj: object, keys: string[]): obj is Roster =>
    keys.every((key) => key in obj);

  const tryImportJSON = () => {
    const json = JSON.parse(JSONImport);
    const valid_json = hasKeys(json, [
      "num_units",
      "points",
      "bow_count",
      "warbands",
    ]);

    if (!valid_json) {
      throw new Error("Invalid JSON!");
    }

    setRoster(json);
    setJSONImport("");
  };

  const handleImportJSON = (e) => {
    // Attempts to read the input, convert it to JSON, and assigns the JSON dictionary to the roster state variable.
    e.preventDefault();
    try {
      tryImportJSON();
      closeModal();
    } catch {
      displayImportAlert();
    }
  };

  return (
    <>
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
            Import
          </Button>
        </Form>
      </Modal.Body>
    </>
  );
};
