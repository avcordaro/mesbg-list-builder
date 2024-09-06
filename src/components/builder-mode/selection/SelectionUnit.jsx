import Badge from "react-bootstrap/Badge";
import Button from "react-bootstrap/Button";
import Stack from "react-bootstrap/Stack";
import { BsFillPersonVcardFill } from "react-icons/bs";
import { v4 as uuid } from "uuid";
import hero_constraint_data from "../../../assets/data/hero_constraint_data.json";
import { useStore } from "../../../state/store";
import { handleRivendellElrond } from "../../../utils/specialRules.js";
import { UnitProfilePicture } from "../../common/images/UnitProfilePicture";
import { ModalTypes } from "../../modal/modals";

/* The Selection Unit is the component used to display an individual unit in the unit selection list,
which appears on the left hand side of the screen. */

export function SelectionUnit({
  newWarriorFocus,
  setDisplaySelection,
  heroSelection,
  unitData,
  warbandNumFocus,
  specialArmyOptions,
  setSpecialArmyOptions,
}) {
  const { roster, setRoster, setCurrentModal, selectUnit } = useStore();

  const deleteInvalidUnit = (newRoster, unit_id) => {
    /* If a new hero is selected and warrior units already exist in this warband belonging to a different faction,
        they must be deleted and their points, bow count etc. removed from the roster. Similarly, if a Siege
        Engine is selected as the new hero of this warband, all units must be removed in the same way.*/
    newRoster.warbands = newRoster.warbands.map((warband) => {
      let newWarband = { ...warband };
      if (newWarband.num === warbandNumFocus + 1) {
        let newUnits = newWarband.units.map((_unit) => {
          let newUnit = { ..._unit };
          if (newUnit.id === unit_id) {
            newWarband["points"] =
              newWarband["points"] - newUnit["pointsTotal"];
            newWarband["num_units"] =
              newWarband["num_units"] -
              (newUnit.siege_crew ? newUnit.siege_crew : 1) *
                newUnit["quantity"];
            newWarband["bow_count"] =
              newWarband["bow_count"] -
              (newUnit["inc_bow_count"] ? 1 : 0) * newUnit["quantity"];
            newRoster["num_units"] =
              newRoster["num_units"] -
              (newUnit.siege_crew ? newUnit.siege_crew : 1) *
                newUnit["quantity"];
            newRoster["points"] = newRoster["points"] - newUnit["pointsTotal"];
            newRoster["bow_count"] =
              newRoster["bow_count"] -
              (newUnit["inc_bow_count"] ? 1 : 0) * newUnit["quantity"];
          }
          return newUnit;
        });
        newUnits = newUnits.filter((data) => data.id !== unit_id);
        newWarband.units = newUnits;
      }
      return newWarband;
    });
    return newRoster;
  };

  const handleClick = () => {
    if (!heroSelection) {
      const warbandId = roster.warbands[warbandNumFocus].id;
      selectUnit(warbandId, newWarriorFocus, unitData);
      setDisplaySelection(false);
      return;
    }

    /* Handles the selection of a unit, which differs depending on whether the unit is a hero or a warrior.
        In both situations, the points, unit and bow counts are updated. */
    let newRoster = { ...roster };
    let newUnitData = { ...unitData };
    newUnitData["id"] = uuid();
    if (heroSelection) {
      // If a hero unit is selected, it is set as the warband's hero leader. The max warband size is also updated.
      newRoster.warbands[warbandNumFocus].hero = newUnitData;
      newRoster.warbands[warbandNumFocus].points =
        newRoster.warbands[warbandNumFocus].points + newUnitData.base_points;
      newRoster.warbands[warbandNumFocus].max_units = newUnitData.warband_size;
      if (newRoster.warbands[warbandNumFocus].hero.siege_crew > 0) {
        if (
          unitData.model_id.includes("_mumak_") ||
          unitData.model_id.includes("great_beast_")
        ) {
          newRoster.warbands[warbandNumFocus].num_units =
            newRoster.warbands[warbandNumFocus].num_units +
            (newUnitData.siege_crew - 2);
        } else {
          newRoster.warbands[warbandNumFocus].num_units =
            newRoster.warbands[warbandNumFocus].num_units +
            (newUnitData.siege_crew - 1);
        }
        newRoster.num_units = newRoster.num_units + newUnitData.siege_crew;
      } else {
        newRoster.num_units = newRoster.num_units + 1;
      }

      // Specific logic for when Elrond is chosen to modify bow count with Rivendell Knights
      if (newUnitData.model_id === "[rivendell] elrond") {
        newRoster = handleRivendellElrond(newRoster, false);
      }

      // Update state variable if the new model provides special army-wide option to be enabled
      if (
        newUnitData.unit_type !== "Siege Engine" &&
        hero_constraint_data[newUnitData.model_id][0]["special_army_option"] !==
          ""
      ) {
        let newSpecialArmyOptions = [...specialArmyOptions];
        newSpecialArmyOptions.push(
          hero_constraint_data[newUnitData.model_id][0]["special_army_option"],
        );
        setSpecialArmyOptions(newSpecialArmyOptions);
      }

      // Delete any warrior units in this warband not from the same faction as the hero, or if a Siege Engine is selected.
      newRoster.warbands[warbandNumFocus].units.map((unit) => {
        if (
          newUnitData.unit_type === "Siege Engine" ||
          unit.faction !== newUnitData.faction
        ) {
          newRoster = deleteInvalidUnit(newRoster, unit.id);
        }
        return null;
      });
    } else {
      // If a warrior unit is selected, it is appended to the warband's list of units.
      newRoster.warbands[warbandNumFocus].units = newRoster.warbands[
        warbandNumFocus
      ].units.filter((data) => data.id !== newWarriorFocus);
      newRoster.warbands[warbandNumFocus].units.push(newUnitData);
      newRoster.warbands[warbandNumFocus].points =
        newRoster.warbands[warbandNumFocus].points + newUnitData.base_points;
      newRoster.warbands[warbandNumFocus].num_units =
        newRoster.warbands[warbandNumFocus].num_units +
        (newUnitData.siege_crew ? newUnitData.siege_crew : 1);
      newRoster.warbands[warbandNumFocus].bow_count =
        newRoster.warbands[warbandNumFocus].bow_count +
        (newUnitData.inc_bow_count ? 1 : 0);
      newRoster.num_units =
        newRoster.num_units +
        (newUnitData.siege_crew ? newUnitData.siege_crew : 1);
    }
    newRoster.points = newRoster.points + newUnitData.base_points;
    newRoster.bow_count =
      newRoster.bow_count + (newUnitData.inc_bow_count ? 1 : 0);
    setRoster(newRoster);
    setDisplaySelection(false);
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
    <Button
      variant="light"
      style={{ width: "461px", textAlign: "left" }}
      onClick={handleClick}
      className="border shadow-sm"
    >
      <Stack direction="horizontal" gap={3}>
        <UnitProfilePicture
          army={unitData.profile_origin}
          profile={unitData.name}
          className="profile"
        />
        <div>
          <b>{unitData.name}</b>
          <br />
          Points: {unitData.base_points}
          {unitData.MWFW && unitData.MWFW.length > 0 ? (
            <>
              <br />
              <div className="mt-1">
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
          ) : (
            <div></div>
          )}
          {unitData.unit_type !== "Warrior" && (
            <Badge className="mt-2" bg="dark">
              {unitData.unit_type}
            </Badge>
          )}
        </div>
        <Button
          className="ms-auto me-2 border"
          variant="secondary"
          onClick={handleCardClick}
        >
          <BsFillPersonVcardFill />
        </Button>
      </Stack>
    </Button>
  );
}
