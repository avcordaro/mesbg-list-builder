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

const CheckboxList = ({ amount }: { amount: string }) => {
  return (
    <Stack direction="row" gap={1} flexWrap="wrap" justifyContent="center">
      {Array.from({ length: Number(amount) }).map((_, index) => (
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
  );
};

export const StatTrackers = () => {
  const { roster } = useRosterBuildingState();
  const { heroes } = createGameState(roster);

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

  const cellStyling: SxProps<Theme> = {
    border: 0,
    borderRight: 1,
    borderBottom: 1,
    borderColor: (theme) => theme.palette.grey["300"],
    borderStyle: "solid",
  };

  return (
    <Box id="pdf-stat-trackers">
      <Typography variant="h5">Might / Will / Fate trackers</Typography>
      <TableContainer component="div" sx={{ py: 1 }}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell size={"small"} sx={cellStyling} />
              <TableCell size={"small"} align="center" sx={cellStyling}>
                Might
              </TableCell>
              <TableCell size={"small"} align="center" sx={cellStyling}>
                Will
              </TableCell>
              <TableCell size={"small"} align="center" sx={cellStyling}>
                Fate
              </TableCell>
              <TableCell size={"small"} align="center" sx={cellStyling}>
                Wounds
              </TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {rows.map((row, index) => (
              <TableRow key={index}>
                <TableCell sx={cellStyling}>{row.name}</TableCell>
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
