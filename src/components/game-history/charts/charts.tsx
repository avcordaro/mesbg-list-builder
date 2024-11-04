import { Grid2 } from "@mui/material";
import {
  ArcElement,
  BarElement,
  CategoryScale,
  Chart as ChartJS,
  Legend,
  LinearScale,
  Title,
  Tooltip,
} from "chart.js";
import { AllianceLevels } from "./alliance-levels.tsx";
import { Results } from "./results.tsx";
import { VictoryPoints } from "./victory-points.tsx";

// Register the components we need from Chart.js
ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
  ArcElement,
);

export const Charts = () => {
  return (
    <Grid2 container spacing={5} alignItems="center" justifyContent="center">
      <Grid2 size={3}>
        <AllianceLevels />
      </Grid2>
      <Grid2 size={3}>
        <Results />
      </Grid2>
      <Grid2 size={4}>
        <VictoryPoints />
      </Grid2>
    </Grid2>
  );
};
