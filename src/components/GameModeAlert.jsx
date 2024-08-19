import Alert from "react-bootstrap/Alert";
import Button from "react-bootstrap/Button";
import { VERSION } from "./TopNavbar";
import { TbRefresh } from "react-icons/tb";

export function GameModeAlert({ gameModeAlert, setGameModeAlert, setRoster }) {
  const handleResetList = () => {
    setRoster({
      version: VERSION,
      num_units: 0,
      points: 0,
      bow_count: 0,
      warbands: [],
    });
    setGameModeAlert(false);
  };
  return (
    <Alert
      style={{ width: "850px", zIndex: 1050, marginLeft: "535px" }}
      className="position-fixed"
      show={gameModeAlert}
      variant="danger"
      onClose={() => setGameModeAlert(false)}
      dismissible
    >
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
          onClick={() => setGameModeAlert(false)}
          variant="secondary"
        >
          Nevermind
        </Button>
        <Button onClick={handleResetList} variant="danger">
          <TbRefresh /> Reset List
        </Button>
      </div>
    </Alert>
  );
}
