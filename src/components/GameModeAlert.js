import Alert from "react-bootstrap/Alert";
import React from "react";


export function GameModeAlert({gameModeAlert, setGameModeAlert}) {
  return (<Alert
    style={{width: "850px", zIndex: 1050, marginLeft: "535px"}}
    className="position-fixed"
    show={gameModeAlert}
    variant="danger"
    onClose={() => setGameModeAlert(false)}
    dismissible
  >
    <b>Outdated Army List for Game Mode</b>
    <hr/>
    Sorry, but it appears you imported an army list from an older version of the application.
    Game Mode is only supported for army lists built in v5.0.0 or later.
    Please <b>refresh</b> the page and rebuild your army list in order to use Game Mode.
  </Alert>);
}
