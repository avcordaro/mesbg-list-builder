import Card from "react-bootstrap/Card";
import Stack from "react-bootstrap/Stack";
import Button from "react-bootstrap/Button";
import Badge from "react-bootstrap/Badge";
import Form from "react-bootstrap/Form";
import { OptionHero } from "./OptionHero";
import { ImCross } from "react-icons/im";
import { BsFillPersonVcardFill } from "react-icons/bs";
import { GiQueenCrown } from "react-icons/gi";
import { v4 as uuid } from "uuid";
import hero_constraint_data from "../assets/data/hero_constraint_data.json";
import {
  handleRivendellElrond,
  handleSpecialArmyOption,
  handleSpecialWarbandOption,
} from "./specialRules.js";
import { UnitProfilePicture } from "./UnitProfilePicture.tsx";
import { useStore } from "../state/store";
import { MODAL_KEYS } from "./modal/modals";

/* Warband Hero components display the hero in each warband. */

export function WarbandHero({
  warbandNum,
  unitData,
  setCardUnitData,
  specialArmyOptions,
  setSpecialArmyOptions,
}) {
  const { roster, setRoster, setCurrentModal } = useStore();

  const handleDelete = () => {
    // Removes the hero from being the warband's leader, and updates points and unit counts.
    let newRoster = { ...roster };
    // Specific logic for when Elrond is removed to modify bow count with Rivendell Knights
    if (unitData.model_id === "[rivendell] elrond") {
      newRoster = handleRivendellElrond(newRoster, true);
    }
    // Update state variable if the deleted model provided a special army-wide option
    if (
      hero_constraint_data[unitData.model_id] &&
      hero_constraint_data[unitData.model_id][0]["special_army_option"] !== ""
    ) {
      let newSpecialArmyOptions = specialArmyOptions.filter(
        (data) =>
          data !==
          hero_constraint_data[unitData.model_id][0]["special_army_option"],
      );
      newRoster = handleSpecialArmyOption(newRoster, warbandNum);
      setSpecialArmyOptions(newSpecialArmyOptions);
    }
    newRoster.warbands = newRoster.warbands.map((warband) => {
      let newWarband = { ...warband };
      if (newWarband.num === warbandNum) {
        newWarband["points"] =
          newWarband["points"] - newWarband.hero["pointsTotal"];
        // Bit of awkward logic here for siege engines where the whole siege crew needs to be removed from unit count.
        if (newWarband.hero.siege_crew > 0) {
          if (
            unitData.model_id.includes("_mumak_") ||
            unitData.model_id.includes("great_beast_")
          ) {
            newWarband.num_units =
              newWarband.num_units - (newWarband.hero.siege_crew - 2);
          } else {
            newWarband.num_units =
              newWarband.num_units - (newWarband.hero.siege_crew - 1);
          }
          newRoster["num_units"] =
            newRoster["num_units"] - newWarband.hero.siege_crew;
        } else {
          newRoster["num_units"] = newRoster["num_units"] - 1;
        }
        if (newWarband.hero.unit_type === "Siege Engine") {
          newWarband.hero.options.map((option) => {
            if (option.option === "Additional Crew") {
              newWarband.num_units = newWarband.num_units - option.opt_quantity;
              newRoster["num_units"] =
                newRoster["num_units"] - option.opt_quantity;
            }
            return null;
          });
        }
        newWarband["max_units"] = "-";
        newRoster["points"] =
          newRoster["points"] - newWarband.hero["pointsTotal"];
        newWarband.hero = null;
        newWarband.units = newWarband.units.filter(
          (_unit) => _unit.name != null,
        );
      }
      return newWarband;
    });
    if (newRoster["leader_warband_num"] === warbandNum) {
      newRoster["leader_warband_num"] = null;
    }
    newRoster = handleSpecialWarbandOption(newRoster, warbandNum);
    setRoster(newRoster);
  };

  const handleCardClick = (e) => {
    // Update the state variables so that the correct profile card is loaded, and the pop-up modal is displayed.
    e.stopPropagation();
    setCardUnitData(unitData);
    setCurrentModal(MODAL_KEYS.PROFILE_CARD, {
      unitData,
      title: `(${unitData.faction}) ${unitData.name}`,
    });
  };

  const handleLeader = () => {
    let newRoster = { ...roster };
    if (newRoster["leader_warband_num"] === warbandNum) {
      newRoster["leader_warband_num"] = null;
    } else {
      newRoster["leader_warband_num"] = warbandNum;
    }
    setRoster(newRoster);
  };

  return (
    <Card style={{ width: "820px" }} className="p-2 pb-3 m-1" bg={"light"}>
      <Stack direction="horizontal" gap={3} style={{ alignItems: "start" }}>
        <UnitProfilePicture
          army={unitData.profile_origin}
          profile={unitData.name}
          className="profile mt-1 mb-1"
        />
        <Stack gap={2}>
          <Stack direction="horizontal" style={{ minHeight: "26px" }} gap={3}>
            <p className="m-0">
              <b>{unitData.name}</b>
            </p>
            {[
              "Hero of Legend",
              "Hero of Valour",
              "Hero of Fortitude",
              "Minor Hero",
            ].includes(unitData.unit_type) && (
              <Stack className="ms-auto" direction="horizontal">
                {roster["leader_warband_num"] === warbandNum ? (
                  <h5 className="m-0 me-2 text-success">
                    <GiQueenCrown />
                  </h5>
                ) : (
                  <h5 className="m-0 me-2" style={{ color: "lightgrey" }}>
                    <GiQueenCrown />
                  </h5>
                )}
                <Form.Check
                  reverse
                  className={
                    roster["leader_warband_num"] === warbandNum
                      ? "text-success"
                      : ""
                  }
                  type="switch"
                  id={"switch-" + unitData.id + "-leader"}
                  label="Leader"
                  name="leader"
                  checked={roster["leader_warband_num"] === warbandNum}
                  onChange={handleLeader}
                />
              </Stack>
            )}
            <p
              className={
                [
                  "Hero of Legend",
                  "Hero of Valour",
                  "Hero of Fortitude",
                  "Minor Hero",
                ].includes(unitData.unit_type)
                  ? "m-0 ms-2"
                  : "m-0 ms-auto"
              }
              style={{ paddingRight: "10px" }}
            >
              Points: <b>{unitData.pointsTotal}</b>
            </p>
          </Stack>
          <Stack direction="horizontal" style={{ minHeight: "28px" }} gap={1}>
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
          <Stack direction="horizontal" gap={3}>
            {unitData.options[0].option !== "None" && (
              <Form>
                {unitData.options.map((option) => (
                  <OptionHero
                    key={uuid()}
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
