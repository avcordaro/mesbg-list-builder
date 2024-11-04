import { useTheme } from "@mui/material/styles";
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
import { Pie } from "react-chartjs-2";
import { useRecentGamesState } from "../../../state/recent-games";

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

export const AllianceLevels = () => {
  const { recentGames: data } = useRecentGamesState();
  const { palette } = useTheme();

  const alliances = data.reduce(
    (acc: { [key: string]: number }, game) => {
      acc[game.alliance] = (acc[game.alliance] || 0) + 1;
      return acc;
    },
    {
      Pure: 0,
      Historical: 0,
      Convenient: 0,
      Impossible: 0,
      "Legendary Legion": 0,
    },
  );

  const allianceData = {
    labels: [
      "Pure",
      "Historical",
      "Convenient",
      "Impossible",
      "Legendary Legion",
    ],
    datasets: [
      {
        data: Object.values(alliances),
        backgroundColor: [
          palette.primary.light,
          palette.success.light,
          palette.warning.light,
          palette.error.light,
          palette.info.light,
        ],
      },
    ],
  };

  return (
    <Pie
      data={allianceData}
      options={{ responsive: true, plugins: { legend: { position: "left" } } }}
    />
  );
};
