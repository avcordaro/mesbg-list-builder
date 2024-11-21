import { AlertTitle } from "@mui/material";
import Alert from "@mui/material/Alert";
import Box from "@mui/material/Box";
import Stack from "@mui/material/Stack";
import Typography from "@mui/material/Typography";
import { ArmyComposition } from "./pdf/ArmyComposition.tsx";
import { MagicalPowerList } from "./pdf/MagicalPowers.tsx";
import { QuickReferenceTable } from "./pdf/QuickReferenceTable.tsx";
import { SpecialRuleList } from "./pdf/SpecialRuleList.tsx";
import { StatTrackers } from "./pdf/StatTrackers.tsx";
import { UnitProfileList } from "./pdf/UnitProfileList.tsx";
import { useProfiles } from "./pdf/useProfiles.ts";

export const PdfView = () => {
  const { profiles, missingProfiles } = useProfiles();

  return (
    <>
      {missingProfiles.length > 0 && (
        <Alert icon={false} severity="error" sx={{ mb: 1 }}>
          <AlertTitle>
            <b>Some selected units are missing profile data</b>
          </AlertTitle>
          <Typography>
            Some of the units selected in your roster have no registered profile
            data. If you see this message, please let us know via{" "}
            <a href="mailto:avcordaro@gmail.com?subject=MESBG List Builder - Bug/Correction">
              avcordaro@gmail.com
            </a>
            .
          </Typography>
          <Typography sx={{ mt: 1 }}>
            The following units have no profile data:
          </Typography>
          <Typography sx={{ mt: 1 }} variant="body2">
            <i>{JSON.stringify(missingProfiles)}</i>
          </Typography>
        </Alert>
      )}
      <Alert severity="info" sx={{ mb: 2 }}>
        Below is a preview of the PDF that is going to be downloaded
      </Alert>
      <Box sx={{ maxHeight: "50svh", width: "210mm" }}>
        <Box sx={{ border: 1, p: 3 }}>
          <Stack gap={4}>
            <QuickReferenceTable profiles={profiles} />
            <ArmyComposition />
            <UnitProfileList units={profiles} />
            <SpecialRuleList profiles={profiles} />
            <MagicalPowerList profiles={profiles} />
            <StatTrackers profiles={profiles} />
          </Stack>
        </Box>
      </Box>
    </>
  );
};
