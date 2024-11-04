import { useTheme } from "@mui/material/styles";
import { Bar } from "react-chartjs-2";
import { PastGame } from "../../../state/recent-games/history";

interface OpponentsPlayedProps {
  data: PastGame[];
}

export const OpponentsPlayed = ({ data }: OpponentsPlayedProps) => {
  const { palette } = useTheme();

  const barColors = [
    palette.success.light,
    palette.warning.light,
    palette.error.light,
  ];

  const opponentsPlayed: Record<
    string,
    { won: number; lost: number; draw: number }
  > = data
    .filter((game) => !!game.opponentName)
    .flatMap((game) => ({
      opponent: game.opponentName,
      result: game.result.toLowerCase(),
    }))
    .reduce((acc, { opponent, result }) => {
      if (!acc[opponent]) {
        acc[opponent] = { won: 0, lost: 0, draw: 0 };
      }
      acc[opponent][result]++;
      return acc;
    }, {});

  const dataset = {
    labels: Object.keys(opponentsPlayed),
    datasets: ["won", "draw", "lost"].map((key, index) => ({
      label: "Matches " + key,
      data: Object.values(opponentsPlayed).map((wld) => wld[key]),
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
            text: "Opponents Played (with WLD)",
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
