import Modal from "react-bootstrap/Modal";
import { useStore } from "../../../state/store.ts";

export const ScreenshotRosterModal = () => {
  const { modalContext } = useStore();

  return (
    <Modal.Body>
      <h6>
        The following is a screenshot image of your roster list which you can
        download, or copy to your clipboard as you wish.
      </h6>
      <div className="screenshot m-3">
        {modalContext.screenshot != null && (
          <img
            className="border shadow border-secondary"
            src={modalContext.screenshot}
            alt=""
          />
        )}
      </div>
    </Modal.Body>
  );
};
