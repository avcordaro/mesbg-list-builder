import Stack from "react-bootstrap/Stack";
import Button from "react-bootstrap/Button";
import Badge from "react-bootstrap/Badge";
import { BsFillPersonVcardFill } from "react-icons/bs";
import { v4 as uuid } from "uuid";

/* The Selection Unit is the component used to display an individual unit in the unit selection list,
which appears on the left hand side of the screen. */

export function SelectionUnit({
  newWarriorFocus,
  setDisplaySelection,
  heroSelection,
  unitData,
  roster,
  setRoster,
  uniqueModels,
  warbandNumFocus,
  setShowCardModal,
  setCardUnitData,
}) {

  const deleteInvalidUnit = (newRoster, unit_id) => {
    /* If a new hero is selected and warrior units already exist in this warband belonging to the warband, 
    they must be deleted and their points, bow count etc. removed from the roster.*/
    let newWarbands = newRoster.warbands.map((warband) => {
      let newWarband = { ...warband };
      if (newWarband.num == warbandNumFocus + 1) {
        let newUnits = newWarband.units.map((_unit) => {
          let newUnit = { ..._unit };
          if (newUnit.id == unit_id) {
            newWarband["points"] =
              newWarband["points"] - newUnit["pointsTotal"];
            newWarband["num_units"] =
              newWarband["num_units"] - newUnit["quantity"];
            newWarband["bow_count"] =
              newWarband["bow_count"] -
              (newUnit["inc_bow_count"] ? 1 : 0) * newUnit["quantity"];
            newRoster["num_units"] =
              newRoster["num_units"] - ((newUnit.siege_crew ? newUnit.siege_crew : 1) * newUnit["quantity"]);
            newRoster["points"] = newRoster["points"] - newUnit["pointsTotal"];
            newRoster["bow_count"] =
              newRoster["bow_count"] -
              (newUnit["inc_bow_count"] ? 1 : 0) * newUnit["quantity"];
          }
          return newUnit;
        });
        newUnits = newUnits.filter((data) => data.id != unit_id);
        newWarband.units = newUnits;
      }
      return newWarband;
    });
    newRoster.warbands = newWarbands;
    return newRoster
  };

  const handleClick = () => {
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
        newRoster.warbands[warbandNumFocus].num_units =
          newRoster.warbands[warbandNumFocus].num_units +
          (newUnitData.siege_crew - 1);
        newRoster.num_units = newRoster.num_units + newUnitData.siege_crew;
      } else {
        newRoster.num_units = newRoster.num_units + 1;
      }

      // Specific logic for when Elrond is chosen to modify bow count with Rivendell Knights
      if (newUnitData.model_id == '[rivendell] elrond') {
        newRoster = handleRivendellElrond(newRoster);
      }
      // Delete any warrior units in this warband not from the same faction as the hero.
      newRoster.warbands[warbandNumFocus].units.map((unit) => {
        if (unit.faction != newUnitData.faction) {
          newRoster = deleteInvalidUnit(newRoster, unit.id);
        }
      });
    } else {
      // Specific logic for when Elrond is chosen to modify bow count with Rivendell Knights
      if (newUnitData.model_id == '[rivendell] rivendell_knight' && uniqueModels.includes('[rivendell] elrond')) {
        newUnitData["inc_bow_count"] = false;
        newUnitData["bow_limit"] = false;
      }
      // If a warrior unit is selected, it is appended to the warband's list of units.
      newRoster.warbands[warbandNumFocus].units = newRoster.warbands[
        warbandNumFocus
      ].units.filter((data) => data.id != newWarriorFocus);
      newRoster.warbands[warbandNumFocus].units.push(newUnitData);
      newRoster.warbands[warbandNumFocus].points =
        newRoster.warbands[warbandNumFocus].points + newUnitData.base_points;
      newRoster.warbands[warbandNumFocus].num_units =
        newRoster.warbands[warbandNumFocus].num_units + (newUnitData.siege_crew ? newUnitData.siege_crew : 1);
      newRoster.warbands[warbandNumFocus].bow_count =
      newRoster.warbands[warbandNumFocus].bow_count + (newUnitData.inc_bow_count ? 1 : 0);
      newRoster.num_units = newRoster.num_units + (newUnitData.siege_crew ? newUnitData.siege_crew : 1);
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
    setCardUnitData(unitData);
    setShowCardModal(true);
  };

  const handleRivendellElrond = (newRoster) => {
    /* If Elrond is selected for Rivendell, all Rivendell Knights in the army no longer count towards the Bow Limit.*/
    let newWarbands = newRoster.warbands.map((warband) => {
      let newWarband = { ...warband };
      let newUnits = newWarband.units.map((_unit) => {
        let newUnit = { ..._unit };
        if (newUnit.model_id == '[rivendell] rivendell_knight') {
          newWarband["bow_count"] = newWarband["bow_count"] - (1 * newUnit["quantity"]);
          newRoster["bow_count"] = newRoster["bow_count"] - (1 * newUnit["quantity"]);
          newUnit["inc_bow_count"] = false;
          newUnit["bow_limit"] = false;
        }
        return newUnit;
      });
      newWarband.units = newUnits;
      return newWarband;
    });
    newRoster.warbands = newWarbands;
    return newRoster
  };

  return (
    <Button
      variant="light"
      style={{ width: "461px", textAlign: "left" }}
      onClick={handleClick}
    >
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