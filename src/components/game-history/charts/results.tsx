import { useTheme } from "@mui/material/styles";
import { Pie } from "react-chartjs-2";
import { PastGame } from "../../../state/recent-games/history";

interface ResultsProps {
  data: PastGame[];
}

export const Results = ({ data }: ResultsProps) => {
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
        plugins: {
          legend: { position: "bottom" },
          title: {
            display: true,
            text: "WLD Ratio",
          },
        },
      }}
    />
  );
};
