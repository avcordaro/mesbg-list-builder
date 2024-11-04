import { useTheme } from "@mui/material/styles";
import { Pie } from "react-chartjs-2";
import { PastGame } from "../../../state/recent-games/history";

interface AllianceLevelsProps {
  data: PastGame[];
}

export const AllianceLevelsPieChart = ({ data }: AllianceLevelsProps) => {
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
      options={{
        responsive: true,
        plugins: {
          legend: { position: "bottom" },
          title: {
            display: true,
            text: "Alliance Variations",
          },
        },
      }}
    />
  );
};
