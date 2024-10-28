import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import { GiCrackedShield } from "react-icons/gi";
import { useGameModeState } from "../../../../../state/gamemode";
import { useRosterBuildingState } from "../../../../../state/roster-building";
import { Factions } from "../../../../../types/factions.ts";

export function IsengardBreakpoint() {
  const {
    gameState: { casualties = 0, heroCasualties = 0 },
    gameMode,
  } = useGameModeState();
  const {
    factions: factionList,
    armyBonusActive,
    roster,
  } = useRosterBuildingState();

  if (!gameMode) return null;
  if (!armyBonusActive) return null;

  const containsIsengardForce =
    factionList.includes(Factions.Isengard) ||
    factionList.includes(Factions.Assault_Upon_Helms_Deep);

  if (!containsIsengardForce) return null;

  const isBroken =
    Math.ceil(0.66 * roster.num_units) - (casualties + heroCasualties) <= 0;

  const unitsTillBroken = Math.max(
    Math.ceil(0.66 * roster.num_units) - (casualties + heroCasualties),
    0,
  );

  return (
    <Box>
      {!isBroken ? (
        <Typography variant="h6">
          (Isengard Army Bonus) Until 66% : <b>{unitsTillBroken}</b>
        </Typography>
      ) : (
        <Typography variant="h6" color="error">
          (Isengard Army Bonus) You are at least 66% defeated &nbsp;
          <GiCrackedShield />
        </Typography>
      )}
    </Box>
  );
}
