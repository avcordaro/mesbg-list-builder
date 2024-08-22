import Badge from "react-bootstrap/Badge";
import Button from "react-bootstrap/Button";
import Card from "react-bootstrap/Card";
import Form from "react-bootstrap/Form";
import Stack from "react-bootstrap/Stack";
import { BsFillPersonVcardFill } from "react-icons/bs";
import { FaMinus, FaPlus } from "react-icons/fa";
import { HiDuplicate } from "react-icons/hi";
import { ImCross } from "react-icons/im";
import { v4 as uuid } from "uuid";
import { useStore } from "../state/store";
import { OptionWarrior } from "./OptionWarrior";
import { UnitProfilePicture } from "./images/UnitProfilePicture.tsx";
import { ModalTypes } from "./modal/modals";

/* Warband Warrior components display an individual warrior unit in a warband. */

export function WarbandWarrior({ warbandNum, unitData, specialArmyOptions }) {
  const { roster, setRoster, setCurrentModal } = useStore();

  const handleIncrement = () => {
    // Updates the roster state variable to handle increase to points, units and bow count totals.
    let newRoster = { ...roster };
    newRoster.warbands = newRoster.warbands.map((warband) => {
      let newWarband = { ...warband };
      if (newWarband.num === warbandNum) {
        newWarband.units = newWarband.units.map((_unit) => {
          let newUnit = { ..._unit };
          if (newUnit.id === unitData.id) {
            if (newUnit.unit_type === "Siege") {
              newRoster["points"] =
                newRoster["points"] - newUnit["pointsTotal"];
              newWarband["points"] =
                newWarband["points"] - newUnit["pointsTotal"];
              newUnit["quantity"] = newUnit["quantity"] + 1;
              newUnit["pointsTotal"] =
                newUnit["quantity"] * newUnit["pointsPerUnit"];
              newWarband["points"] =
                newWarband["points"] + newUnit["pointsTotal"];
              newRoster["points"] =
                newRoster["points"] + newUnit["pointsTotal"];
            } else {
              newRoster["points"] =
                newRoster["points"] - newUnit["pointsTotal"];
              newWarband["points"] =
                newWarband["points"] - newUnit["pointsTotal"];
              newUnit["quantity"] = newUnit["quantity"] + 1;
              newUnit["pointsTotal"] =
                newUnit["quantity"] * newUnit["pointsPerUnit"];
              newWarband["points"] =
                newWarband["points"] + newUnit["pointsTotal"];
              newWarband["num_units"] =
                newWarband["num_units"] +
                (unitData.siege_crew ? unitData.siege_crew : 1);
              newWarband["bow_count"] =
                newWarband["bow_count"] + (newUnit["inc_bow_count"] ? 1 : 0);
              newRoster["num_units"] =
                newRoster["num_units"] +
                (unitData.siege_crew ? unitData.siege_crew : 1);
              newRoster["points"] =
                newRoster["points"] + newUnit["pointsTotal"];
              newRoster["bow_count"] =
                newRoster["bow_count"] + (newUnit["inc_bow_count"] ? 1 : 0);
            }
          }
          return newUnit;
        });
      }
      return newWarband;
    });
    setRoster(newRoster);
  };

  const handleDecrement = () => {
    // Updates the roster state variable to handle decrease to points, units and bow count totals.
    if (unitData.quantity > 1) {
      let newRoster = { ...roster };
      newRoster.warbands = newRoster.warbands.map((warband) => {
        let newWarband = { ...warband };
        if (newWarband.num === warbandNum) {
          newWarband.units = newWarband.units.map((_unit) => {
            let newUnit = { ..._unit };
            if (newUnit.id === unitData.id) {
              if (newUnit.unit_type === "Siege") {
                newRoster["points"] =
                  newRoster["points"] - newUnit["pointsTotal"];
                newWarband["points"] =
                  newWarband["points"] - newUnit["pointsTotal"];
                newUnit["quantity"] = newUnit["quantity"] - 1;
                newUnit["pointsTotal"] =
                  newUnit["quantity"] * newUnit["pointsPerUnit"];
                newWarband["points"] =
                  newWarband["points"] + newUnit["pointsTotal"];
                newRoster["points"] =
                  newRoster["points"] + newUnit["pointsTotal"];
              } else {
                newRoster["points"] =
                  newRoster["points"] - newUnit["pointsTotal"];
                newWarband["points"] =
                  newWarband["points"] - newUnit["pointsTotal"];
                newUnit["quantity"] = newUnit["quantity"] - 1;
                newUnit["pointsTotal"] =
                  newUnit["quantity"] * newUnit["pointsPerUnit"];
                newWarband["points"] =
                  newWarband["points"] + newUnit["pointsTotal"];
                newWarband["num_units"] =
                  newWarband["num_units"] -
                  (unitData.siege_crew ? unitData.siege_crew : 1);
                newWarband["bow_count"] =
                  newWarband["bow_count"] - (newUnit["inc_bow_count"] ? 1 : 0);
                newRoster["num_units"] =
                  newRoster["num_units"] -
                  (unitData.siege_crew ? unitData.siege_crew : 1);
                newRoster["points"] =
                  newRoster["points"] + newUnit["pointsTotal"];
                newRoster["bow_count"] =
                  newRoster["bow_count"] - (newUnit["inc_bow_count"] ? 1 : 0);
              }
            }
            return newUnit;
          });
        }
        return newWarband;
      });
      setRoster(newRoster);
    }
  };

  const handleDelete = () => {
    // Updates the roster state variable to remove warrior unit, and handle adjustment to points, units and bow count totals.
    let newRoster = { ...roster };
    newRoster.warbands = newRoster.warbands.map((warband) => {
      let newWarband = { ...warband };
      if (newWarband.num === warbandNum) {
        let newUnits = newWarband.units.map((_unit) => {
          let newUnit = { ..._unit };
          if (newUnit.id === unitData.id) {
            if (newUnit.unit_type === "Siege") {
              newWarband["points"] =
                newWarband["points"] - newUnit["pointsTotal"];
              newRoster["points"] =
                newRoster["points"] - newUnit["pointsTotal"];
            } else {
              newWarband["points"] =
                newWarband["points"] - newUnit["pointsTotal"];
              newWarband["num_units"] =
                newWarband["num_units"] -
                (unitData.siege_crew ? unitData.siege_crew : 1) *
                  newUnit["quantity"];
              newWarband["bow_count"] =
                newWarband["bow_count"] -
                (newUnit["inc_bow_count"] ? 1 : 0) * newUnit["quantity"];
              newRoster["num_units"] =
                newRoster["num_units"] -
                (unitData.siege_crew ? unitData.siege_crew : 1) *
                  newUnit["quantity"];
              newRoster["points"] =
                newRoster["points"] - newUnit["pointsTotal"];
              newRoster["bow_count"] =
                newRoster["bow_count"] -
                (newUnit["inc_bow_count"] ? 1 : 0) * newUnit["quantity"];
            }
          }
          return newUnit;
        });
        newUnits = newUnits.filter((data) => data.id !== unitData.id);
        newWarband.units = newUnits;
      }
      return newWarband;
    });
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
      newRoster.warbands[warbandNum - 1]["num_units"] +
      (unitData.siege_crew ? unitData.siege_crew : 1) * newUnit["quantity"];
    newRoster.warbands[warbandNum - 1]["points"] =
      newRoster.warbands[warbandNum - 1]["points"] + newUnit["pointsTotal"];
    newRoster.warbands[warbandNum - 1]["bow_count"] =
      newRoster.warbands[warbandNum - 1]["bow_count"] +
      (newUnit["inc_bow_count"] ? 1 : 0) * newUnit["quantity"];
    newRoster["num_units"] =
      newRoster["num_units"] +
      (unitData.siege_crew ? unitData.siege_crew : 1) * newUnit["quantity"];
    newRoster["points"] = newRoster["points"] + newUnit["pointsTotal"];
    newRoster["bow_count"] =
      newRoster["bow_count"] +
      (newUnit["inc_bow_count"] ? 1 : 0) * newUnit["quantity"];

    setRoster(newRoster);
  };

  const handleCardClick = (e) => {
    // Update the state variables so that the correct profile card is loaded, and the pop-up modal is displayed.
    e.stopPropagation();
    setCurrentModal(ModalTypes.PROFILE_CARD, {
      unitData,
      title: `(${unitData.faction}) ${unitData.name}`,
    });
  };

  return (
    <Card style={{ width: "820px" }} className="p-2 pb-3 m-1" bg="light">
      <Stack direction="horizontal" gap={3} style={{ alignItems: "start" }}>
        <UnitProfilePicture
          className="mt-1 mb-1"
          style={{
            width: unitData.unit_type === "Siege" ? "75px" : "100px",
            height: unitData.unit_type === "Siege" ? "75px" : "100px",
          }}
          army={unitData.profile_origin}
          profile={unitData.name}
        />
        <Stack gap={2}>
          <Stack direction="horizontal" style={{ minHeight: "26px" }} gap={3}>
            <p className="m-0">
              <b>{unitData.name}</b>
            </p>
            <p className="m-0 ms-auto" style={{ paddingRight: "10px" }}>
              Points: <b>{unitData.pointsTotal}</b>
              {unitData.unit_type === "Warrior" &&
                " (per unit: " + unitData.pointsPerUnit + ")"}
            </p>
          </Stack>
          {unitData.unit_type !== "Warrior" &&
            unitData.unit_type !== "Siege" && (
              <Stack
                direction="horizontal"
                style={{ minHeight: "28px" }}
                gap={1}
              >
                <Badge bg="dark">{unitData.unit_type}</Badge>
                {unitData.MWFW && unitData.MWFW.length > 0 && (
                  <>
                    <br />
                    <div style={{ marginBottom: "4px" }}>
                      <span className="m-0 mwf-name border border-secondary">
                        M W F
                      </span>
                      <span className="m-0 mwf-value border border-secondary">
                        {unitData.MWFW[0][1].split(":")[0]}{" "}
                        <span className="m-0" style={{ color: "lightgrey" }}>
                          /
                        </span>{" "}
                        {unitData.MWFW[0][1].split(":")[1]}{" "}
                        <span className="m-0" style={{ color: "lightgrey" }}>
                          /
                        </span>{" "}
                        {unitData.MWFW[0][1].split(":")[2]}
                      </span>
                    </div>
                  </>
                )}
              </Stack>
            )}
          <Stack direction="horizontal" gap={3}>
            {unitData.options[0].option !== "None" && (
              <Form>
                {unitData.options.map((option) => (
                  <OptionWarrior
                    key={uuid()}
                    warbandNum={warbandNum}
                    unit={unitData}
                    option={option}
                    specialArmyOptions={specialArmyOptions}
                  />
                ))}
              </Form>
            )}
            <Stack direction="horizontal" gap={3} className="ms-auto mt-auto">
              {unitData.unit_type !== "Siege" && (
                <Button
                  className="border"
                  variant="secondary"
                  onClick={handleCardClick}
                >
                  <BsFillPersonVcardFill />
                </Button>
              )}

              {(unitData.unit_type === "Warrior" ||
                unitData.unit_type === "Siege") && (
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
                  {unitData.unit_type === "Warrior" && (
                    <Button onClick={handleDuplicate} variant="info">
                      <HiDuplicate />
                    </Button>
                  )}
                </>
              )}
              <Button
                style={{ marginRight: "10px" }}
                variant="warning"
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
