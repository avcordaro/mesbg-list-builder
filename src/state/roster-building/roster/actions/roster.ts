import { Roster } from "../../../../types/roster.ts";
import { RosterBuildingState } from "../../index.ts";

export function updateRoster(roster: Roster): Partial<RosterBuildingState> {
  // Replace the empty string at the start of each array with a 0.
  // We do this cause the export will error out on empty strings at the start of an array.
  // Actual fix should be done in the data, but CBA.
  return {
    roster: JSON.parse(JSON.stringify(roster).replaceAll('["",', "[0,")),
  };
}
