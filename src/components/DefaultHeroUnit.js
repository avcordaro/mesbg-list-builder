import Stack from "react-bootstrap/Stack";
import Button from "react-bootstrap/Button";

/* Default Hero Unit components appear inside Warbands as the first unit card, 
before the user selects the hero they would like to lead that warband. */

export function DefaultHeroUnit({
                                  setHeroSelection,
                                  setDisplaySelection,
                                  warbandNum,
                                  setWarbandNumFocus,
                                }) {
  const handleClick = () => {
    /* Updates state variables to identify that a hero is being chosen, the warband that hero
    belongs to, and that the unit selection menu should be display */
    setHeroSelection(true);
    setDisplaySelection(true);
    setWarbandNumFocus(warbandNum - 1);
  };

  return (<Button
      variant="light"
      className="p-2 m-1"
      style={{width: "820px", textAlign: "left"}}
      onClick={handleClick}
    >
      <Stack direction="horizontal" gap={3}>
        <img className="profile" src={require("../images/default.png")} alt=""/>
        <p>
          <b>Choose a Hero</b>
        </p>
      </Stack>
    </Button>);
}