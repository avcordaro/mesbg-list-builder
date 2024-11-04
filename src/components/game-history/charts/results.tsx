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

export const Results = () => {
  const { recentGames: data } = useRecentGamesState();
  const { palette } = useTheme();

  const results = data.reduce(
    (acc: { [key: string]: number }, game) => {
      acc[game.result] = (acc[game.result] || 0) + 1;
      return acc;
    },
    {
      Won: 0,
      Draw: 0,
      Lost: 0,
    },
  );

  const resultData = {
    labels: ["Won", "Draw", "Lost"],
    datasets: [
      {
        data: Object.values(results),
        backgroundColor: [
          palette.success.light,
          palette.warning.light,
          palette.error.light,
        ],
      },
    ],
  };

  return (
    <Pie
      data={resultData}
      options={{
        responsive: true,
        plugins: { legend: { position: "bottom" } },
      }}
    />
  );
};
