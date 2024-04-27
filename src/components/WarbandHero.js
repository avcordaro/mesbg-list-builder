import Card from "react-bootstrap/Card";
import Stack from "react-bootstrap/Stack";
import Button from "react-bootstrap/Button";
import Badge from "react-bootstrap/Badge";
import Form from "react-bootstrap/Form";
import {OptionHero} from "./OptionHero.js"
import {ImCross} from "react-icons/im";
import {BsFillPersonVcardFill} from "react-icons/bs";
import {GiQueenCrown} from "react-icons/gi";
import {v4 as uuid} from "uuid";
import hero_constraint_data from "../data/hero_constraint_data.json";
import {
  handleRivendellElrond,
  handleSpecialArmyOption,
  handleSpecialWarbandOption
} from "./specialRules";

/* Warband Hero components display the hero in each warband. */

export function WarbandHero({
                              warbandNum,
                              unitData,
                              roster,
                              setRoster,
                              setShowCardModal,
                              setCardUnitData,
                              specialArmyOptions,
                              setSpecialArmyOptions
                            }) {

  const handleDelete = () => {
    // Removes the hero from being the warband's leader, and updates points and unit counts.
    let newRoster = {...roster};
    // Specific logic for when Elrond is removed to modify bow count with Rivendell Knights
    if (unitData.model_id === '[rivendell] elrond') {
      newRoster = handleRivendellElrond(newRoster, true);
    }
    // Update state variable if the deleted model provided a special army-wide option 
    if (hero_constraint_data[unitData.model_id] && hero_constraint_data[unitData.model_id][0]['special_army_option'] !== "") {
      let newSpecialArmyOptions = specialArmyOptions.filter((data) => data !== hero_constraint_data[unitData.model_id][0]['special_army_option']);
      newRoster = handleSpecialArmyOption(newRoster, warbandNum);
      setSpecialArmyOptions(newSpecialArmyOptions);

    }
    newRoster.warbands = newRoster.warbands.map((warband) => {
      let newWarband = {...warband};
      if (newWarband.num === warbandNum) {
        newWarband["points"] = newWarband["points"] - newWarband.hero["pointsTotal"];
        // Bit of awkward logic here for siege engines where the whole siege crew needs to be removed from unit count.
        if (newWarband.hero.siege_crew > 0) {
          newWarband.num_units = newWarband.num_units - (newWarband.hero.siege_crew - 1);
          newRoster["num_units"] = newRoster["num_units"] - newWarband.hero.siege_crew;
        } else {
          newRoster["num_units"] = newRoster["num_units"] - 1;
        }
        if (newWarband.hero.unit_type === "Siege Engine") {
          newWarband.hero.options.map((option) => {
            if (option.option === "Additional Crew") {
              newWarband.num_units = newWarband.num_units - option.opt_quantity;
              newRoster["num_units"] = newRoster["num_units"] - option.opt_quantity;
            }
            return null
          });
        }
        newWarband["max_units"] = "-";
        newRoster["points"] = newRoster["points"] - newWarband.hero["pointsTotal"];
        newWarband.hero = null;
        newWarband.units = newWarband.units.filter(_unit => _unit.name != null)
      }
      return newWarband;
    });
    if (newRoster['leader_warband_num'] === warbandNum) {
      newRoster['leader_warband_num'] = null;
    }
    newRoster = handleSpecialWarbandOption(newRoster, warbandNum)
    setRoster(newRoster);
  };

  const handleCardClick = (e) => {
    // Update the state variables so that the correct profile card is loaded, and the pop-up modal is displayed.
    e.stopPropagation();
    setCardUnitData(unitData);
    setShowCardModal(true);
  };

  const handleLeader = () => {
    let newRoster = {...roster}
    if (newRoster['leader_warband_num'] === warbandNum) {
      newRoster['leader_warband_num'] = null
    } else {
      newRoster['leader_warband_num'] = warbandNum
    }
    setRoster(newRoster);
  }

  return (<Card style={{width: "820px"}} className="p-2 m-1" bg={"light"}>
    <Stack direction="horizontal" gap={3} style={{alignItems: "start"}}>
      <img
        className="profile mt-1 mb-1"
        src={(() => {
          try {
            return require("../images/" + unitData.profile_origin + "/pictures/" + unitData.name + ".png")
          } catch (e) {
            return require("../images/default.png")
          }
        })()}
        alt=""
      />
      <Stack>
        <Stack direction="horizontal" gap={3}>
          <p>
            <b>{unitData.name}</b>
          </p>
          <Badge style={{marginBottom: "12px"}} bg="dark">
            {unitData.unit_type}
          </Badge>
          {["Hero of Legend", "Hero of Valour", "Hero of Fortitude", "Minor Hero"].includes(unitData.unit_type) &&
            <Stack className="ms-auto" direction="horizontal">
              {roster['leader_warband_num'] === warbandNum ?
                <h5 className="me-2 mb-3 text-success"><GiQueenCrown/></h5> :
                <h5 className="me-2 mb-3" style={{color: "lightgrey"}}><GiQueenCrown/></h5>}
              <Form.Check
                reverse
                className={roster['leader_warband_num'] === warbandNum ? "mb-3 text-success" : "mb-3"}
                type="switch"
                label="Leader"
                name="leader"
                checked={roster["leader_warband_num"] === warbandNum}
                onChange={handleLeader}
              />
            </Stack>}
          <p
            className={["Hero of Legend", "Hero of Valour", "Hero of Fortitude", "Minor Hero"].includes(unitData.unit_type) ? "ms-2" : "ms-auto"}
            style={{paddingRight: "10px"}}>
            Points: <b>{unitData.pointsTotal}</b>
          </p>
        </Stack>
        <Stack direction="horizontal" gap={3}>
          {unitData.options[0].option !== "None" && (<Form>
            {unitData.options.map((option) => (<OptionHero
              key={uuid()}
              roster={roster}
              setRoster={setRoster}
              warbandNum={warbandNum}
              unit={unitData}
              option={option}
            />))}
          </Form>)}
          <Stack direction="horizontal" gap={3} className="ms-auto mt-auto">
            <Button
              style={{marginBottom: "5px"}}
              className="border"
              variant={"secondary"}
              onClick={handleCardClick}
            >
              <BsFillPersonVcardFill/>
            </Button>
            <Button
              style={{marginRight: "10px", marginBottom: "5px"}}
              variant={"warning"}
              onClick={handleDelete}
            >
              <ImCross/>
            </Button>
          </Stack>
        </Stack>
      </Stack>
    </Stack>
  </Card>);
}