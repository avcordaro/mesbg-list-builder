import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableRow,
} from "@mui/material";
import Box from "@mui/material/Box";
import Stack from "@mui/material/Stack";
import Typography from "@mui/material/Typography";
import { Fragment } from "react";
import { useRosterBuildingState } from "../../../../state/roster-building";
import { isDefinedUnit, Unit } from "../../../../types/unit.ts";

function UnitRow({ unit }: { unit: Unit }) {
  if (!isDefinedUnit(unit)) {
    return (
      <TableRow>
        <TableCell colSpan={2}>No Hero selected</TableCell>
      </TableRow>
    );
  }

  const options =
    unit?.options?.filter((option) => option.opt_quantity > 0) || [];
  return (
    <TableRow>
      <TableCell width={12}>{unit.quantity}x</TableCell>
      <TableCell>
        {unit.name}{" "}
        {options.length > 0 && (
          <>
            (
            {options
              ?.map(
                ({ opt_quantity, max, option }) =>
                  `${max > 1 ? `${opt_quantity} ` : ""}${option}`,
              )
              ?.join(", ")}
            )
          </>
        )}
      </TableCell>
    </TableRow>
  );
}

export const ArmyComposition = () => {
  const { roster, allianceLevel } = useRosterBuildingState();

  const warbands = roster.warbands.map((warband) => [
    warband.hero,
    ...warband.units.filter(isDefinedUnit),
  ]);

  return (
    <Box id="pdf-army">
      <Typography variant="h5" sx={{ mb: 2 }}>
        Army Composition
      </Typography>
      <Stack direction="row" gap={2} sx={{ mb: 1 }}>
        <Typography flexGrow={1}>
          Alliance level: <b>{allianceLevel} </b>
        </Typography>
        <Typography>
          Points: <b>{roster.points}</b>
        </Typography>
        <Typography>
          Units: <b>{roster.num_units}</b>
        </Typography>
        <Typography>
          Break Point: <b>{Math.round(0.5 * roster.num_units * 100) / 100}</b>
        </Typography>
        <Typography>
          Bows: <b>{roster.bow_count}</b>
        </Typography>
        <Typography>
          Might: <b>{roster.might_total ?? "N/A"}</b>
        </Typography>
      </Stack>
      <TableContainer component="div">
        <Table>
          <TableBody>
            {warbands.map((warband, index) => (
              <Fragment key={index}>
                <TableRow>
                  <TableCell
                    size="small"
                    colSpan={2}
                    sx={{ textAlign: "center", backgroundColor: "#F3F3F3" }}
                  >
                    Warband {index + 1}
                  </TableCell>
                </TableRow>
                {warband.map((unit, index) => (
                  <UnitRow unit={unit} key={index} />
                ))}
              </Fragment>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </Box>
  );
};
