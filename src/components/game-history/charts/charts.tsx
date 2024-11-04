import { Grid2 } from "@mui/material";
import {
  ArcElement,
  BarElement,
  CategoryScale,
  Chart as ChartJS,
  Legend,
  LinearScale,
  LineElement,
  PointElement,
  Title,
  Tooltip,
} from "chart.js";
import { PastGame } from "../../../state/recent-games/history";
import { AllianceLevels } from "./alliance-levels.tsx";
import { ArmiesPlayedAgainst } from "./armies-played-against.tsx";
import { ArmiesPlayed } from "./armies-played.tsx";
import { MatchesOverTime } from "./matches-over-time.tsx";
import { OpponentsPlayed } from "./opponents-played.tsx";
import { Results } from "./results.tsx";
import { ScenariosPlayed } from "./scenarios-played.tsx";
import { VictoryPointsWonLost } from "./victory-points.tsx";

// Register the components we need from Chart.js
ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  ArcElement,
  PointElement,
);

interface ChartsProps {
  games: PastGame[];
}

export const Charts = ({ games }: ChartsProps) => {
  return (
    <Grid2 container spacing={6} alignItems="center" justifyContent="center">
      <Grid2 size={12}>
        <MatchesOverTime data={games} />
      </Grid2>
      <Grid2 size={{ sm: 12, md: 4 }}>
        <Results data={games} />
      </Grid2>
      <Grid2 size={{ sm: 12, md: 4 }}>
        <VictoryPointsWonLost data={games} />
      </Grid2>
      <Grid2 size={{ sm: 12, md: 4 }}>
        <AllianceLevels data={games} />
      </Grid2>
      <Grid2 size={{ xs: 12, lg: 6 }}>
        <ArmiesPlayed data={games} />
      </Grid2>
      <Grid2 size={{ xs: 12, lg: 6 }}>
        <ArmiesPlayedAgainst data={games} />
      </Grid2>
      <Grid2 size={{ xs: 12, lg: 6 }}>
        <ScenariosPlayed data={games} />
      </Grid2>
      <Grid2 size={{ xs: 12, lg: 6 }}>
        <OpponentsPlayed data={games} />
      </Grid2>
    </Grid2>
  );
};
