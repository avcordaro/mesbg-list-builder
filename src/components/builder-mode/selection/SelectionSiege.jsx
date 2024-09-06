import Accordion from "react-bootstrap/Accordion";
import Button from "react-bootstrap/Button";
import Stack from "react-bootstrap/Stack";
import { v4 as uuid } from "uuid";
import siege_equipment from "../../../assets/data/siege_equipment.json";
import { useStore } from "../../../state/store";
import { UnitProfilePicture } from "../../common/images/UnitProfilePicture.tsx";

export function SelectionSiege({
  newWarriorFocus,
  setDisplaySelection,
  warbandNumFocus,
}) {
  const { roster, setRoster } = useStore();

  const handleClick = (data) => {
    let newRoster = { ...roster };
    let newUnitData = { ...data };
    newUnitData["id"] = uuid();
    newRoster.warbands[warbandNumFocus].units = newRoster.warbands[
      warbandNumFocus
    ].units.filter((data) => data.id !== newWarriorFocus);
    newRoster.warbands[warbandNumFocus].units.push(newUnitData);
    newRoster.warbands[warbandNumFocus].points =
      newRoster.warbands[warbandNumFocus].points + newUnitData.base_points;
    newRoster.points = newRoster.points + newUnitData.base_points;
    setRoster(newRoster);
    setDisplaySelection(false);
  };

  return (
    <Accordion style={{ width: "461px" }} className="mt-3 shadow-sm">
      <Accordion.Item eventKey="0">
        <Accordion.Header>
          <b>Siege Equipment</b>
        </Accordion.Header>
        <Accordion.Body>
          <p className="text-muted">
            Equipment to be used for siege games. The full details can be found
            in the 'Sieges' section of the main rulebook and the War in Rohan
            supplement book.
          </p>
          {siege_equipment.map((data) => (
            <Button
              variant="light"
              style={{ textAlign: "left" }}
              className="border shadow-sm w-100 mb-2"
              onClick={() => handleClick(data)}
            >
              <Stack direction="horizontal" gap={3}>
                <UnitProfilePicture
                  army={data.profile_origin}
                  profile={data.name}
                  style={{ width: "75px", height: "75px" }}
                />
                <p>
                  <b>{data.name}</b>
                  <br />
                  Points: {data.base_points}
                </p>
              </Stack>
            </Button>
          ))}
        </Accordion.Body>
      </Accordion.Item>
    </Accordion>
  );
}
