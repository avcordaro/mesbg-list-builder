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
import { PastGame } from "../../state/recent-games/history";
import { AllianceLevelsPieChart } from "./charts/AllianceLevelsPieChart.tsx";
import { ArmiesPlayedAgainstBarChart } from "./charts/ArmiesPlayedAgainstBarChart.tsx";
import { ArmiesPlayedBarChart } from "./charts/ArmiesPlayedBarChart.tsx";
import { MatchesOverTimeMixedChart } from "./charts/MatchesOverTimeMixedChart.tsx";
import { OpponentsPlayedBarChart } from "./charts/OpponentsPlayedBarChart.tsx";
import { ResultsPieChart } from "./charts/ResultsPieChart.tsx";
import { ScenariosPlayedBarChart } from "./charts/ScenariosPlayedBarChart.tsx";
import { VictoryPointsSpreadPieChart } from "./charts/VictoryPointsSpreadPieChart.tsx";

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
        <MatchesOverTimeMixedChart data={games} />
      </Grid2>
      <Grid2 size={{ sm: 12, md: 4 }}>
        <ResultsPieChart data={games} />
      </Grid2>
      <Grid2 size={{ sm: 12, md: 4 }}>
        <VictoryPointsSpreadPieChart data={games} />
      </Grid2>
      <Grid2 size={{ sm: 12, md: 4 }}>
        <AllianceLevelsPieChart data={games} />
      </Grid2>
      <Grid2 size={{ xs: 12, lg: 6 }}>
        <ArmiesPlayedBarChart data={games} />
      </Grid2>
      <Grid2 size={{ xs: 12, lg: 6 }}>
        <ArmiesPlayedAgainstBarChart data={games} />
      </Grid2>
      <Grid2 size={{ xs: 12, lg: 6 }}>
        <ScenariosPlayedBarChart data={games} />
      </Grid2>
      <Grid2 size={{ xs: 12, lg: 6 }}>
        <OpponentsPlayedBarChart data={games} />
      </Grid2>
    </Grid2>
  );
};
