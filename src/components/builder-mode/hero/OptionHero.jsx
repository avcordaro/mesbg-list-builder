import Button from "react-bootstrap/Button";
import Form from "react-bootstrap/Form";
import Stack from "react-bootstrap/Stack";
import { FaMinus, FaPlus } from "react-icons/fa";
import { useStore } from "../../../state/store";

/* Option Hero is the component used to display an individual gear options that each hero 
has available.

The core difference between Option Hero and Option Warrior components is
that some hero options can be more than just a simple toggle (e.g. amount of Will points 
you'd like for the Witch King). */

export function OptionHero({ warbandId, unit, option }) {
  const { roster, setRoster, updateHero } = useStore();

  const warbandNum = roster?.warbands.find(({ id }) => id === warbandId)?.num;

  const MWF_MAP = { Might: 0, Will: 1, Fate: 2 };

  const handleToggle = (e) => {
    e.preventDefault();
    /* Update the roster state variable whenever the specific option is toggled on or off, 
    including any changes to points and bow count. */
    let newRoster = { ...roster };
    let engCptFlag = false;
    if (option.opt_quantity === 1) {
      newRoster.warbands = newRoster.warbands.map((warband) => {
        let newWarband = { ...warband };
        if (newWarband.num === warbandNum) {
          let newHero = { ...newWarband.hero };
          let newOptions = newHero.options.map((_option) => {
            let newOption = { ..._option };
            if (newOption.option_id === option.option_id) {
              newRoster["points"] =
                newRoster["points"] - newHero["pointsTotal"];
              newWarband["points"] =
                newWarband["points"] - newHero["pointsTotal"];
              newHero["pointsPerUnit"] =
                newHero["pointsPerUnit"] - option.points;
              newHero["pointsTotal"] = newHero["pointsPerUnit"];
              newWarband["points"] =
                newWarband["points"] + newHero["pointsTotal"];
              newRoster["points"] =
                newRoster["points"] + newHero["pointsTotal"];
              newOption["opt_quantity"] = 0;
              if (newOption.type === "treebeard_m&p") {
                newRoster["num_units"] = newRoster["num_units"] - 2;
                newWarband["num_units"] = newWarband["num_units"] - 2;
              }
              if (newOption.type === "engineer_cpt") {
                newWarband["max_units"] = 6;
                newHero["MWFW"] = [
                  [
                    newHero["MWFW"][0][0].replace(
                      "Engineer Captain",
                      "Siege Veteran",
                    ),
                    "1:1:1:1",
                  ],
                ];
                engCptFlag = true;
              }
              if (newOption.type === "mahud_chief") {
                newHero["MWFW"] = [
                  ["War Mumak of Harad - Haradrim Commander", "2:1:1:2"],
                  ["War Mumak of Harad", "0:0:0:10"],
                ];
              }
            }
            if (newOption.type === "add_crew" && engCptFlag) {
              newOption["max"] = newOption["max"] - 6;
              if (newOption["opt_quantity"] > newOption["max"]) {
                newRoster["num_units"] =
                  newRoster["num_units"] - newOption["opt_quantity"];
                newWarband["num_units"] =
                  newWarband["num_units"] - newOption["opt_quantity"];
                newRoster["points"] =
                  newRoster["points"] - newHero["pointsTotal"];
                newWarband["points"] =
                  newWarband["points"] - newHero["pointsTotal"];
                newHero["pointsPerUnit"] =
                  newHero["pointsPerUnit"] -
                  newOption["points"] * newOption["opt_quantity"];
                newOption["opt_quantity"] = Math.min(
                  newOption["opt_quantity"],
                  newOption["max"],
                );
                newHero["pointsPerUnit"] =
                  newHero["pointsPerUnit"] +
                  newOption["points"] * newOption["opt_quantity"];
                newRoster["num_units"] =
                  newRoster["num_units"] + newOption["opt_quantity"];
                newWarband["num_units"] =
                  newWarband["num_units"] + newOption["opt_quantity"];
                newHero["pointsTotal"] = newHero["pointsPerUnit"];
                newWarband["points"] =
                  newWarband["points"] + newHero["pointsTotal"];
                newRoster["points"] =
                  newRoster["points"] + newHero["pointsTotal"];
              }
            }
            if (
              newOption.option.includes("Engineer Captain - ") &&
              engCptFlag
            ) {
              newOption["max"] = 0;
              if (newOption["opt_quantity"] > 0) {
                newRoster["points"] =
                  newRoster["points"] - newHero["pointsTotal"];
                newWarband["points"] =
                  newWarband["points"] - newHero["pointsTotal"];
                newHero["pointsPerUnit"] =
                  newHero["pointsPerUnit"] - newOption["points"];
                newHero["pointsTotal"] = newHero["pointsPerUnit"];
                newWarband["points"] =
                  newWarband["points"] + newHero["pointsTotal"];
                newRoster["points"] =
                  newRoster["points"] + newHero["pointsTotal"];
                newOption["opt_quantity"] = 0;
              }
            }
            return newOption;
          });
          if (
            unit.model_id === "[azog's_legion] azog" &&
            option.option === "Signal Tower"
          ) {
            newHero.warband_size = 18;
            newWarband.max_units = 18;
          }
          if (
            unit.model_id.includes("] azog") &&
            option.option === "The White Warg"
          ) {
            newHero.MWFW = [[0, "3:3:1:3"]];
          }
          newHero.options = newOptions;
          newWarband.hero = newHero;
        }
        return newWarband;
      });
    } else {
      newRoster.warbands = newRoster.warbands.map((warband) => {
        let newWarband = { ...warband };
        if (newWarband.num === warbandNum) {
          let newHero = { ...newWarband.hero };
          let newOptions = newHero.options.map((_option) => {
            let newOption = { ..._option };
            if (newOption.option_id === option.option_id) {
              newRoster["points"] =
                newRoster["points"] - newHero["pointsTotal"];
              newWarband["points"] =
                newWarband["points"] - newHero["pointsTotal"];
              newHero["pointsPerUnit"] =
                newHero["pointsPerUnit"] + option.points;
              newHero["pointsTotal"] =
                newHero["pointsPerUnit"] * newHero["quantity"];
              newWarband["points"] =
                newWarband["points"] + newHero["pointsTotal"];
              newRoster["points"] =
                newRoster["points"] + newHero["pointsTotal"];
              newOption["opt_quantity"] = 1;
              if (newOption.type === "treebeard_m&p") {
                newRoster["num_units"] = newRoster["num_units"] + 2;
                newWarband["num_units"] = newWarband["num_units"] + 2;
              }
              if (newOption.type === "engineer_cpt") {
                newWarband["max_units"] = 12;
                newHero["MWFW"] = [
                  [
                    newHero["MWFW"][0][0].replace(
                      "Siege Veteran",
                      "Engineer Captain",
                    ),
                    "2:1:1:2",
                  ],
                ];
                engCptFlag = true;
              }
              if (newOption.type === "mahud_chief") {
                newHero["MWFW"] = [
                  [
                    "War Mumak of Harad - Mahud Beastmaster Chieftain",
                    "3:2:2:2",
                  ],
                  ["War Mumak of Harad", "0:0:0:10"],
                ];
              }
            }
            if (newOption.type === "add_crew" && engCptFlag) {
              newOption["max"] = newOption["max"] + 6;
            }
            if (
              newOption.option.includes("Engineer Captain - ") &&
              engCptFlag
            ) {
              newOption["max"] = 1;
            }
            return newOption;
          });
          if (
            unit.model_id === "[azog's_legion] azog" &&
            option.option === "Signal Tower"
          ) {
            newHero.warband_size = 24;
            newWarband.max_units = 24;
          }
          if (
            unit.model_id.includes("] azog") &&
            option.option === "The White Warg"
          ) {
            newHero.MWFW = [
              ["Azog", "3:3:1:3"],
              ["The White Warg", "3:1:1:2"],
            ];
          }
          newHero.options = newOptions;
          newWarband.hero = newHero;
        }
        return newWarband;
      });
      if (option.type != null) {
        newRoster = toggleOffSameTypes(newRoster);
      }
    }
    setRoster(newRoster);
  };

  const toggleOffSameTypes = (newRoster) => {
    /* Some options should not be selected simultaneously due to being the same type, e.g. Horse and Armoured Horse
    This function will toggle off any options of the same type as the option just selected. */
    newRoster.warbands = newRoster.warbands.map((warband) => {
      let newWarband = { ...warband };
      if (newWarband.num === warbandNum) {
        let newHero = { ...newWarband.hero };
        newHero.options = newHero.options.map((_option) => {
          let newOption = { ..._option };
          if (
            newOption.opt_quantity === 1 &&
            newOption.option_id !== option.option_id &&
            newOption.type === option.type
          ) {
            newRoster["points"] = newRoster["points"] - newHero["pointsTotal"];
            newWarband["points"] =
              newWarband["points"] - newHero["pointsTotal"];
            newHero["pointsPerUnit"] =
              newHero["pointsPerUnit"] - newOption.points;
            newHero["pointsTotal"] = newHero["pointsPerUnit"];
            newWarband["points"] =
              newWarband["points"] + newHero["pointsTotal"];
            newRoster["points"] = newRoster["points"] + newHero["pointsTotal"];
            newOption["opt_quantity"] = 0;
          }
          return newOption;
        });
        newWarband.hero = newHero;
      }
      return newWarband;
    });
    return newRoster;
  };

  const handleQuantity = (newQuantity) => {
    /* Handles updates for options that require a quantity, rather than a toggle. This includes
    updating any changes to points and bow count when the quantity is changed.*/
    if (newQuantity > option.max || newQuantity < option.min) {
      return null;
    }
    let newRoster = { ...roster };
    newRoster.warbands = newRoster.warbands.map((warband) => {
      let newWarband = { ...warband };
      if (newWarband.num === warbandNum) {
        let newHero = { ...newWarband.hero };
        newHero.options = newHero.options.map((_option) => {
          let newOption = { ..._option };
          if (newOption.option_id === option.option_id) {
            newRoster["points"] = newRoster["points"] - newHero["pointsTotal"];
            newWarband["points"] =
              newWarband["points"] - newHero["pointsTotal"];
            newHero["pointsPerUnit"] =
              newHero["pointsPerUnit"] - option.points * option.opt_quantity;
            newHero["pointsPerUnit"] =
              newHero["pointsPerUnit"] + option.points * newQuantity;
            newHero["pointsTotal"] = newHero["pointsPerUnit"];
            newWarband["points"] =
              newWarband["points"] + newHero["pointsTotal"];
            newRoster["points"] = newRoster["points"] + newHero["pointsTotal"];
            newOption["opt_quantity"] = newQuantity;
            if (["Might", "Will", "Fate"].includes(option.option)) {
              let mwfw = newHero["MWFW"][0][1].split(":");
              mwfw[MWF_MAP[option.option]] = String(newQuantity);
              newHero["MWFW"] = [["", mwfw.join(":")]];
            }
            // Siege engine additional crew must also increase unit counts.
            if (option.option === "Additional Crew") {
              newRoster["num_units"] =
                newRoster["num_units"] - option.opt_quantity;
              newRoster["num_units"] = newRoster["num_units"] + newQuantity;
              newWarband["num_units"] =
                newWarband["num_units"] - option.opt_quantity;
              newWarband["num_units"] = newWarband["num_units"] + newQuantity;
            }
          }
          return newOption;
        });
        newWarband.hero = newHero;
      }
      return newWarband;
    });
    setRoster(newRoster);
  };

  return (
    <>
      {option.max > 1 ? (
        <Stack className="mt-1 mb-1" direction="horizontal" gap={2}>
          <Button
            disabled={option.opt_quantity === option.min}
            variant="outline-secondary"
            className="p-0 quantity-buttons"
            size="sm"
            onClick={() => handleQuantity(option.opt_quantity - 1)}
          >
            <FaMinus />
          </Button>
          <b style={{ width: "20px", textAlign: "center" }}>
            {option.opt_quantity}
          </b>
          <Button
            disabled={option.opt_quantity === option.max}
            variant="outline-secondary"
            className="p-0 quantity-buttons"
            size="sm"
            onClick={() => handleQuantity(option.opt_quantity + 1)}
          >
            <FaPlus />
          </Button>
          {option.option + " (" + option.points + " points)"}
        </Stack>
      ) : (
        <Form.Check
          type="switch"
          id={"switch-" + unit.id + "-" + option.option.replaceAll(" ", "-")}
          label={option.option + " (" + option.points + " points)"}
          checked={option.opt_quantity === 1}
          disabled={option.min === option.max}
          onChange={handleToggle}
        />
      )}
    </>
  );
}
