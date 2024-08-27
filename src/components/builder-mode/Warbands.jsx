import Badge from "react-bootstrap/Badge";
import Button from "react-bootstrap/Button";
import Card from "react-bootstrap/Card";
import Stack from "react-bootstrap/Stack";
import { FaPlus } from "react-icons/fa";
import { HiDuplicate } from "react-icons/hi";
import { MdDelete } from "react-icons/md";
import { v4 as uuid } from "uuid";
import { useStore } from "../../state/store";
import { ChooseHeroButton } from "./hero/ChooseHeroButton.jsx";
import { WarbandHero } from "./hero/WarbandHero.jsx";
import { ChooseWarriorButton } from "./warrior/ChooseWarriorButton.jsx";
import { WarbandWarrior } from "./warrior/WarbandWarrior.jsx";

/* Displays the list of all warbands, and also defines how each warband card looks. */

export function Warbands({
  setHeroSelection,
  setDisplaySelection,
  setWarbandNumFocus,
  specialArmyOptions,
  setSpecialArmyOptions,
  setNewWarriorFocus,
  setTabSelection,
  factionSelection,
  setFactionSelection,
}) {
  const { roster, addWarband, deleteWarband, duplicateWarband, addUnit } =
    useStore();

  const handleNewWarband = () => {
    addWarband();
    setDisplaySelection(false);
  };

  const handleCopyWarband = (warbandId) => {
    duplicateWarband(warbandId);
    setDisplaySelection(false);
  };

  const handleDeleteWarband = (warbandId) => {
    deleteWarband(warbandId);
    setDisplaySelection(false);
  };

  const handleNewWarrior = (warbandId) => {
    addUnit(warbandId);
    setHeroSelection(false);
    setDisplaySelection(false);
  };

  return (
    <Stack style={{ marginLeft: "535px" }} gap={3}>
      {roster.warbands.map((warband) => (
        <Card
          key={warband.id}
          style={{ width: "850px" }}
          className="p-2 shadow"
          bg="secondary"
          text="light"
        >
          <Stack direction="horizontal">
            {warband.hero ? (
              <Card.Text className="ms-2" style={{ fontSize: 20 }}>
                <Badge bg="dark">{warband.hero.faction}</Badge>
              </Card.Text>
            ) : (
              <Card.Text className="ms-2" style={{ fontSize: 20 }}>
                <Badge bg="dark">[Faction]</Badge>
              </Card.Text>
            )}
            <Card.Text className="ms-4">
              Warband: <b>{warband.num}</b>
            </Card.Text>
            <Card.Text
              className={
                warband.num_units > warband.max_units
                  ? "ms-4 text-warning"
                  : "ms-4"
              }
            >
              Units:{" "}
              <b>
                {warband.num_units} / {warband.max_units}
              </b>
            </Card.Text>
            <Card.Text className="ms-4">
              Points: <b>{warband.points}</b>
            </Card.Text>
            <Button
              onClick={() => handleCopyWarband(warband.id)}
              className="mt-1 ms-auto mb-2"
              style={{ marginRight: "10px" }}
              variant="info"
            >
              <HiDuplicate />
            </Button>
            <Button
              onClick={() => handleDeleteWarband(warband.id)}
              className="mt-1 mb-2"
              style={{ marginRight: "10px" }}
              variant="danger"
            >
              <MdDelete />
            </Button>
          </Stack>
          {warband.hero == null ? (
            <ChooseHeroButton
              key={uuid()}
              setHeroSelection={setHeroSelection}
              setDisplaySelection={setDisplaySelection}
              warbandNum={warband.num}
              setWarbandNumFocus={setWarbandNumFocus}
            />
          ) : (
            <WarbandHero
              key={uuid()}
              warbandNum={warband.num}
              unitData={warband.hero}
              specialArmyOptions={specialArmyOptions}
              setSpecialArmyOptions={setSpecialArmyOptions}
            />
          )}
          {warband.units.length > 0 &&
            warband.units.map((unit) =>
              unit.name == null ? (
                <ChooseWarriorButton
                  key={uuid()}
                  setNewWarriorFocus={setNewWarriorFocus}
                  unitData={unit}
                  setHeroSelection={setHeroSelection}
                  setDisplaySelection={setDisplaySelection}
                  warbandNum={warband.num}
                  setWarbandNumFocus={setWarbandNumFocus}
                  setTabSelection={setTabSelection}
                  factionSelection={factionSelection}
                  setFactionSelection={setFactionSelection}
                />
              ) : (
                <WarbandWarrior
                  key={uuid()}
                  warbandNum={warband.num}
                  unitData={unit}
                  specialArmyOptions={specialArmyOptions}
                />
              ),
            )}
          {warband.hero != null &&
            !["Independent Hero", "Independent Hero*", "Siege Engine"].includes(
              warband.hero.unit_type,
            ) &&
            warband.hero.model_id !==
              "[erebor_reclaimed_(king_thorin)] iron_hills_chariot_(champions_of_erebor)" &&
            warband.hero.model_id !== "[desolator_of_the_north] smaug" && (
              <Button
                onClick={() => handleNewWarrior(warband.id)}
                variant="info"
                className="m-1"
                style={{ width: "820px" }}
              >
                Add Unit <FaPlus />
              </Button>
            )}
        </Card>
      ))}
      <Button onClick={() => handleNewWarband()} style={{ width: "850px" }}>
        Add Warband <FaPlus />
      </Button>
    </Stack>
  );
}
