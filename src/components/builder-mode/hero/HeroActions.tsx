import { FunctionComponent } from "react";
import Button from "react-bootstrap/Button";
import Stack from "react-bootstrap/Stack";
import { BsFillPersonVcardFill } from "react-icons/bs";
import { ImCross } from "react-icons/im";
import { useStore } from "../../../state/store.ts";
import { Unit } from "../../../types/unit.ts";
import {
  handleRivendellElrond,
  handleSpecialWarbandOption,
} from "../../../utils/specialRules";
import { ModalTypes } from "../../modal/modals.tsx";

type HeroActionsProps = {
  warbandId: string;
  unit: Unit;
};

export const HeroActions: FunctionComponent<HeroActionsProps> = ({
  unit: unitData,
  warbandId: warbandNum,
}) => {
  const { roster, setRoster, setCurrentModal } = useStore();

  const handleDelete = () => {
    // Removes the hero from being the warband's leader, and updates points and unit counts.
    let newRoster = { ...roster };
    // Specific logic for when Elrond is removed to modify bow count with Rivendell Knights
    if (unitData.model_id === "[rivendell] elrond") {
      newRoster = handleRivendellElrond(newRoster, true);
    }
    // Update state variable if the deleted model provided a special army-wide option
    // if (
    //   hero_constraint_data[unitData.model_id] &&
    //   hero_constraint_data[unitData.model_id][0]["special_army_option"] !== ""
    // ) {
    //   const newSpecialArmyOptions = specialArmyOptions.filter(
    //     (data) =>
    //       data !==
    //       hero_constraint_data[unitData.model_id][0]["special_army_option"],
    //   );
    //   newRoster = handleSpecialArmyOption(newRoster, warbandNum);
    //   // setSpecialArmyOptions(newSpecialArmyOptions);
    // }
    newRoster.warbands = newRoster.warbands.map((warband) => {
      const newWarband = { ...warband };
      if (newWarband.id === warbandNum) {
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
    setCurrentModal(ModalTypes.PROFILE_CARD, {
      unitData,
      title: `(${unitData.faction}) ${unitData.name}`,
    });
  };

  return (
    <Stack direction="horizontal" gap={3} className="ms-auto mt-auto">
      <Button
        style={{ marginBottom: "5px" }}
        className="border"
        variant="secondary"
        onClick={handleCardClick}
      >
        <BsFillPersonVcardFill />
      </Button>
      <Button
        style={{ marginRight: "10px", marginBottom: "5px" }}
        variant="warning"
        onClick={handleDelete}
      >
        <ImCross />
      </Button>
    </Stack>
  );
};
