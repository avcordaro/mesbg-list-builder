import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
} from "@mui/material";
import Box from "@mui/material/Box";
import Divider from "@mui/material/Divider";
import Typography from "@mui/material/Typography";
import { Fragment } from "react";
import { Profile } from "./profile.type.ts";

interface UnitListProps {
  units: Profile[];
}

const ListItem = ({ profile }: { profile: Profile }) => {
  const specialRules: string[] = [
    ...profile.active_or_passive_rules.map((rule) => rule.name),
    ...profile.special_rules,
  ].sort((a, b) => a.localeCompare(b));

  return (
    <>
      <Box sx={{ py: 2 }}>
        <Typography variant="h6">
          <b>{profile.name}</b>
        </Typography>

        <TableContainer component="div">
          <Table size="small">
            <TableHead>
              <TableRow>
                <TableCell>Mv</TableCell>
                <TableCell>F</TableCell>
                <TableCell>S</TableCell>
                <TableCell>D</TableCell>
                <TableCell>A</TableCell>
                <TableCell>W</TableCell>
                <TableCell>C</TableCell>
                {(profile.HM || profile.HW || profile.HF) && (
                  <>
                    <TableCell>M</TableCell>
                    <TableCell>W</TableCell>
                    <TableCell>F</TableCell>
                  </>
                )}
              </TableRow>
            </TableHead>
            <TableBody>
              <TableRow>
                <TableCell>{profile.Mv}</TableCell>
                <TableCell>{profile.F}</TableCell>
                <TableCell>{profile.S}</TableCell>
                <TableCell>{profile.D}</TableCell>
                <TableCell>{profile.A}</TableCell>
                <TableCell>{profile.W}</TableCell>
                <TableCell>{profile.C}</TableCell>
                {(profile.HM || profile.HW || profile.HF) && (
                  <>
                    <TableCell>{profile.HF ?? "-"}</TableCell>
                    <TableCell>{profile.HM ?? "-"}</TableCell>
                    <TableCell>{profile.HW ?? "-"}</TableCell>
                  </>
                )}
              </TableRow>
            </TableBody>
          </Table>
        </TableContainer>

        <Typography sx={{ mt: 2 }}>
          <b>Special Rules:</b> {specialRules.join(", ")}{" "}
          {specialRules.length === 0 && <i>None</i>}
        </Typography>
        {profile.heroic_actions.length > 0 && (
          <Typography sx={{ mt: 0.5 }}>
            <b>Heroic actions:</b> {profile.heroic_actions.join(", ")}{" "}
          </Typography>
        )}
        {profile.magic_powers.length > 0 && (
          <>
            <Typography sx={{ mt: 0.5 }}>
              <b>Magical powers:</b>
            </Typography>
            <TableContainer
              component="div"
              sx={{ width: "42ch", borderBottom: "none" }}
            >
              <Table size="small">
                <TableHead>
                  <TableRow>
                    <TableCell>Name</TableCell>
                    <TableCell align="center">Range</TableCell>
                    <TableCell />
                  </TableRow>
                </TableHead>
                <TableBody
                  sx={{ "& > *:last-child > *": { borderBottom: "none" } }}
                >
                  {profile.magic_powers.map((power, index) => (
                    <TableRow key={index}>
                      <TableCell>{power.name}</TableCell>
                      <TableCell align="center">{power.range}</TableCell>
                      <TableCell align="center">{power.cast}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
          </>
        )}
      </Box>
    </>
  );
};

export const UnitProfileList = ({ units }: UnitListProps) => {
  return (
    <Box id="pdf-profiles">
      <Typography variant="h5">Profiles</Typography>

      {units.map((unit, index) => (
        <Fragment key={index}>
          <ListItem profile={unit} />
          {units.length !== index && <Divider variant="fullWidth" />}
        </Fragment>
      ))}
    </Box>
  );
};
