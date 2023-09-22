import Stack from "react-bootstrap/Stack";
import Button from "react-bootstrap/Button";
import Badge from "react-bootstrap/Badge";
import { BsFillPersonVcardFill } from "react-icons/bs";
import { v4 as uuid } from "uuid";

export function SelectionUnit({
  newWarriorFocus,
  setDisplaySelection,
  heroSelection,
  unitData,
  roster,
  setRoster,
  warbandNumFocus,
  setShowCardModal,
  setCardUnitData,
}) {
  const handleClick = () => {
    let newRoster = { ...roster };
    let newUnitData = { ...unitData };
    newUnitData["id"] = uuid();

    if (heroSelection) {
      newRoster.warbands[warbandNumFocus].hero = newUnitData;
      newRoster.warbands[warbandNumFocus].points =
        newRoster.warbands[warbandNumFocus].points + newUnitData.base_points;
      newRoster.warbands[warbandNumFocus].max_units = newUnitData.warband_size;
      if (newUnitData.unit_type == "Siege Engine") {
        newRoster.warbands[warbandNumFocus].num_units =
          newRoster.warbands[warbandNumFocus].num_units +
          newUnitData.siege_crew;
        newRoster.num_units = newRoster.num_units + newUnitData.siege_crew;
      } else {
        newRoster.num_units = newRoster.num_units + 1;
      }
    } else {
      newRoster.warbands[warbandNumFocus].units = newRoster.warbands[
        warbandNumFocus
      ].units.filter((data) => data.id != newWarriorFocus);
      newRoster.warbands[warbandNumFocus].units.push(newUnitData);
      newRoster.warbands[warbandNumFocus].points =
        newRoster.warbands[warbandNumFocus].points + newUnitData.base_points;
      newRoster.warbands[warbandNumFocus].num_units =
        newRoster.warbands[warbandNumFocus].num_units + 1;
      newRoster.num_units = newRoster.num_units + 1;
    }
    newRoster.points = newRoster.points + newUnitData.base_points;
    newRoster.bow_count =
      newRoster.bow_count + (unitData.inc_bow_count ? 1 : 0);
    setRoster(newRoster);
    setDisplaySelection(false);
  };

  const handleCardClick = (e) => {
    e.stopPropagation();
    setCardUnitData(unitData);
    setShowCardModal(true);
  };

  return (
    <Button
      variant="light"
      style={{ width: "457px", textAlign: "left" }}
      onClick={handleClick}
    >
      <Stack direction="horizontal" gap={3}>
        <img
          className="profile"
          src={require(
            "../images/" +
              unitData.faction +
              "/pictures/" +
              unitData.name +
              ".png",
          )}
        />
        <p>
          <b>{unitData.name}</b>
          <br />
          Points: {unitData.base_points}
          <br />
          {unitData.unit_type != "Warrior" && (
            <Badge className="mt-2" bg="dark">
              {unitData.unit_type}
            </Badge>
          )}
        </p>
        <Button
          className="ms-auto me-2 border"
          variant={"secondary"}
          onClick={handleCardClick}
        >
          <BsFillPersonVcardFill />
        </Button>
      </Stack>
    </Button>
  );
}