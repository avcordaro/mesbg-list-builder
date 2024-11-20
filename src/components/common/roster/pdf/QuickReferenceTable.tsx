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
  prefix,
}: {
  row: Pick<
    Profile,
    "name" | "Mv" | "F" | "S" | "D" | "A" | "W" | "C" | "HM" | "HW" | "HF"
  >;
  indent?: boolean;
  prefix?: string;
}) => {
  return (
    <TableRow>
      <TableCell sx={{ pl: indent ? 6 : 0 }}>
        {prefix}
        {row.name}
      </TableCell>
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
            {profiles.map((row, index) => {
              const skippedParentRow = [
                "Vault Warden Team",
                "Uruk-Hai Demolition Team",
              ].includes(row.name);
              const prefixes = {
                "Iron Shield": "Vault Warden - ",
                "Foe Spear": "Vault Warden - ",
              };
              return (
                <Fragment key={index}>
                  {!skippedParentRow && <ReferenceRow row={row} />}
                  {row.additional_stats
                    ?.filter((stat) => stat.type !== "mount")
                    ?.filter(
                      (stat) =>
                        !profiles.find((profile) => profile.name === stat.name),
                    )
                    ?.map((additionalRow, aIndex) => (
                      <ReferenceRow
                        row={additionalRow}
                        key={aIndex}
                        indent={!skippedParentRow}
                        prefix={
                          skippedParentRow ? prefixes[additionalRow.name] : ""
                        }
                      />
                    ))}
                </Fragment>
              );
            })}
            {mounts.map((additionalRow, aIndex) => (
              <ReferenceRow row={additionalRow} key={aIndex} />
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </>
  );
};
