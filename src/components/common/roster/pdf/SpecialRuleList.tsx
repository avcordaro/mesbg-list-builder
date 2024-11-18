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

function mapSpecialRule(sr: string) {
  const rule = keywords.find(
    (keyword) => keyword.name === sr.split("(")[0].trim(),
  );
  return {
    name: rule?.name || sr,
    type: rule.active_passive,
    description: rule?.description,
  };
}

function mapAopRule(rule: {
  name: string;
  type: "Active" | "Passive";
  description: string;
}) {
  return {
    ...rule,
    type: rule.type || "Passive",
  };
}

export const SpecialRuleList = ({ profiles }: SpecialRuleListProps) => {
  const specialRules: SpecialRule[] = profiles
    .flatMap((profile) => [
      ...profile.active_or_passive_rules.map(mapAopRule),
      ...profile.special_rules.map(mapSpecialRule),
      ...(profile.additional_stats?.flatMap((additionalProfile) => [
        ...additionalProfile.active_or_passive_rules.map(mapAopRule),
        ...additionalProfile.special_rules.map(mapSpecialRule),
      ]) || []),
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
                  {rule.name} {rule.type && <>({rule.type})</>}
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
