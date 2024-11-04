import KeyboardArrowDownIcon from "@mui/icons-material/KeyboardArrowDown";
import KeyboardArrowUpIcon from "@mui/icons-material/KeyboardArrowUp";
import {
  Collapse,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TablePagination,
  TableRow,
} from "@mui/material";
import Box from "@mui/material/Box";
import Chip from "@mui/material/Chip";
import IconButton from "@mui/material/IconButton";
import Stack from "@mui/material/Stack";
import Typography from "@mui/material/Typography";
import { ChangeEvent, FunctionComponent, useMemo, useState } from "react";
import { PastGame } from "../../../state/recent-games/history";

const resultColours = {
  Won: "success",
  Draw: "info",
  Lost: "error",
};

const MatchRow: FunctionComponent<{ row: PastGame }> = ({ row }) => {
  const [open, setOpen] = useState(false);

  return (
    <>
      <TableRow sx={{ "& > *": { borderBottom: "unset !important" } }}>
        <TableCell>
          <IconButton
            aria-label="expand row"
            size="small"
            onClick={() => setOpen(!open)}
          >
            {open ? <KeyboardArrowUpIcon /> : <KeyboardArrowDownIcon />}
          </IconButton>
        </TableCell>
        <TableCell>
          {new Date(row.gameDate).toLocaleDateString("en-UK", {
            day: "2-digit",
            month: "long",
            year: "numeric",
          })}
        </TableCell>
        <TableCell>{row.armies}</TableCell>
        <TableCell>{row.points}</TableCell>
        <TableCell>
          {row.opponentName || (
            <small>
              <i>Unknown</i>
            </small>
          )}
        </TableCell>
        <TableCell>
          <Typography color={resultColours[row.result]}>
            {row.result}
          </Typography>
        </TableCell>
        <TableCell>
          <Typography color={resultColours[row.result]}>
            {row.victoryPoints}/{row.opponentVictoryPoints || "-"}
          </Typography>
        </TableCell>
      </TableRow>
      <TableRow>
        <TableCell style={{ paddingBottom: 0, paddingTop: 0 }} colSpan={7}>
          <Collapse in={open} timeout="auto" unmountOnExit>
            <Stack sx={{ margin: 1 }} gap={1}>
              {row.tags?.length > 0 && (
                <Stack direction="row" gap={1} alignItems="center">
                  <Typography>Tags: </Typography>
                  {row.tags?.map((tag) => <Chip key={tag} label={tag} />)}
                </Stack>
              )}

              <Table size="small" aria-label="purchases">
                <Typography
                  component="caption"
                  style={{
                    captionSide: "top",
                    textAlign: "left",
                    padding: "0px",
                  }}
                >
                  Additional Match information:
                </Typography>

                <TableHead>
                  <TableRow
                    sx={{ "& > *": { borderBottom: "unset !important" } }}
                  >
                    <TableCell>Game duration</TableCell>
                    <TableCell>Alliance level</TableCell>
                    <TableCell>Bows</TableCell>
                    <TableCell>Scenario</TableCell>
                    <TableCell>Opponents armies</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  <TableRow
                    sx={{ "& > *": { borderBottom: "unset !important" } }}
                  >
                    <TableCell>
                      {row.duration && <>{row.duration} minutes</>}
                    </TableCell>
                    <TableCell>{row.alliance}</TableCell>
                    <TableCell>{row.bows || "0"}</TableCell>
                    <TableCell>{row.scenarioPlayed}</TableCell>
                    <TableCell>
                      {row.opponentArmies || (
                        <small>
                          <i>Unknown</i>
                        </small>
                      )}
                    </TableCell>
                  </TableRow>
                </TableBody>
              </Table>
            </Stack>
          </Collapse>
        </TableCell>
      </TableRow>
    </>
  );
};

interface GamesTableProps {
  games: PastGame[];
}

export const GamesTable = ({ games }: GamesTableProps) => {
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(5);

  const handleChangePage = (_: unknown, newPage: number) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event: ChangeEvent<HTMLInputElement>) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  // Avoid a layout jump when reaching the last page with empty rows.
  const emptyRows =
    page > 0 ? Math.max(0, (1 + page) * rowsPerPage - games.length) : 0;

  const visibleRows = useMemo(
    () =>
      [...games]
        .sort(
          (a, b) =>
            new Date(b.gameDate).getTime() - new Date(a.gameDate).getTime(),
        )
        .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage),
    [page, rowsPerPage, games],
  );

  return (
    <Box sx={{ width: "100%", mb: 2 }}>
      <TableContainer component={Paper}>
        <Table size="small">
          <Typography
            component="caption"
            style={{
              captionSide: "top",
              textAlign: "left",
              padding: "10px",
              fontSize: "1.2em",
              fontWeight: "bold",
            }}
          >
            Game Results Table
          </Typography>
          <TableHead>
            <TableRow>
              <TableCell />
              <TableCell>Game date</TableCell>
              <TableCell>Armies played</TableCell>
              <TableCell>Points</TableCell>
              <TableCell>Opponent</TableCell>
              <TableCell>Result</TableCell>
              <TableCell>Victory Points</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {visibleRows.map((row, index) => (
              <MatchRow key={index} row={row} />
            ))}
            {emptyRows > 0 && (
              <TableRow
                style={{
                  height: 50 * emptyRows,
                }}
              >
                <TableCell colSpan={6} />
              </TableRow>
            )}
          </TableBody>
        </Table>
      </TableContainer>
      <TablePagination
        rowsPerPageOptions={[5, 10, 25]}
        component="div"
        count={games.length}
        rowsPerPage={rowsPerPage}
        page={page}
        onPageChange={handleChangePage}
        onRowsPerPageChange={handleChangeRowsPerPage}
      />
    </Box>
  );
};
