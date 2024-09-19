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
import Divider from "@mui/material/Divider";
import Typography from "@mui/material/Typography";
import { useTheme } from "@mui/material/styles";
import useMediaQuery from "@mui/material/useMediaQuery";
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
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));

  return (
    <TableRow sx={rowStyle}>
      {!isMobile && <TableCell>{warbandNum} </TableCell>}
      <TableCell>
        {!unit.unit_type.includes("Hero") && <>{unit.quantity}x </>}
        {unit.name}{" "}
        {leader && (
          <Typography component="span" variant="body2">
            - <GiQueenCrown /> Leader
          </Typography>
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
        unit={
          isDefinedUnit(warband.hero)
            ? warband.hero
            : ({
                name: "-- NO HERO SELECTED --",
                unit_type: "Hero of something...",
                options: [],
              } as Unit)
        }
        warbandNum={warband.num}
        leader={
          isDefinedUnit(warband.hero) && roster.leader_warband_id === warband.id
        }
        rowStyle={rowStyle}
      />
      {warband.units.filter(isDefinedUnit).map((unit) => (
        <UnitRow key={unit.id} unit={unit} rowStyle={rowStyle} />
      ))}
    </>
  );
};

export function RosterTableView({
  showArmyBonus,
  screenshotting = false,
}: {
  showArmyBonus: boolean;
  screenshotting?: boolean;
}) {
  const {
    allianceLevel,
    roster,
    armyBonusActive: hasArmyBonus,
    factions: factionList,
  } = useStore();
  const factionData = useFactionData();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));
  return (
    <>
      <Stack
        direction={isMobile && !screenshotting ? "column" : "row"}
        spacing={isMobile && !screenshotting ? 1 : 3}
        sx={{ mb: 2 }}
        alignItems={isMobile && !screenshotting ? "start" : "center"}
      >
        <Typography flexGrow={1}>
          Alliance level:
          <Typography
            variant="body2"
            component="span"
            sx={{
              ml: 1,
              fontWeight: "bolder",
              backgroundColor:
                theme.palette[allianceColours[allianceLevel]].light,
              color: "white",
              px: 2,
              py: 1,
              borderRadius: 100,
              whiteSpace: "nowrap",
            }}
          >
            {allianceLevel}
          </Typography>
        </Typography>
        <Typography>
          Total Points: <b>{roster.points}</b>
        </Typography>
        <Typography>
          Total Units: <b>{roster.num_units}</b>
        </Typography>
        <Typography>
          Total Bows: <b>{roster.bow_count}</b>
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
            <TableRow sx={{ backgroundColor: "white" }}>
              {!isMobile && <TableCell>Warband</TableCell>}
              <TableCell>Name</TableCell>
              <TableCell>Options</TableCell>
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
              <Divider sx={{ my: 1 }} />
              {factionList.map((f) => (
                <div key={f}>
                  <Typography
                    variant="body2"
                    component="span"
                    sx={{
                      my: 1,
                      display: "inline-block",
                      fontWeight: "bolder",
                      backgroundColor: "black",
                      color: "white",
                      px: 2,
                      py: 1,
                      borderRadius: 100,
                      whiteSpace: "nowrap",
                    }}
                  >
                    {f}
                  </Typography>
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
