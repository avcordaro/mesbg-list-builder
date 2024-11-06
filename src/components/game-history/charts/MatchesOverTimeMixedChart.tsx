import { useTheme } from "@mui/material/styles";
import { Line } from "react-chartjs-2";
import { PastGame } from "../../../state/recent-games/history";

interface MatchesOverTimeProps {
  data: PastGame[];
}

function getMonthRange(
  firstMonthOnRecord: string,
  currentDate: string,
): string[] {
  // Mapping month names to numbers
  const monthNames = [
    "Jan",
    "Feb",
    "Mar",
    "Apr",
    "May",
    "Jun",
    "Jul",
    "Aug",
    "Sept",
    "Oct",
    "Nov",
    "Dec",
  ];

  // Extract the month and year from the input strings
  const [startMonthName, startYear] = firstMonthOnRecord.split(" ");
  const [endMonthName, endYear] = currentDate.split(" ");

  // Convert month names to numerical values
  const startMonth = monthNames.indexOf(startMonthName) + 1;
  const endMonth = monthNames.indexOf(endMonthName) + 1;

  // Parse years and convert to numbers
  const startYearNum = parseInt(startYear.replace("'", ""), 10);
  const endYearNum = parseInt(endYear.replace("'", ""), 10);

  const dateArray = [];
  let month = startMonth;
  let year = startYearNum;

  // Loop through months and years until reaching the end date
  while (year < endYearNum || (year === endYearNum && month <= endMonth)) {
    const formattedMonth = monthNames[month - 1];
    dateArray.push(`${formattedMonth} '${year.toString().slice(-2)}`);

    // Move to the next month
    month++;
    if (month > 12) {
      month = 1;
      year++;
    }
  }

  return dateArray;
}

function formatDate(dateString: string): string {
  return new Date(dateString)
    .toLocaleDateString("en-UK", {
      month: "short",
      year: "2-digit",
    })
    .replace(/ /g, " '");
}

function generateInitialEmptyDataSet(data: PastGame[]) {
  const firstMonthOnRecord = formatDate(data[0].gameDate);
  const currentDate = formatDate(new Date().toISOString());

  const monthRange = getMonthRange(firstMonthOnRecord, currentDate);

  return monthRange
    .map((month) => ({ [month]: { won: 0, lost: 0, draw: 0 } }))
    .reduce((acc, currentValue) => ({ ...acc, ...currentValue }), {});
}

export const MatchesOverTimeMixedChart = ({ data }: MatchesOverTimeProps) => {
  const { palette } = useTheme();

  const barColors = [
    palette.success.light,
    palette.warning.light,
    palette.error.light,
  ];

  const sortedData = data.sort(
    (a, b) => new Date(a.gameDate).getTime() - new Date(b.gameDate).getTime(),
  );

  const wldRatiosPerDay = sortedData.reduce(
    (
      acc: { [key: string]: { won: number; lost: number; draw: number } },
      game,
    ) => {
      const key = new Date(game.gameDate)
        .toLocaleDateString("en-UK", {
          month: "short",
          year: "2-digit",
        })
        .replace(/ /g, " '");
      if (!acc[key]) {
        acc[key] = { won: 0, lost: 0, draw: 0 };
      }
      if (game.result === "Won") acc[key].won++;
      if (game.result === "Lost") acc[key].lost++;
      if (game.result === "Draw") acc[key].draw++;
      return acc;
    },
    generateInitialEmptyDataSet(sortedData),
  );

  const matchesPerDay = Object.values(wldRatiosPerDay).map(
    ({ won, lost, draw }) => won + lost + draw,
  );

  const victoryPointsData = {
    labels: Object.keys(wldRatiosPerDay),
    datasets: [
      {
        label: "Matches played",
        data: matchesPerDay,
        backgroundColor: palette.info.light,
        borderColor: palette.info.main,
        tension: 0.25,
        pointRadius: 5,
        pointBorderWidth: 2,
      },
      ...["won", "draw", "lost"].map((key, index) => {
        return {
          type: "bar",
          label: "Matches " + key,
          data: Object.values(wldRatiosPerDay).map((wld) => wld[key]),
          yAxisID: "y1",
          backgroundColor: barColors[index],
        };
      }),
    ],
  };

  return (
    <Line
      // @ts-expect-error The react-chartjs-2 has no type support for mixed charts... it does still work though.
      data={victoryPointsData}
      options={{
        responsive: true,
        plugins: {
          legend: { position: "top" },
          title: {
            display: true,
            text: "Matches played over time",
          },
        },
        scales: {
          y: {
            type: "linear",
            display: true,
            beginAtZero: true,
          },
          y1: {
            max: Math.max(...matchesPerDay),
            display: false,
            beginAtZero: true,
          },
        },
      }}
    />
  );
};
