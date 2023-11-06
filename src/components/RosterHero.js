import Card from "react-bootstrap/Card";
import Stack from "react-bootstrap/Stack";
import Button from "react-bootstrap/Button";
import Badge from "react-bootstrap/Badge";
import Form from "react-bootstrap/Form";
import { OptionHero } from "./OptionHero.js"
import { ImCross } from "react-icons/im";
import { BsFillPersonVcardFill } from "react-icons/bs";
import { v4 as uuid } from "uuid";

/* Roster Hero components display the hero in each warband. */

export function RosterHero({
  warbandNum,
  unitData,
  roster,
  setRoster,
  setShowCardModal,
  setCardUnitData
}) {
  const handleDelete = () => {
    // Removes the hero from being the warband's leader, and updates points and unit counts.
    let newRoster = { ...roster };
    let newUniqueModels = newRoster.uniqueModels.filter((data) => data != unitData.model_id);
    let newWarbands = newRoster.warbands.map((warband) => {
      let newWarband = { ...warband };
      if (newWarband.num == warbandNum) {
        newWarband["points"] =
          newWarband["points"] - newWarband.hero["pointsTotal"];
        // Bit of awkward logic here for siege engines where the whole siege crew needs to be removed from unit count.
        if (newWarband.hero.unit_type == "Siege Engine") {
          newWarband.num_units = newWarband.num_units - (newWarband.hero.siege_crew - 1);
          newRoster["num_units"] = newRoster["num_units"] - newWarband.hero.siege_crew;
          newWarband.hero.options.map((option) => {
            if (option.option == "Additional Crew") {
              newWarband.num_units = newWarband.num_units - option.opt_quantity;
              newRoster["num_units"] = newRoster["num_units"] - option.opt_quantity;
            }
          });
        } else {
          newRoster["num_units"] = 
            newRoster["num_units"] - 1;
        }
        newWarband["max_units"] = "-";
        newRoster["points"] =
          newRoster["points"] - newWarband.hero["pointsTotal"];
        newWarband.hero = null;
        let newUnits = newWarband.units.filter(_unit => _unit.name != null)
        newWarband.units = newUnits
      }
      return newWarband;
    });
    newRoster.uniqueModels = newUniqueModels;
    newRoster.warbands = newWarbands;
    setRoster(newRoster);
  };

  const handleCardClick = (e) => {
    // Update the state variables so that the correct profile card is loaded, and the pop-up modal is displayed.
    e.stopPropagation();
    setCardUnitData(unitData);
    setShowCardModal(true);
  };

  return (
    <Card style={{ width: "920px" }} className="p-2 m-1" bg={"light"}>
      <Stack direction="horizontal" gap={3}>
        <img
          className="profile"
          src={(() => {
            try {
              return require("../images/" + unitData.profile_origin + "/pictures/" + unitData.name + ".png")
            } 
            catch (e) {
              return require("../images/default.png")
            }
          })()}
        />
        <Stack>
          <Stack direction="horizontal" gap={3}>
            <p>
              <b>{unitData.name}</b>
            </p>
            <Badge style={{ marginBottom: "12px" }} bg="dark">
              {unitData.unit_type}
            </Badge>
            <p className="ms-auto" style={{ paddingRight: "10px" }}>
              Points: <b>{unitData.pointsTotal}</b>
            </p>
          </Stack>
          <Stack direction="horizontal" gap={3}>
            {unitData.options[0].option != "None" && (
              <Form>
                {unitData.options.map((option) => (
                  <OptionHero
                    key={uuid()}
                    roster={roster}
                    setRoster={setRoster}
                    warbandNum={warbandNum}
                    unit={unitData}
                    option={option}
                  />
                ))}
              </Form>
            )}
            <Stack direction="horizontal" gap={3} className="ms-auto mt-auto">
              <Button
                style={{ marginBottom: "5px" }}
                className="border"
                variant={"secondary"}
                onClick={handleCardClick}
              >
                <BsFillPersonVcardFill />
              </Button>
              <Button
                style={{ marginRight: "10px", marginBottom: "5px" }}
                variant={"warning"}
                onClick={handleDelete}
              >
                <ImCross />
              </Button>
            </Stack>
          </Stack>
        </Stack>
      </Stack>
    </Card>
  );
}