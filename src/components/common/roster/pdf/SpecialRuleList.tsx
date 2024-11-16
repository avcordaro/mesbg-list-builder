import Box from "@mui/material/Box";
import Stack from "@mui/material/Stack";
import Typography from "@mui/material/Typography";
import keywords from "../../../../assets/data/keywords.json";

import { Profile } from "./profile.type.ts";

interface SpecialRuleListProps {
  profiles: Profile[];
}

type SpecialRule = {
  name: string;
  description: string;
  type: string;
};

function duplicates(item: SpecialRule, index: number, self: SpecialRule[]) {
  return index === self.findIndex((other) => other.name === item.name);
}

export const SpecialRuleList = ({ profiles }: SpecialRuleListProps) => {
  const specialRules: SpecialRule[] = profiles
    .flatMap((profile) => [
      ...profile.active_or_passive_rules,
      ...profile.special_rules.map((sr) => {
        const rule = keywords.find(
          (keyword) => keyword.name === sr.split("(")[0].trim(),
        );
        return {
          name: sr,
          type: "unknown",
          description: rule?.description,
        };
      }),
    ])
    .filter(duplicates)
    .sort((a, b) => a.name.localeCompare(b.name));

  return (
    <>
      <Box id="pdf-rules">
        <Typography variant="h5">Special rules</Typography>
        <Stack gap={1} sx={{ py: 1 }}>
          {specialRules.map((rule) => (
            <Box key={rule.name}>
              <Typography variant="body1">
                <b>
                  {rule.name} ({rule.type})
                </b>
              </Typography>
              <Typography variant="body2">{rule.description}</Typography>
            </Box>
          ))}
        </Stack>
      </Box>
    </>
  );
};
