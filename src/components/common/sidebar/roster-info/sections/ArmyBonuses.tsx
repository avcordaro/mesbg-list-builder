import CheckIcon from "@mui/icons-material/Check";
import ClearIcon from "@mui/icons-material/Clear";
import Box from "@mui/material/Box";
import Chip from "@mui/material/Chip";
import Divider from "@mui/material/Divider";
import Stack from "@mui/material/Stack";
import Typography from "@mui/material/Typography";
import { wanderers } from "../../../../../constants/wanderers.ts";
import { useFactionData } from "../../../../../hooks/faction-data.ts";
import { useStore } from "../../../../../state/store.ts";

export const ArmyBonuses = () => {
  const { factions: factionList, armyBonusActive: hasArmyBonus } = useStore();
  const factionData = useFactionData();
  return (
    <Box sx={{ mt: 2 }}>
      <Divider>
        <Stack direction="row" justifyContent="center" alignItems="center">
          <Typography
            variant="h6"
            color={hasArmyBonus ? "textPrimary" : "textDisabled"}
          >
            Army Bonuses
          </Typography>
          {hasArmyBonus ? (
            <CheckIcon color="success" />
          ) : (
            <ClearIcon color="error" />
          )}
        </Stack>
      </Divider>
      {factionList
        .filter((x) => !wanderers.includes(x))
        .map((f) => (
          <Box key={f} sx={{ mt: 2 }}>
            <Chip
              label={f}
              sx={{
                color: hasArmyBonus ? "white" : "grey",
                backgroundColor: hasArmyBonus ? "black" : "lightgrey",
              }}
            />
            <Typography
              variant="body1"
              component="div"
              color={hasArmyBonus ? "textPrimary" : "textDisabled"}
              dangerouslySetInnerHTML={{
                __html: factionData[f]["armyBonus"],
              }}
            />
          </Box>
        ))}
    </Box>
  );
};
