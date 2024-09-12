import {
  Paper,
  Stack,
  SxProps,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
} from "@mui/material";
import Chip from "@mui/material/Chip";
import Typography from "@mui/material/Typography";
import { FcCheckmark } from "react-icons/fc";
import { GiQueenCrown } from "react-icons/gi";
import { RxCross1 } from "react-icons/rx";
import { allianceColours } from "../../../constants/alliances.ts";
import { useFactionData } from "../../../hooks/faction-data.ts";
import { useStore } from "../../../state/store.ts";
import { isDefinedUnit, Unit } from "../../../types/unit.ts";
import { Warband } from "../../../types/warband.ts";

const UnitRow = ({
  unit,
  warbandNum,
  leader,
  rowStyle,
}: {
  unit: Unit;
  warbandNum?: number;
  leader?: boolean;
  rowStyle: SxProps;
}) => {
  return (
    <TableRow sx={rowStyle}>
      <TableCell>{warbandNum} </TableCell>
      <TableCell>
        {unit.name}{" "}
        {leader && (
          <>
            - <GiQueenCrown /> Leader{" "}
          </>
        )}
      </TableCell>
      <TableCell>
        {unit.options
          .filter((option) => option.opt_quantity > 0)
          .map(
            ({ opt_quantity, max, option }) =>
              `${max > 1 ? `${opt_quantity} ` : ""}${option}`,
          )
          .join(", ")}
      </TableCell>
      <TableCell align="center">{unit.pointsPerUnit}</TableCell>
      <TableCell align="center">{unit.quantity}</TableCell>
      <TableCell align="center">{unit.pointsTotal}</TableCell>
    </TableRow>
  );
};

const WarbandRows = ({ warband }: { warband: Warband }) => {
  const { roster } = useStore();

  const rowStyle: SxProps = {
    backgroundColor: warband.num % 2 === 0 ? "lightgrey" : "white",
  };

  return (
    <>
      <UnitRow
        unit={warband.hero}
        warbandNum={warband.num}
        leader={roster.leader_warband_id === warband.id}
        rowStyle={rowStyle}
      />
      {warband.units.filter(isDefinedUnit).map((unit) => (
        <UnitRow key={unit.id} unit={unit} rowStyle={rowStyle} />
      ))}
    </>
  );
};

export function RosterTableView({ showArmyBonus }: { showArmyBonus: boolean }) {
  const {
    allianceLevel,
    roster,
    armyBonusActive: hasArmyBonus,
    factions: factionList,
  } = useStore();
  const factionData = useFactionData();

  return (
    <>
      <Stack direction="row" spacing={3} sx={{ mb: 2 }} alignItems="center">
        <Typography flexGrow={1}>
          Alliance level:
          <Chip
            label={allianceLevel}
            color={allianceColours[allianceLevel]}
            sx={{ ml: 1, fontWeight: "bolder" }}
          />
        </Typography>
        <Typography>
          Total Points: <b>{roster.points}</b>
        </Typography>
        <Typography>
          Total Units: <b>{roster.num_units}</b>
        </Typography>
        <Typography>
          Break Point: <b>{Math.round(0.5 * roster.num_units * 100) / 100}</b>
        </Typography>
      </Stack>
      <TableContainer component={Paper} sx={{ mb: 2 }}>
        <Table
          sx={{ width: "100%", border: 1, borderColor: "#AEAEAE" }}
          size="small"
        >
          <TableHead>
            <TableRow>
              <TableCell>Warband</TableCell>
              <TableCell>Name</TableCell>
              <TableCell>Options</TableCell>
              <TableCell align="center">Per Unit</TableCell>
              <TableCell align="center">Quantity</TableCell>
              <TableCell align="center">Points</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {roster.warbands.map((warband) => (
              <WarbandRows key={warband.id} warband={warband} />
            ))}
          </TableBody>
        </Table>
      </TableContainer>

      {showArmyBonus && (
        <>
          {hasArmyBonus ? (
            <>
              <Typography variant="body1">
                Army Bonuses <FcCheckmark />
              </Typography>
              <hr />
              {factionList.map((f) => (
                <div key={f}>
                  <Chip
                    label={f}
                    sx={{
                      color: hasArmyBonus ? "white" : "grey",
                      backgroundColor: hasArmyBonus ? "black" : "lightgrey",
                    }}
                  />
                  <Typography
                    dangerouslySetInnerHTML={{
                      __html: factionData[f]["armyBonus"],
                    }}
                  />
                </div>
              ))}
            </>
          ) : (
            <Typography>
              Army Bonuses
              <Typography color="error" component="span" sx={{ ml: 1 }}>
                <RxCross1 />
              </Typography>
            </Typography>
          )}
        </>
      )}
    </>
  );
}
