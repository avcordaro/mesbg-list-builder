import { Chip } from "@mui/material";
import Box from "@mui/material/Box";
import Divider from "@mui/material/Divider";
import Typography from "@mui/material/Typography";
import { useTheme } from "@mui/material/styles";
import { Fragment } from "react";
import { allianceColours } from "../../../constants/alliances.ts";
import { wanderers } from "../../../constants/wanderers";
import { useFactionData } from "../../../hooks/faction-data.ts";
import { useStore } from "../../../state/store";
import { Faction } from "../../../types/factions.ts";
import { FactionLogo } from "../../common/images/FactionLogo.tsx";

export const FactionRow = ({ faction }: { faction: Faction }) => (
  <>
    <FactionLogo faction={faction} />
    {" " + faction}
    <br />
  </>
);

function AlliesSection({ allies, type }: { allies: Faction[]; type: string }) {
  const theme = useTheme();

  return (
    <Box sx={{ mb: 1 }}>
      <Box sx={{ mb: 1 }}>
        <Chip
          sx={{
            color: "white",
            fontWeight: "bolder",
            background: theme.palette[allianceColours[type]].light,
          }}
          label={type}
        />
      </Box>
      {allies.map((ally) => (
        <FactionRow key={ally} faction={ally} />
      ))}
    </Box>
  );
}

export const FactionAllies = ({ faction }: { faction: Faction }) => {
  const factionData = useFactionData();
  const isWanderer = wanderers.includes(faction);

  const primaryAllies: Faction[] = factionData[faction]["primaryAllies"]
    // Filter other Wanders if this faction is a wanderer...
    .filter((ally) => !isWanderer || !wanderers.includes(ally as Faction));
  const secondaryAllies: Faction[] = factionData[faction]["secondaryAllies"];

  return (
    <>
      <FactionRow faction={faction} />
      <Divider sx={{ m: "0.5rem auto" }} />
      {primaryAllies.length > 0 && (
        <AlliesSection allies={primaryAllies} type="Historical" />
      )}
      {secondaryAllies.length > 0 && (
        <AlliesSection allies={secondaryAllies} type="Convenient" />
      )}
    </>
  );
};

export const Alliances = () => {
  const { factions } = useStore();

  return (
    <Fragment>
      <Typography>
        Historical allies keep their army bonuses, whereas Convenient and
        Impossible allies lose all army bonuses.
      </Typography>
      {factions.map((faction) => (
        <Box key={faction} sx={{ mt: 2 }}>
          <FactionAllies faction={faction} />
        </Box>
      ))}
    </Fragment>
  );
};
