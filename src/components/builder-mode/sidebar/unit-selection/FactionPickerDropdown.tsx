import { FunctionComponent } from "react";
import Dropdown from "react-bootstrap/Dropdown";
import DropdownButton from "react-bootstrap/DropdownButton";
import { useMesbgData } from "../../../../hooks/mesbg-data.ts";
import { useStore } from "../../../../state/store.ts";
import { Faction, FactionType } from "../../../../types/factions.ts";
import { FactionLogo } from "../../../common/images/FactionLogo.tsx";

type FactionPickerDropdownProps = {
  type: FactionType;
};

export const FactionPickerDropdown: FunctionComponent<
  FactionPickerDropdownProps
> = ({ type }) => {
  const { getFactionsOfType } = useMesbgData();
  const {
    factionSelection,
    updateBuilderSidebar,
    heroSelection,
    factionType: currentlySelectedFactionType,
  } = useStore();

  const selectFaction = (faction: Faction) => {
    updateBuilderSidebar({
      factionSelection: {
        ...factionSelection,
        [type]: faction,
      },
    });
  };

  return (
    <DropdownButton
      className="dropDownButton mt-3"
      title={factionSelection[type]}
      onSelect={(faction: Faction) => selectFaction(faction)}
      disabled={!heroSelection || currentlySelectedFactionType.includes("LL")}
    >
      {getFactionsOfType(type)
        .sort()
        .map((f) => (
          <Dropdown.Item style={{ width: "458px" }} eventKey={f} key={f}>
            <FactionLogo faction={f} className="faction_logo" />
            &nbsp; {f}
          </Dropdown.Item>
        ))}
    </DropdownButton>
  );
};
