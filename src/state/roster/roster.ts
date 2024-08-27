import { AllianceLevel } from "../../components/constants/alliances.ts";
import { Faction } from "../../types/factions.ts";
import { Roster } from "../../types/roster.ts";
import { AppState } from "../store.ts";
import { makeAllianceSpecificRosterAjustments } from "./alliance";
import { calculateModelCount } from "./models.ts";

export function updateRoster(
  roster: Roster,
  allianceLevel: AllianceLevel,
  factions: Faction[],
): Partial<AppState> {
  // Adjusts the roster just prior to saving to make sure all alliance specific rules are met.
  const adjustedRoster = makeAllianceSpecificRosterAjustments(
    factions,
    allianceLevel,
    roster,
  );

  // Replace the empty string at the start of each array with a 0.
  // We do this cause the export will error out on empty strings at the start of an array.
  // Actual fix should be done in the data, but CBA.
  const updatedRoster = JSON.parse(
    JSON.stringify(adjustedRoster).replaceAll('["",', "[0,"),
  );

  return {
    roster: updatedRoster,
    factionMetaData: calculateModelCount(adjustedRoster.warbands),
  };
}
