import Stack from "@mui/material/Stack";
import { useState } from "react";
import { useRecentGamesState } from "../../state/recent-games";
import { Charts } from "./Charts.tsx";
import { FilterForm, Filters } from "./FilterForm.tsx";
import { GamesTable } from "./GamesTable.tsx";

export const SavedGameResults = () => {
  const { recentGames } = useRecentGamesState();
  const [filteredGames, setFilteredGames] = useState(recentGames);

  const onFilterChanged = (filters: Filters) => {
    setFilteredGames(
      recentGames.filter((game) => {
        const matchesArmy = game.armies.includes(filters.army || "");
        const matchesOpponent =
          game.opponentName?.includes(filters.opponent || "") ?? true;
        const matchesOpponentArmy =
          game.opponentArmies?.includes(filters.opponentArmy || "") ?? true;
        const matchesResult = game.result.includes(filters.result || "");
        const matchesTag =
          !filters.tag ||
          game.tags?.some((tag) => tag.includes(filters.tag || ""));
        const matchesScenario =
          game.scenarioPlayed?.includes(filters.scenario || "") ?? true;

        return (
          matchesArmy &&
          matchesOpponent &&
          matchesOpponentArmy &&
          matchesResult &&
          matchesTag &&
          matchesScenario
        );
      }),
    );
  };

  return (
    <Stack sx={{ py: 1 }} gap={3}>
      <FilterForm onChange={onFilterChanged} />
      <GamesTable games={filteredGames} />
      <Charts games={filteredGames} />
    </Stack>
  );
};
