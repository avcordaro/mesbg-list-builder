import { useGameModeState } from "../../../state/gamemode";
import { useRosterBuildingState } from "../../../state/roster-building";
import { UnitSelector } from "../../builder-mode/unit-selection/UnitSelector.tsx";
import { RosterInformation } from "./roster-info/RosterInformation.tsx";

export function Sidebar() {
  const { gameMode } = useGameModeState();
  const { warriorSelection } = useRosterBuildingState();

  return !gameMode && warriorSelection ? (
    <UnitSelector />
  ) : (
    <RosterInformation />
  );
}
