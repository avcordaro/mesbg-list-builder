import { useTheme } from "@mui/material/styles";
import { Bar } from "react-chartjs-2";
import { PastGame } from "../../../state/recent-games/history";

interface ScenariosPlayedProps {
  data: PastGame[];
}

export const ScenariosPlayedBarChart = ({ data }: ScenariosPlayedProps) => {
  const { palette } = useTheme();

  const barColors = [
    palette.success.light,
    palette.warning.light,
    palette.error.light,
  ];

  const scenariosPlayed: Record<
    string,
    { won: number; lost: number; draw: number }
  > = data
    .filter((game) => !!game.scenarioPlayed)
    .flatMap((game) => ({
      scenario: game.scenarioPlayed,
      result: game.result.toLowerCase(),
    }))
    .reduce((acc, { scenario, result }) => {
      if (!acc[scenario]) {
        acc[scenario] = { won: 0, lost: 0, draw: 0 };
      }
      acc[scenario][result]++;
      return acc;
    }, {});

  const dataset = {
    labels: Object.keys(scenariosPlayed),
    datasets: ["won", "draw", "lost"].map((key, index) => ({
      label: "Matches " + key,
      data: Object.values(scenariosPlayed).map((wld) => wld[key]),
      yAxisID: "y1",
      backgroundColor: barColors[index],
    })),
  };

  return (
    <Bar
      data={dataset}
      options={{
        responsive: true,
        plugins: {
          legend: { position: "top" },
          title: {
            display: true,
            text: "Scenarios Played (with WLD)",
          },
        },
        scales: {
          y1: {
            beginAtZero: true,
            stacked: true,
            ticks: {
              stepSize: 1,
            },
          },
          x: {
            stacked: true,
          },
        },
      }}
    />
  );
};
