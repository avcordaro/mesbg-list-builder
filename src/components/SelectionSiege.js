import Stack from "react-bootstrap/Stack";
import Button from "react-bootstrap/Button";
import Accordion from 'react-bootstrap/Accordion';
import {BsFillPersonVcardFill} from "react-icons/bs";
import {v4 as uuid} from "uuid";


const siege_equipment = [
  {
    "model_id":"[siege] rallying_point",
    "profile_origin":"Siege Equipment",
    "name":"Rallying Point",
    "base_points":25,
    "quantity":1,
    "pointsPerUnit":25,
    "pointsTotal":25,
    "unit_type": "Siege",
    "MWFW":[],
    "options":[{"option":"None"}]
  },
  {
    "model_id":"[siege] barricade",
    "profile_origin":"Siege Equipment",
    "name":"Barricade",
    "base_points":5,
    "quantity":1,
    "pointsPerUnit":5,
    "pointsTotal":5,
    "unit_type": "Siege",
    "MWFW":[],
    "options":[{"option":"None"}]
  },
  {
    "model_id":"[siege] spiked_barricade",
    "profile_origin":"Siege Equipment",
    "name":"Spiked Barricade",
    "base_points":10,
    "quantity":1,
    "pointsPerUnit":10,
    "pointsTotal":10,
    "unit_type": "Siege",
    "MWFW":[],
    "options":[{"option":"None"}]
  },
  {
    "model_id":"[siege] rocks",
    "profile_origin":"Siege Equipment",
    "name":"Rocks",
    "base_points":5,
    "quantity":1,
    "pointsPerUnit":5,
    "pointsTotal":5,
    "unit_type": "Siege",
    "MWFW":[],
    "options":[{"option":"None"}]
  },
  {
    "model_id":"[siege] boiling_oil",
    "profile_origin":"Siege Equipment",
    "name":"Boiling Oil",
    "base_points":30,
    "quantity":1,
    "pointsPerUnit":30,
    "pointsTotal":30,
    "unit_type": "Siege",
    "MWFW":[],
    "options":[{"option":"None"}]
  },
  {
    "model_id":"[siege] siege_tower",
    "profile_origin":"Siege Equipment",
    "name":"Siege Tower",
    "base_points":40,
    "quantity":1,
    "pointsPerUnit":40,
    "pointsTotal":40,
    "unit_type": "Siege",
    "MWFW":[],
    "options":[{"option":"None"}]
  },
  {
    "model_id":"[siege] siege_ladder",
    "profile_origin":"Siege Equipment",
    "name":"Siege Ladder",
    "base_points":5,
    "quantity":1,
    "pointsPerUnit":5,
    "pointsTotal":5,
    "unit_type": "Siege",
    "MWFW":[],
    "options":[{"option":"None"}]
  },
  {
    "model_id":"[siege] battering_ram",
    "profile_origin":"Siege Equipment",
    "name":"Battering Ram",
    "base_points":15,
    "quantity":1,
    "pointsPerUnit":15,
    "pointsTotal":15,
    "unit_type": "Siege",
    "MWFW":[],
    "options":[{"option":"None"}]
  },
];

export function SelectionSiege({
                                newWarriorFocus,
                                setDisplaySelection,
                                roster,
                                setRoster,
                                warbandNumFocus,
                              }) {

  const handleClick = (data) => {
    let newRoster = {...roster};
    let newUnitData = {...data};
    newUnitData["id"] = uuid();
    newRoster.warbands[warbandNumFocus].units = newRoster.warbands[warbandNumFocus].units.filter((data) => data.id !== newWarriorFocus);
    newRoster.warbands[warbandNumFocus].units.push(newUnitData);
    newRoster.warbands[warbandNumFocus].points = newRoster.warbands[warbandNumFocus].points + newUnitData.base_points;
    newRoster.points = newRoster.points + newUnitData.base_points;
    setRoster(newRoster);
    setDisplaySelection(false);
  };

  return (
    <Accordion style={{width: "461px"}} className="mt-3 shadow-sm">
      <Accordion.Item eventKey="0">
        <Accordion.Header><b>Siege Equipment</b></Accordion.Header>
        <Accordion.Body>
          <p className="text-muted">Equipment to be used for siege games. The full details can be found in the 'Sieges' section of the main rulebook and the War in Rohan supplement book.</p>
          {siege_equipment.map((data) =>
            <Button
              variant="light"
              style={{textAlign: "left"}}
              className="border shadow-sm w-100 mb-2"
              onClick={() => handleClick(data)}
            >
              <Stack direction="horizontal" gap={3}>
                <img
                  style={{width: "75px", height: "75px"}}
                  src={(() => {
                    try {
                      return require("../images/" + data.profile_origin + "/pictures/" + data.name + ".png");
                    } catch (e) {
                      return require("../images/default.png");
                    }
                  })()}
                  alt=""
                />
                <p>
                  <b>{data.name}</b>
                  <br/>
                  Points: {data.base_points} 
                </p>
              </Stack>
            </Button>
          )}
        </Accordion.Body>
      </Accordion.Item>
    </Accordion>
  );
}
