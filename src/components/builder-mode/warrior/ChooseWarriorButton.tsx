import { FunctionComponent } from "react";
import Button from "react-bootstrap/Button";
import Stack from "react-bootstrap/Stack";
import { ImCross } from "react-icons/im";
import { useStore } from "../../../state/store";
import { FreshUnit } from "../../../types/unit.ts";

/* Default Warrior Unit components appear inside Warbands after 'Add Unit' is selected, 
before the user selects the warrior they would like. */

type ChooseWarriorButtonProps = {
  unit: FreshUnit;
  warbandId: string;
};

export const ChooseWarriorButton: FunctionComponent<
  ChooseWarriorButtonProps
> = ({ unit, warbandId }) => {
  const { roster, deleteUnit, updateBuilderSidebar, factionSelection } =
    useStore();

  const handleClick = () => {
    const hero = roster.warbands.find(({ id }) => warbandId === id)?.hero;
    if (!hero) {
      console.error("No hero selected, cannot handle this user interaction!");
      return;
    }

    const { faction_type, faction } = hero;

    updateBuilderSidebar({
      heroSelection: false,
      warriorSelection: true,
      warriorSelectionFocus: [warbandId, unit.id],
      factionSelection: { ...factionSelection, [faction_type]: faction },
      tabSelection: faction_type,
    });
  };

  const handleDelete = (e) => {
    e.stopPropagation(); // makes sure the click does not register on the 'choose a warrior' button
    deleteUnit(warbandId, unit.id);
    updateBuilderSidebar({
      heroSelection: false,
      warriorSelection: false,
    });
  };

  return (
    <Button
      variant="light"
      className="p-2 m-1"
      style={{ width: "820px", textAlign: "left" }}
      onClick={handleClick}
    >
      <Stack direction="horizontal" gap={3}>
        <img className="profile" src="assets/images/default.png" alt="" />
        <p>
          <b>Choose a Warrior</b>
        </p>
        <Button
          onClick={handleDelete}
          className="ms-auto mt-auto"
          style={{ marginRight: "10px", marginBottom: "5px" }}
          variant="warning"
        >
          <ImCross />
        </Button>
      </Stack>
    </Button>
  );
};
