import Card from "react-bootstrap/Card";
import Stack from "react-bootstrap/Stack";
import Button from "react-bootstrap/Button";
import Badge from "react-bootstrap/Badge";
import Form from "react-bootstrap/Form";
import { OptionWarrior } from "./OptionWarrior.js"
import { FaPlus, FaMinus } from "react-icons/fa";
import { ImCross } from "react-icons/im";
import { HiDuplicate } from "react-icons/hi";
import { BsFillPersonVcardFill } from "react-icons/bs";
import { v4 as uuid } from "uuid";

/* Roster Warrior components display an individual warrior unit in a warband. */

export function RosterWarrior({
  warbandNum,
  unitData,
  roster,
  setRoster,
  setShowCardModal,
  setCardUnitData,
}) {
  const handleIncrement = () => {
    // Updates the roster state variable to handle increase to points, units and bow count totals.
    let newRoster = { ...roster };
    let newWarbands = newRoster.warbands.map((warband) => {
      let newWarband = { ...warband };
      if (newWarband.num == warbandNum) {
        let newUnits = newWarband.units.map((_unit) => {
          let newUnit = { ..._unit };
          if (newUnit.id == unitData.id) {
            newRoster["points"] = newRoster["points"] - newUnit["pointsTotal"];
            newWarband["points"] =
              newWarband["points"] - newUnit["pointsTotal"];
            newUnit["quantity"] = newUnit["quantity"] + 1;
            newUnit["pointsTotal"] =
              newUnit["quantity"] * newUnit["pointsPerUnit"];
            newWarband["points"] =
              newWarband["points"] + newUnit["pointsTotal"];
            newWarband["num_units"] = newWarband["num_units"] + 1;
            newWarband["bow_count"] =
              newWarband["bow_count"] + (newUnit["inc_bow_count"] ? 1 : 0);
            newRoster["num_units"] = newRoster["num_units"] + 1;
            newRoster["points"] = newRoster["points"] + newUnit["pointsTotal"];
            newRoster["bow_count"] =
              newRoster["bow_count"] + (newUnit["inc_bow_count"] ? 1 : 0);
          }
          return newUnit;
        });
        newWarband.units = newUnits;
      }
      return newWarband;
    });
    newRoster.warbands = newWarbands;
    setRoster(newRoster);
  };

  const handleDecrement = () => {
    // Updates the roster state variable to handle decrease to points, units and bow count totals.
    if (unitData.quantity > 1) {
      let newRoster = { ...roster };
      let newWarbands = newRoster.warbands.map((warband) => {
        let newWarband = { ...warband };
        if (newWarband.num == warbandNum) {
          let newUnits = newWarband.units.map((_unit) => {
            let newUnit = { ..._unit };
            if (newUnit.id == unitData.id) {
              newRoster["points"] =
                newRoster["points"] - newUnit["pointsTotal"];
              newWarband["points"] =
                newWarband["points"] - newUnit["pointsTotal"];
              newUnit["quantity"] = newUnit["quantity"] - 1;
              newUnit["pointsTotal"] =
                newUnit["quantity"] * newUnit["pointsPerUnit"];
              newWarband["points"] =
                newWarband["points"] + newUnit["pointsTotal"];
              newWarband["num_units"] = newWarband["num_units"] - 1;
              newWarband["bow_count"] =
                newWarband["bow_count"] - (newUnit["inc_bow_count"] ? 1 : 0);
              newRoster["num_units"] = newRoster["num_units"] - 1;
              newRoster["points"] =
                newRoster["points"] + newUnit["pointsTotal"];
              newRoster["bow_count"] =
                newRoster["bow_count"] - (newUnit["inc_bow_count"] ? 1 : 0);
            }
            return newUnit;
          });
          newWarband.units = newUnits;
        }
        return newWarband;
      });
      newRoster.warbands = newWarbands;
      setRoster(newRoster);
    }
  };

  const handleDelete = () => {
    // Updates the roster state variable to remove warrior unit, and handle adjustment to points, units and bow count totals.
    let newRoster = { ...roster };
    let newWarbands = newRoster.warbands.map((warband) => {
      let newWarband = { ...warband };
      if (newWarband.num == warbandNum) {
        let newUnits = newWarband.units.map((_unit) => {
          let newUnit = { ..._unit };
          if (newUnit.id == unitData.id) {
            newWarband["points"] =
              newWarband["points"] - newUnit["pointsTotal"];
            newWarband["num_units"] =
              newWarband["num_units"] - newUnit["quantity"];
            newWarband["bow_count"] =
              newWarband["bow_count"] -
              (newUnit["inc_bow_count"] ? 1 : 0) * newUnit["quantity"];
            newRoster["num_units"] =
              newRoster["num_units"] - newUnit["quantity"];
            newRoster["points"] = newRoster["points"] - newUnit["pointsTotal"];
            newRoster["bow_count"] =
              newRoster["bow_count"] -
              (newUnit["inc_bow_count"] ? 1 : 0) * newUnit["quantity"];
          }
          return newUnit;
        });
        newUnits = newUnits.filter((data) => data.id != unitData.id);
        newWarband.units = newUnits;
      }
      return newWarband;
    });
    newRoster.warbands = newWarbands;
    setRoster(newRoster);
  };

  const handleDuplicate = () => {
    /* Duplicates the warrior unit in the warband that this unit belongs to (but with a new unique ID). 
    Also updates the roster state variable with adjustments to points, units and bow count totals. */
    let newRoster = { ...roster };
    let newUnit = { ...unitData };
    newUnit["id"] = uuid();
    newRoster.warbands[warbandNum - 1].units.push(newUnit);
    newRoster.warbands[warbandNum - 1]["num_units"] =
      newRoster.warbands[warbandNum - 1]["num_units"] + newUnit["quantity"];
    newRoster.warbands[warbandNum - 1]["points"] =
      newRoster.warbands[warbandNum - 1]["points"] + newUnit["pointsTotal"];
    newRoster.warbands[warbandNum - 1]["bow_count"] =
      newRoster.warbands[warbandNum - 1]["bow_count"] +
      (newUnit["inc_bow_count"] ? 1 : 0) * newUnit["quantity"];
    newRoster["num_units"] = newRoster["num_units"] + newUnit["quantity"];
    newRoster["points"] = newRoster["points"] + newUnit["pointsTotal"];
    newRoster["bow_count"] =
      newRoster["bow_count"] +
      (newUnit["inc_bow_count"] ? 1 : 0) * newUnit["quantity"];

    setRoster(newRoster);
  };

  const handleCardClick = (e) => {
    // Update the state variables so that the correct profile card is loaded, and the pop-up modal is displayed.
    e.stopPropagation();
    setCardUnitData(unitData);
    setShowCardModal(true);
  };

  return (
    <Card style={{ width: "1100px" }} className="p-2 m-1" bg={"light"}>
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
            {unitData.unit_type != "Warrior" && 
              <Badge style={{ marginBottom: "12px" }} bg="dark">
                {unitData.unit_type}
              </Badge>
            }
            <p className="ms-auto" style={{ paddingRight: "10px" }}>
              Points: <b>{unitData.pointsTotal}</b>{unitData.unit_type == "Warrior" && " (per unit: " + unitData.pointsPerUnit + ")"}
            </p>
          </Stack>
          <Stack direction="horizontal" gap={3}>
            {unitData.options[0].option != "None" && (
              <Form>
                {unitData.options.map((option) => (
                  <OptionWarrior
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
                className="border"
                variant={"secondary"}
                onClick={handleCardClick}
              >
                <BsFillPersonVcardFill />
              </Button>
              {unitData.unit_type == "Warrior" &&
                <>
                  <>
                    <Button onClick={handleDecrement}>
                      <FaMinus />
                    </Button>
                    <p className="mt-3">
                      <b>{unitData.quantity}</b>
                    </p>
                    <Button onClick={handleIncrement}>
                      <FaPlus />
                    </Button>
                  </>
                  <Button onClick={handleDuplicate} variant={"info"}>
                    <HiDuplicate />
                  </Button>
                </>
              }
              <Button
                style={{ marginRight: "10px" }}
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