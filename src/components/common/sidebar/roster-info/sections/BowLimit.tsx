import Box from "@mui/material/Box";
import Divider from "@mui/material/Divider";
import Stack from "@mui/material/Stack";
import Typography from "@mui/material/Typography";
import { useTheme } from "@mui/material/styles";
import useMediaQuery from "@mui/material/useMediaQuery";
import { wanderers } from "../../../../../constants/wanderers.ts";
import { useFactionData } from "../../../../../hooks/faction-data.ts";
import { useStore } from "../../../../../state/store.ts";
import { Faction } from "../../../../../types/factions.ts";

export const BowLimits = () => {
  const { factions: factionList, factionMetaData } = useStore();
  const factionData = useFactionData();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));

  return (
    <Box sx={{ my: 2 }}>
      <Divider sx={{ my: 2 }}>
        <Stack direction="row" justifyContent="center" alignItems="center">
          <Typography variant="h6">Bow Limit</Typography>
        </Stack>
      </Divider>
      {factionList
        .filter((x) => !wanderers.includes(x))
        .map((f: Faction) => {
          const { bow_limit } = factionData[f];
          const { modelsThatCountForBowLimit, modelsWithBow } =
            factionMetaData[f];

          const bowLimitPerc = bow_limit * 100;
          const bowLimitCount = Math.ceil(
            bow_limit * modelsThatCountForBowLimit,
          );
          const exceededBowLimit = modelsWithBow > bowLimitCount;

          return (
            <Typography
              key={f}
              color={exceededBowLimit ? "error" : "textPrimary"}
            >
              {isMobile ? (
                <>
                  <b>
                    {f}: {modelsWithBow} / {bowLimitCount}
                  </b>
                </>
              ) : (
                <>
                  <b>{f}:</b>
                  <small>
                    {" (" +
                      bowLimitPerc +
                      "% limit - " +
                      bowLimitCount +
                      " bows) "}
                  </small>
                  <b>
                    {modelsWithBow} / {modelsThatCountForBowLimit}
                  </b>
                </>
              )}
            </Typography>
          );
        })}
    </Box>
  );
};
