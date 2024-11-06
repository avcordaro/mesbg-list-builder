import { useTheme } from "@mui/material/styles";
import { Pie } from "react-chartjs-2";
import { PastGame } from "../../../state/recent-games/history";

interface VictoryPointsWonLostProps {
  data: PastGame[];
}

export const VictoryPointsSpreadPieChart = ({
  data,
}: VictoryPointsWonLostProps) => {
  const { palette } = useTheme();

  const victoryPoints = data
    .map((game) => [
      Number(game.victoryPoints),
      Number(game.opponentVictoryPoints ?? 0),
    ])
    .reduce(
      ([totalWon, totalLost], [won, lost]) => [
        totalWon + won,
        totalLost + lost,
      ],
      [0, 0],
    );

  const victoryPointData = {
    labels: ["Earned by you", "Lost to Opponents"],
    datasets: [
      {
        data: victoryPoints,
        backgroundColor: [palette.success.light, palette.error.light],
      },
    ],
  };

  return (
    <Pie
      data={victoryPointData}
      options={{
        responsive: true,
        plugins: {
          legend: { position: "bottom" },
          title: {
            display: true,
            text: "Victory Points Spread",
          },
        },
      }}
    />
  );
};
