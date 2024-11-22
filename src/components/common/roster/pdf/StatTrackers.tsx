import {
  SxProps,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Theme,
} from "@mui/material";
import Box from "@mui/material/Box";
import Stack from "@mui/material/Stack";
import Typography from "@mui/material/Typography";
import { createGameState } from "../../../../state/gamemode/gamestate/create-game-state.ts";
import { useRosterBuildingState } from "../../../../state/roster-building";
import { isDefinedUnit } from "../../../../types/unit.ts";
import { Profile } from "./profile.type.ts";

const cellStyling: SxProps<Theme> = {
  border: 0,
  borderRight: 1,
  borderBottom: 1,
  borderColor: (theme) => theme.palette.grey["300"],
  borderStyle: "solid",
};

interface StatTrackersProps {
  profiles: Profile[];
}

const getAdditionalProfiles = (profile: Profile): Profile[] => {
  if (!profile.additional_stats || profile.additional_stats.length === 0) {
    return [];
  }

  return profile.additional_stats.flatMap((additionalProfile) => [
    additionalProfile,
    ...getAdditionalProfiles(additionalProfile),
  ]);
};

function modelsWithTrackableData({ wounds, might, will, fate }) {
  return (
    Number(wounds) > 1 ||
    Number(might) > 0 ||
    Number(will) > 0 ||
    Number(fate) > 0
  );
}

function modelThatAreAlreadyListed(
  rows: {
    fate: string;
    wounds: string;
    will: string;
    might: string;
    name: string;
  }[],
) {
  return ({ name }) => !rows.find((row) => row.name === name);
}

function splitNumber(num: number, maxSegment: number): number[] {
  const segments = Math.ceil(num / maxSegment); // Number of segments needed
  const baseValue = Math.floor(num / segments); // Base value for each segment
  const remainder = num % segments; // Remaining value to distribute

  // Create an array with `segments` elements all starting as `baseValue`
  const result = Array(segments).fill(baseValue);

  // Distribute the remainder across the first few segments
  for (let i = 0; i < remainder; i++) {
    result[i]++;
  }

  return result;
}

const CheckboxList = ({ amount }: { amount: string }) => {
  const length = Number(amount) || 0;
  const rows = splitNumber(length, 5);

  return (
    <Stack direction="column" gap={1} justifyContent="center">
      {rows.map((rowLength, index) => (
        <Stack
          key={index}
          direction="row"
          gap={1}
          flexWrap="nowrap"
          justifyContent="center"
        >
          {Array.from({ length: rowLength }).map((_, index) => (
            <div
              key={index}
              style={{
                width: "20px",
                height: "20px",
                border: "1px solid black",
                borderRadius: "20px",
              }}
            ></div>
          ))}
        </Stack>
      ))}
    </Stack>
  );
};

export const StatTrackers = ({ profiles }: StatTrackersProps) => {
  const { roster } = useRosterBuildingState();
  const { heroes } = createGameState(roster);

  const units = roster.warbands
    .flatMap((warband) => [warband.hero, ...warband.units])
    .filter(isDefinedUnit)
    .map(({ name, quantity, options }) => ({ name, quantity, options }))
    .reduce((units, unit) => {
      units[unit.name] = (units[unit.name] || 0) + unit.quantity;
      if (
        unit.name.includes("War Mumak") ||
        unit.name === "The Mumak War Leader"
      ) {
        units["Howdah"] = (units["Howdah"] || 0) + unit.quantity;
      }
      if (unit.name === "Mordor War Catapult") {
        units["Troll"] = (units["Troll"] || 0) + unit.quantity;
      }

      const mount = unit.options.find(
        (option) => option.type === "mount" && option.opt_quantity > 0,
      );
      if (mount) {
        const mountName = `${mount.option}`;
        units[mountName] = (units[mountName] || 0) + mount.opt_quantity;
      }

      return units;
    }, {});

  const rows = Object.entries(heroes)
    .flatMap(([, hero]) => hero)
    .map((hero) => {
      const [might, will, fate, wounds] = hero.MWFW.split(":");
      return {
        name: hero.name,
        might,
        will,
        fate,
        wounds,
      };
    });

  const additionalRows = profiles
    .flatMap((profile) => [profile, ...getAdditionalProfiles(profile)])
    .map(({ name, W, HM, HW, HF }) => ({
      name: name,
      wounds: W,
      might: HM,
      will: HW,
      fate: HF,
    }))
    .filter(modelsWithTrackableData)
    .filter(modelThatAreAlreadyListed(rows))
    .filter(
      (item, index, self) =>
        self.findIndex((other) => item.name === other.name) === index,
    )
    .flatMap((row) => Array.from({ length: units[row.name] }).map(() => row));

  const allRows = [...rows, ...additionalRows];

  return (
    <Box id="pdf-stat-trackers">
      <Typography variant="h5">Might / Will / Fate trackers</Typography>
      <TableContainer component="div" sx={{ py: 1 }}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell size="small" sx={cellStyling} />
              <TableCell size="small" align="center" sx={cellStyling}>
                Might
              </TableCell>
              <TableCell size="small" align="center" sx={cellStyling}>
                Will
              </TableCell>
              <TableCell size="small" align="center" sx={cellStyling}>
                Fate
              </TableCell>
              <TableCell size="small" align="center" sx={cellStyling}>
                Wounds
              </TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {allRows.map((row, index) => (
              <TableRow key={index}>
                <TableCell sx={cellStyling}>
                  {row.name === "Azog's Lieutenant"
                    ? row.name +
                      ` ( ${index + 1 - rows.findIndex(({ name }) => name === row.name)} )`
                    : row.name}
                </TableCell>
                <TableCell sx={cellStyling}>
                  <CheckboxList amount={row.might} />
                </TableCell>
                <TableCell sx={cellStyling}>
                  <CheckboxList amount={row.will} />
                </TableCell>
                <TableCell sx={cellStyling}>
                  <CheckboxList amount={row.fate} />
                </TableCell>
                <TableCell sx={cellStyling}>
                  <CheckboxList amount={row.wounds} />
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </Box>
  );
};
