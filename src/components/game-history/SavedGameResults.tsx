import { Add, UploadFile } from "@mui/icons-material";
import SaveIcon from "@mui/icons-material/Save";
import { SpeedDial, SpeedDialAction, SpeedDialIcon } from "@mui/material";
import Box from "@mui/material/Box";
import Stack from "@mui/material/Stack";
import { useEffect, useRef, useState } from "react";
import { useRecentGamesState } from "../../state/recent-games";
import { PastGame } from "../../state/recent-games/history";
import { Charts } from "./Charts.tsx";
import { FilterForm, Filters } from "./FilterForm.tsx";
import { GamesTable } from "./GamesTable.tsx";

export const SavedGameResults = () => {
  const { recentGames } = useRecentGamesState();
  const [filteredGames, setFilteredGames] = useState(recentGames);
  const speedDialRef = useRef<HTMLDivElement | null>(null);
  const [fabBottom, setFabBottom] = useState("16px");
  const [fabOpen, setFabOpen] = useState(false);
  const [filters, setFilters] = useState<Filters>({
    army: "",
    scenario: "",
    opponent: "",
    opponentArmy: "",
    result: "",
    tag: "",
  });
  // const { setCurrentModal } = useAppState();

  const actions = [
    {
      icon: <Add />,
      name: "Add game manually",
      callback: () => console.log("Add game manually"),
      disabled: false,
    },
    {
      icon: <SaveIcon />,
      name: "Export history",
      callback: () => console.log("Export game history"),
      disabled: recentGames.length === 0,
    },
    {
      icon: <UploadFile />,
      name: "Import history",
      callback: () => console.log("Import game history"),
      disabled: false,
    },
  ];

  function matchesFilter(game: PastGame, filters: Filters) {
    const matchesArmy = game.armies.includes(filters.army || "");
    const matchesOpponent =
      game.opponentName?.includes(filters.opponent || "") ?? true;
    const matchesOpponentArmy =
      game.opponentArmies?.includes(filters.opponentArmy || "") ?? true;
    const matchesResult = game.result.includes(filters.result || "");
    const matchesTag =
      !filters.tag || game.tags?.some((tag) => tag.includes(filters.tag || ""));
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
  }

  const onFilterChanged = (filters: Filters) => {
    setFilters(filters);
  };

  const updateFabBottom = () => {
    const footerRect = document
      .getElementById("footer")
      ?.getBoundingClientRect();

    setFabBottom(`${Math.max(16, window.innerHeight - footerRect.top + 16)}px`);
  };

  useEffect(() => updateFabBottom());

  useEffect(() => {
    window.addEventListener("resize", updateFabBottom);
    window.addEventListener("scroll", updateFabBottom);
    return () => {
      window.removeEventListener("resize", updateFabBottom);
      window.removeEventListener("scroll", updateFabBottom);
    };
  }, []);

  useEffect(() => {
    setFilteredGames(
      recentGames.filter((game) => matchesFilter(game, filters)),
    );
  }, [filters, recentGames]);

  return (
    <Stack sx={{ py: 1 }} gap={3}>
      <FilterForm onChange={onFilterChanged} />
      <GamesTable games={filteredGames} />
      <Charts games={filteredGames} />
      <Box ref={speedDialRef}>
        <SpeedDial
          ariaLabel="action-buttons"
          sx={{ position: "fixed", bottom: fabBottom, right: 16 }}
          icon={<SpeedDialIcon />}
          open={fabOpen}
          onClick={() => setFabOpen((x) => !x)}
          onClose={null}
        >
          {actions.map((action) => (
            <SpeedDialAction
              key={action.name}
              icon={action.icon}
              onClick={() => {
                if (!action.disabled) action.callback();
              }}
              FabProps={{ disabled: action.disabled }}
              tooltipTitle={
                <span style={{ whiteSpace: "nowrap" }}> {action.name} </span>
              }
              tooltipOpen
            />
          ))}
        </SpeedDial>
      </Box>
    </Stack>
  );
};
