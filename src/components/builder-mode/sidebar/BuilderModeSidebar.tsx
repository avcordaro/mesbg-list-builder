import { useStore } from "../../../state/store";

import { RosterInformation } from "./roster-info/RosterInformation.tsx";
import { UnitSelector } from "./unit-selection/UnitSelector.tsx";

export function BuilderModeSidebar() {
  const { warriorSelection } = useStore();

  return (
    <div
      id="optionMenu"
      className="optionsList p-3 border border-4 rounded position-fixed bg-white"
    >
      {warriorSelection ? <UnitSelector /> : <RosterInformation />}
    </div>
  );
}
