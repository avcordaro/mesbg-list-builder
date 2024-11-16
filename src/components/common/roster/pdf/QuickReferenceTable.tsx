import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
} from "@mui/material";
import Typography from "@mui/material/Typography";
import { Profile } from "./profile.type.ts";

interface QuickReferenceTableProps {
  profiles: Profile[];
}

export const QuickReferenceTable = ({ profiles }: QuickReferenceTableProps) => {
  return (
    <>
      <TableContainer id="pdf-quick-ref" component="div">
        <Typography variant="h5">Quick reference sheet</Typography>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell />
              <TableCell>Mv</TableCell>
              <TableCell>F</TableCell>
              <TableCell>S</TableCell>
              <TableCell>D</TableCell>
              <TableCell>A</TableCell>
              <TableCell>W</TableCell>
              <TableCell>C</TableCell>
              <TableCell>M</TableCell>
              <TableCell>W</TableCell>
              <TableCell>F</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {profiles.map((row, index) => (
              <TableRow key={index}>
                <TableCell>{row.name}</TableCell>
                <TableCell>{row.Mv}</TableCell>
                <TableCell>{row.F}</TableCell>
                <TableCell>{row.S}</TableCell>
                <TableCell>{row.D}</TableCell>
                <TableCell>{row.A}</TableCell>
                <TableCell>{row.W}</TableCell>
                <TableCell>{row.C}</TableCell>
                <TableCell>{row.HF ?? "-"}</TableCell>
                <TableCell>{row.HM ?? "-"}</TableCell>
                <TableCell>{row.HW ?? "-"}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </>
  );
};
