import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
} from "@mui/material";
import Typography from "@mui/material/Typography";
import { Fragment } from "react";
import { Profile } from "./profile.type.ts";

interface QuickReferenceTableProps {
  profiles: Profile[];
}

const ReferenceRow = ({
  row,
  indent,
}: {
  row: Pick<
    Profile,
    "name" | "Mv" | "F" | "S" | "D" | "A" | "W" | "C" | "HM" | "HW" | "HF"
  >;
  indent?: boolean;
}) => {
  return (
    <TableRow>
      <TableCell sx={{ pl: indent ? 6 : 0 }}>{row.name}</TableCell>
      <TableCell>{row.Mv}</TableCell>
      <TableCell>{row.F}</TableCell>
      <TableCell>{row.S}</TableCell>
      <TableCell>{row.D}</TableCell>
      <TableCell>{row.A}</TableCell>
      <TableCell>{row.W}</TableCell>
      <TableCell>{row.C}</TableCell>
      <TableCell>{row.HM ?? "-"}</TableCell>
      <TableCell>{row.HW ?? "-"}</TableCell>
      <TableCell>{row.HF ?? "-"}</TableCell>
    </TableRow>
  );
};

export const QuickReferenceTable = ({ profiles }: QuickReferenceTableProps) => {
  const mounts = profiles
    .flatMap(
      (profile) =>
        profile.additional_stats?.filter((stat) => stat.type === "mount") || [],
    )
    .filter(function (item: Profile, index: number, self: Profile[]) {
      return index === self.findIndex((other) => other.name === item.name);
    })
    .sort((a, b) => a.name.localeCompare(b.name));
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
              <Fragment key={index}>
                <ReferenceRow row={row} />
                {row.additional_stats
                  ?.filter((stat) => stat.type !== "mount")
                  ?.map((additionalRow, aIndex) => (
                    <ReferenceRow
                      row={additionalRow}
                      key={aIndex}
                      indent={true}
                    />
                  ))}
              </Fragment>
            ))}
            {mounts.map((additionalRow, aIndex) => (
              <ReferenceRow row={additionalRow} key={aIndex} />
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </>
  );
};
