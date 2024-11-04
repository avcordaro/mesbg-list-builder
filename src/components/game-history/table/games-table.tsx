import {
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
} from "@mui/material";
import Typography from "@mui/material/Typography";
import { allianceColours } from "../../../constants/alliances.ts";
import { useRecentGamesState } from "../../../state/recent-games";

export const GamesTable = () => {
  const { recentGames } = useRecentGamesState();

  const resultColours = {
    Won: "success",
    Draw: "info",
    Lost: "error",
  };

  return (
    <>
      <TableContainer component={Paper}>
        <Table>
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
              <TableCell>Armies</TableCell>
              <TableCell>Alliance</TableCell>
              <TableCell>Points</TableCell>
              <TableCell>Bows</TableCell>
              <TableCell>Game Date</TableCell>
              <TableCell>Duration (min)</TableCell>
              <TableCell>Opponent Armies</TableCell>
              <TableCell>Opponent Name</TableCell>
              <TableCell>Result</TableCell>
              <TableCell>Victory Points</TableCell>
              <TableCell>Scenario Played</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {recentGames.map((row, index) => (
              <TableRow key={index}>
                <TableCell>{row.armies}</TableCell>
                <TableCell>
                  <Typography
                    color={
                      row.alliance === "Pure"
                        ? "info"
                        : allianceColours[row.alliance]
                    }
                  >
                    {row.alliance}
                  </Typography>
                </TableCell>
                <TableCell align="center">{row.points}</TableCell>
                <TableCell align="center">{row.bows}</TableCell>
                <TableCell>{row.gameDate}</TableCell>
                <TableCell align="center">{row.duration}</TableCell>
                <TableCell>{row.opponentArmies || "-"}</TableCell>
                <TableCell>{row.opponentName || "-"}</TableCell>
                <TableCell align="center">
                  <Typography color={resultColours[row.result]}>
                    {row.result}
                  </Typography>
                </TableCell>
                <TableCell align="center">{row.victoryPoints}</TableCell>
                <TableCell>{row.scenarioPlayed}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </>
  );
};
