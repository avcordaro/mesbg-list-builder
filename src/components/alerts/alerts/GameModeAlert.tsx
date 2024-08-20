import Button from "react-bootstrap/Button";
import { TbRefresh } from "react-icons/tb";
import { useStore } from "../../../state/store";

export const GameModeAlert = () => {
  const { setRoster, dismissAlert } = useStore();

  const handleResetList = () => {
    setRoster({
      version: BUILD_VERSION,
      num_units: 0,
      points: 0,
      bow_count: 0,
      warbands: [],
    });
    dismissAlert();
  };
  return (
    <>
      <b>Outdated Army List for Game Mode</b>
      <hr />
      Sorry, but your army list contains outdated data. This can happen when
      importing a list built using an older version of the application. Game
      Mode is only supported for army lists built in <b>v5.0.0</b> or later. You
      will need to reset your list and rebuild it in order to use Game Mode.
      <hr />
      <div className="mt-2 d-flex justify-content-end">
        <Button
          className="me-3"
          onClick={() => dismissAlert()}
          variant="secondary"
        >
          Nevermind
        </Button>
        <Button onClick={() => handleResetList()} variant="danger">
          <TbRefresh /> Reset List
        </Button>
      </div>
    </>
  );
};
