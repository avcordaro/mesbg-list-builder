import Stack from "@mui/material/Stack";
import { Charts } from "./charts/charts.tsx";
import { GamesTable } from "./table/games-table.tsx";

export const SavedGameResults = () => {
  return (
    <Stack sx={{ py: 1 }} gap={5}>
      <GamesTable />

      <Charts />
    </Stack>
  );
};
