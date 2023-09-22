import Stack from "react-bootstrap/Stack";
import Button from "react-bootstrap/Button";
import { ImCross } from "react-icons/im";

export function DefaultWarriorUnit({
  setNewWarriorFocus,
  unitData,
  roster,
  setRoster,
  setHeroSelection,
  setDisplaySelection,
  warbandNum,
  setWarbandNumFocus,
}) {
  const handleClick = (e) => {
    setHeroSelection(false);
    setDisplaySelection(true);
    setWarbandNumFocus(warbandNum - 1);
    setNewWarriorFocus(unitData.id);
  };
  const handleDelete = (e) => {
    e.stopPropagation();
    let newRoster = { ...roster };
    newRoster.warbands[warbandNum - 1].units = newRoster.warbands[
      warbandNum - 1
    ].units.filter((data) => data.id != unitData.id);
    setRoster(newRoster);
    setDisplaySelection(false);
  };

  return (
    <Button
      variant="light"
      className="p-2 m-1"
      style={{ width: "1100px", textAlign: "left" }}
      onClick={handleClick}
    >
      <Stack direction="horizontal" gap={3}>
        <img className="profile" src={require("../images/default.png")} />
        <p>
          <b>Choose a Warrior</b>
        </p>
        <Button
          onClick={handleDelete}
          className="ms-auto mt-auto"
          style={{ marginRight: "10px", marginBottom: "5px" }}
          variant={"warning"}
        >
          <ImCross />
        </Button>
      </Stack>
    </Button>
  );
}