import { useTheme } from "@mui/material/styles";
import { Bar } from "react-chartjs-2";
import { PastGame } from "../../../state/recent-games/history";

interface OpponentsPlayedProps {
  data: PastGame[];
}

export const OpponentsVictoryPointsBarChart = ({
  data,
}: OpponentsPlayedProps) => {
  const { palette } = useTheme();

  const barColors = [palette.success.light, palette.error.light];

  const opponentsPlayed: Record<string, { earned: number; lost: number }> = data
    .filter((game) => !!game.opponentName)
    .flatMap((game) => ({
      opponent: game.opponentName,
      result: [Number(game.victoryPoints), Number(game.opponentVictoryPoints)],
    }))
    .reduce((acc, { opponent, result: [earned, lost] }) => {
      if (!acc[opponent]) {
        acc[opponent] = { earned: 0, lost: 0 };
      }
      acc[opponent].earned += earned;
      acc[opponent].lost += lost;
      return acc;
    }, {});

  const dataset = {
    labels: Object.keys(opponentsPlayed),
    datasets: ["earned", "lost"].map((key, index) => ({
      label: "VP's " + key,
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
            text: "Victory Point spread per Opponent",
          },
        },
        scales: {
          y1: {
            beginAtZero: true,
            ticks: {
              stepSize: 1,
            },
          },
        },
      }}
    />
  );
};
