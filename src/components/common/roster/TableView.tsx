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
import Box from "@mui/material/Box";
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
import {
  FreshUnit,
  isDefinedUnit,
  Unit,
  UnitType,
} from "../../../types/unit.ts";
import { Warband } from "../../../types/warband.ts";

const UnitRow = ({
  unit,
  leader,
  rowStyle,
  forceQuantity = false,
}: {
  unit: Unit;
  leader?: boolean;
  rowStyle: SxProps;
  forceQuantity?: boolean;
}) => {
  return (
    <TableRow sx={rowStyle}>
      <TableCell>
        {(!unit.unit_type.includes("Hero") || forceQuantity) && (
          <>{unit.quantity}x </>
        )}
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

const RosterTotalRows = ({ units }: { units: (Unit | FreshUnit)[] }) => {
  const totalledUnits: Unit[] = Object.values(
    Object.create(units)
      .filter(isDefinedUnit)
      // clone the unit so not to update its 'quantity' by object reference in state.
      .map(Object.create)
      .map((unit: Unit) => {
        const options = unit.options
          .filter((o) => o.opt_quantity)
          .map((o) => o.option)
          .join(",");
        const key = unit.name + " [" + options + "]";

        return { key, unit };
      })
      .reduce(
        (totals: Record<string, Unit>, { key, unit }) => {
          if (!totals[key]) {
            totals[key] = unit;
          } else {
            totals[key].quantity += unit.quantity;
            totals[key].pointsTotal += unit.pointsTotal;
          }
          return totals;
        },
        {} as Record<string, Unit>,
      ),
  );

  const sorting: Record<UnitType, number> = {
    "Hero of Legend": 1,
    "Hero of Valour": 2,
    "Hero of Fortitude": 3,
    "Minor Hero": 4,
    "Independent Hero": 5,
    Warrior: 6,
    "Siege Engine": 7,
  };

  return (
    <>
      {totalledUnits
        .sort((a, b) => {
          return sorting[a.unit_type] - sorting[b.unit_type];
        })
        .map((unit) => (
          <UnitRow
            key={unit.id}
            unit={unit}
            rowStyle={{
              backgroundColor: "white",
            }}
            forceQuantity={unit.unit_type.includes("Hero") && unit.quantity > 1}
          />
        ))}
    </>
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
  const displayTotals = true;
  return (
    <>
      <Stack
        direction={isMobile && !screenshotting ? "column" : "row"}
        spacing={isMobile && !screenshotting ? 1 : 3}
        sx={{
          mb: 2,
          "& *": screenshotting ? { fontSize: "1.5rem !important" } : {},
        }}
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
          sx={{
            width: "100%",
            border: 1,
            borderColor: "#AEAEAE",
            "& *": screenshotting ? { fontSize: "1.5rem !important" } : {},
            "& th": screenshotting
              ? { fontSize: "1.5rem !important", fontWeight: "bolder" }
              : {},
          }}
          size="small"
        >
          <TableHead>
            <TableRow sx={{ backgroundColor: "white" }}>
              <TableCell>Name</TableCell>
              <TableCell>Options</TableCell>
              <TableCell align="center">Points</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {displayTotals ? (
              <RosterTotalRows
                units={roster.warbands.flatMap((warband) => [
                  warband.hero,
                  ...warband.units,
                ])}
              />
            ) : (
              <>
                {roster.warbands.map((warband) => (
                  <WarbandRows key={warband.id} warband={warband} />
                ))}
              </>
            )}
          </TableBody>
        </Table>
      </TableContainer>

      {showArmyBonus && (
        <Box sx={screenshotting ? { "*": { fontSize: "1.5rem" } } : {}}>
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
        </Box>
      )}
      <Typography
        id="admission"
        sx={{ mt: 2, display: "none", fontSize: "1.5rem" }}
        variant="caption"
      >
        Created with MESBG List Builder (
        <a href="#">https://avcordaro.github.io/mesbg-list-builder</a>)
      </Typography>
    </>
  );
}
