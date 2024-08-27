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
import { useStore } from "../../../state/store";
import { UnitProfilePicture } from "../../images/UnitProfilePicture.tsx";
import { ModalTypes } from "../../modal/modals";
import { OptionWarrior } from "./OptionWarrior.jsx";

/* Warband Warrior components display an individual warrior unit in a warband. */

export function WarbandWarrior({ warbandNum, unitData, specialArmyOptions }) {
  const {
    roster,
    setRoster,
    setCurrentModal,
    updateUnit,
    deleteUnit,
    duplicateUnit,
  } = useStore();

  const handleIncrement = () => {
    updateUnit(roster.warbands[warbandNum - 1].id, unitData.id, {
      quantity: unitData.quantity + 1,
    });
  };

  const handleDecrement = () => {
    const quantity = unitData.quantity - 1;
    updateUnit(roster.warbands[warbandNum - 1].id, unitData.id, {
      quantity: quantity > 1 ? quantity : 1, // if value goes below 1, clamp the value to 1.
    });
  };

  const handleDelete = () => {
    deleteUnit(roster.warbands[warbandNum - 1].id, unitData.id);
  };

  const handleDuplicate = () => {
    duplicateUnit(roster.warbands[warbandNum - 1].id, unitData.id);
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
                    <Button
                      onClick={handleDecrement}
                      disabled={unitData.quantity === 1}
                    >
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
