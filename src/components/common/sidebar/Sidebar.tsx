import { useStore } from "../../../state/store.ts";

import { RosterInformation } from "./roster-info/RosterInformation.tsx";
import { UnitSelector } from "./unit-selection/UnitSelector.tsx";

export function Sidebar() {
  const { gameMode, warriorSelection } = useStore();

  return !gameMode && warriorSelection ? (
    <UnitSelector />
  ) : (
    <RosterInformation />
  );
}
