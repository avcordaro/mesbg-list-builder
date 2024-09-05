import { Option, Unit } from "../../../types/unit.ts";
import { Roster } from "../../../types/roster.ts";

const roster: Roster = null;
const option: Option = null;
const unit: Unit = null;
const warbandNum = 0;

const handleToggle = (e) => {
  e.preventDefault();
  /* Update the roster state variable whenever the specific option is toggled on or off,
            including any changes to points and bow count. */
  let newRoster = { ...roster };
  let engCptFlag = false;
  if (option.opt_quantity === 1) {
    newRoster.warbands = newRoster.warbands.map((warband) => {
      if (warband.num !== warbandNum) {
        return warband;
      }
      const newWarband = { ...warband };
      const newHero = { ...newWarband.hero };
      const newOptions = newHero.options.map((_option) => {
        const newOption = { ..._option };
        if (newOption.option_id === option.option_id) {
          newRoster["points"] = newRoster["points"] - newHero["pointsTotal"];
          newWarband["points"] = newWarband["points"] - newHero["pointsTotal"];
          newHero["pointsPerUnit"] = newHero["pointsPerUnit"] - option.points;
          newHero["pointsTotal"] = newHero["pointsPerUnit"];
          newWarband["points"] = newWarband["points"] + newHero["pointsTotal"];
          newRoster["points"] = newRoster["points"] + newHero["pointsTotal"];
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
            newRoster["points"] = newRoster["points"] - newHero["pointsTotal"];
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
            newRoster["points"] = newRoster["points"] + newHero["pointsTotal"];
          }
        }
        if (newOption.option.includes("Engineer Captain - ") && engCptFlag) {
          newOption["max"] = 0;
          if (newOption["opt_quantity"] > 0) {
            newRoster["points"] = newRoster["points"] - newHero["pointsTotal"];
            newWarband["points"] =
              newWarband["points"] - newHero["pointsTotal"];
            newHero["pointsPerUnit"] =
              newHero["pointsPerUnit"] - newOption["points"];
            newHero["pointsTotal"] = newHero["pointsPerUnit"];
            newWarband["points"] =
              newWarband["points"] + newHero["pointsTotal"];
            newRoster["points"] = newRoster["points"] + newHero["pointsTotal"];
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
      return newWarband;
    });
  } else {
    newRoster.warbands = newRoster.warbands.map((warband) => {
      const newWarband = { ...warband };
      if (newWarband.num === warbandNum) {
        const newHero = { ...newWarband.hero };
        const newOptions = newHero.options.map((_option) => {
          const newOption = { ..._option };
          if (newOption.option_id === option.option_id) {
            newRoster["points"] = newRoster["points"] - newHero["pointsTotal"];
            newWarband["points"] =
              newWarband["points"] - newHero["pointsTotal"];
            newHero["pointsPerUnit"] = newHero["pointsPerUnit"] + option.points;
            newHero["pointsTotal"] =
              newHero["pointsPerUnit"] * newHero["quantity"];
            newWarband["points"] =
              newWarband["points"] + newHero["pointsTotal"];
            newRoster["points"] = newRoster["points"] + newHero["pointsTotal"];
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
                ["War Mumak of Harad - Mahud Beastmaster Chieftain", "3:2:2:2"],
                ["War Mumak of Harad", "0:0:0:10"],
              ];
            }
          }
          if (newOption.type === "add_crew" && engCptFlag) {
            newOption["max"] = newOption["max"] + 6;
          }
          if (newOption.option.includes("Engineer Captain - ") && engCptFlag) {
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
  // setRoster(newRoster);
};

const toggleOffSameTypes = (newRoster) => {
  /* Some options should not be selected simultaneously due to being the same type, e.g. Horse and Armoured Horse
            This function will toggle off any options of the same type as the option just selected. */
  newRoster.warbands = newRoster.warbands.map((warband) => {
    const newWarband = { ...warband };
    if (newWarband.num === warbandNum) {
      const newHero = { ...newWarband.hero };
      newHero.options = newHero.options.map((_option) => {
        const newOption = { ..._option };
        if (
          newOption.opt_quantity === 1 &&
          newOption.option_id !== option.option_id &&
          newOption.type === option.type
        ) {
          newRoster["points"] = newRoster["points"] - newHero["pointsTotal"];
          newWarband["points"] = newWarband["points"] - newHero["pointsTotal"];
          newHero["pointsPerUnit"] =
            newHero["pointsPerUnit"] - newOption.points;
          newHero["pointsTotal"] = newHero["pointsPerUnit"];
          newWarband["points"] = newWarband["points"] + newHero["pointsTotal"];
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
