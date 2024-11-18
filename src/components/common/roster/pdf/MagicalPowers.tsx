import Box from "@mui/material/Box";
import Stack from "@mui/material/Stack";
import Typography from "@mui/material/Typography";
import keywords from "../../../../assets/data/keywords.json";

import { Profile } from "./profile.type.ts";

interface MagicalPowerListProps {
  profiles: Profile[];
}

type MagicalPower = {
  name: string;
  description: string;
};

function duplicates(item: MagicalPower, index: number, self: MagicalPower[]) {
  return index === self.findIndex((other) => other.name === item.name);
}

export const MagicalPowerList = ({ profiles }: MagicalPowerListProps) => {
  const magicalPowers: MagicalPower[] = profiles
    .flatMap((profile) =>
      profile.magic_powers.map(({ name }) => {
        const power = keywords.find((keyword) => keyword.name === name);
        return {
          name,
          description: power?.description,
        };
      }),
    )
    .filter(duplicates)
    .sort((a, b) => a.name.localeCompare(b.name));

  return (
    <>
      {magicalPowers.length > 0 && (
        <Box id="pdf-magic">
          <Typography variant="h5">Magical Powers</Typography>
          <Stack gap={1} sx={{ py: 1 }}>
            {magicalPowers.map((rule) => (
              <Box key={rule.name}>
                <Typography variant="h6">
                  <b>{rule.name}</b>
                </Typography>
                <Typography
                  dangerouslySetInnerHTML={{
                    __html: rule.description?.replaceAll("\n\n", "<br />"),
                  }}
                />
              </Box>
            ))}
          </Stack>
        </Box>
      )}
    </>
  );
};
