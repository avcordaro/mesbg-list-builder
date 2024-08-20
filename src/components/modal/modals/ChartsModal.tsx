import Modal from "react-bootstrap/Modal";
import { useStore } from "../../../state/store.ts";

export function ChartsModal() {
  const {
    modelContext: { selectedChart },
  } = useStore();

  return (
    <Modal.Body style={{ textAlign: "center" }}>
      <img
        className="border border-secondary"
        src={"./assets/images/charts/" + selectedChart + ".png"}
        alt=""
        style={{ maxWidth: "100%" }}
      />
    </Modal.Body>
  );
}
