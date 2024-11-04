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
import { Bar } from "react-chartjs-2";
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

export const VictoryPoints = () => {
  const { recentGames: data } = useRecentGamesState();

  const victoryPointsData = {
    labels: data.map((game) => game.gameDate),
    datasets: [
      {
        label: "Victory Points",
        data: data.map((game) => game.victoryPoints),
        backgroundColor: "rgba(75, 192, 192, 0.5)",
        borderColor: "rgba(75, 192, 192, 1)",
        borderWidth: 1,
      },
    ],
  };

  return (
    <Bar
      data={victoryPointsData}
      options={{ responsive: true, plugins: { legend: { position: "top" } } }}
    />
  );
};
