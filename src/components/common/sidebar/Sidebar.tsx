import { useStore } from "../../../state/store.ts";

import { UnitSelector } from "../../builder-mode/unit-selection/UnitSelector.tsx";
import { RosterInformation } from "./roster-info/RosterInformation.tsx";

export function Sidebar() {
  const { gameMode, warriorSelection } = useStore();

  return !gameMode && warriorSelection ? (
    <UnitSelector />
  ) : (
    <RosterInformation />
  );
}
