import { Autocomplete, TextField } from "@mui/material";
import Stack from "@mui/material/Stack";
import Typography from "@mui/material/Typography";
import { useTheme } from "@mui/material/styles";
import useMediaQuery from "@mui/material/useMediaQuery";
import { FunctionComponent, useState } from "react";
import { useRecentGamesState } from "../../state/recent-games";

export type Filters = {
  army: string;
  opponent: string;
  opponentArmy: string;
  result: string;
  tag: string;
  scenario: string;
};

export type FilterFormProps = {
  onChange: (filters: Filters) => void;
};

export const FilterForm: FunctionComponent<FilterFormProps> = ({
  onChange,
}) => {
  const { recentGames } = useRecentGamesState();
  const theme = useTheme();
  const isTablet = useMediaQuery(theme.breakpoints.down("lg"));
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));

  const [filters, setFilters] = useState<Filters>({
    army: "",
    scenario: "",
    opponent: "",
    opponentArmy: "",
    result: "",
    tag: "",
  });

  const handleChangeFilter = (name: keyof Filters, value: string) => {
    const updatedFilters = {
      ...filters,
      [name]: value,
    };
    setFilters(updatedFilters);
    onChange(updatedFilters);
  };

  const armyOptions = [
    ...new Set(
      recentGames.flatMap(
        (game) => game.armies.split(",").map((s) => s.trim()) || [],
      ),
    ),
  ];
  const opponentOptions = [
    ...new Set(recentGames.flatMap((game) => game.opponentName || [])),
  ];
  const opponentArmyOptions = [
    ...new Set(
      recentGames.flatMap(
        (game) => game.opponentArmies?.split(",").map((s) => s.trim()) || [],
      ),
    ),
  ];
  const tagOptions = [
    ...new Set(recentGames.flatMap((game) => game.tags || [])),
  ];
  const scenarioOptions = [
    ...new Set(
      recentGames.map((game) => game.scenarioPlayed).filter((s) => !!s),
    ),
  ];

  return (
    <Stack gap={1} sx={{ width: "100%" }}>
      <Typography variant="body2">Filter matches:</Typography>
      <Stack
        direction={isTablet ? "column" : "row"}
        gap={1}
        sx={{ width: "100%" }}
      >
        <Stack
          direction={isMobile ? "column" : "row"}
          gap={1}
          sx={{ width: "100%" }}
        >
          <Autocomplete
            disablePortal
            options={armyOptions}
            sx={{ minWidth: "calc(100% / 3 - 8px)" }}
            renderInput={(params) => (
              <TextField {...params} label="Army" size="small" />
            )}
            onChange={(_, value) => handleChangeFilter("army", value)}
          />
          <Autocomplete
            disablePortal
            options={opponentOptions}
            sx={{ minWidth: "calc(100% / 3 - 8px)" }}
            renderInput={(params) => (
              <TextField {...params} label="Opponent" size="small" />
            )}
            onChange={(_, value) => handleChangeFilter("opponent", value)}
          />
          <Autocomplete
            disablePortal
            options={opponentArmyOptions}
            sx={{ minWidth: "calc(100% / 3 - 8px)" }}
            renderInput={(params) => (
              <TextField {...params} label="Opponent Army" size="small" />
            )}
            onChange={(_, value) => handleChangeFilter("opponentArmy", value)}
          />
        </Stack>
        <Stack
          direction={isMobile ? "column" : "row"}
          gap={1}
          sx={{ width: "100%" }}
        >
          <Autocomplete
            disablePortal
            options={["Won", "Lost", "Draw"]}
            sx={{ minWidth: "calc(100% / 3 - 8px)" }}
            renderInput={(params) => (
              <TextField {...params} label="Result" size="small" />
            )}
            onChange={(_, value) => handleChangeFilter("result", value)}
          />
          <Autocomplete
            disablePortal
            options={tagOptions}
            sx={{ minWidth: "calc(100% / 3 - 8px)" }}
            renderInput={(params) => (
              <TextField {...params} label="Tag" size="small" />
            )}
            onChange={(_, value) => handleChangeFilter("tag", value)}
          />
          <Autocomplete
            disablePortal
            options={scenarioOptions}
            sx={{ minWidth: "calc(100% / 3 - 8px)" }}
            renderInput={(params) => (
              <TextField {...params} label="Scenario" size="small" />
            )}
            onChange={(_, value) => handleChangeFilter("scenario", value)}
          />
        </Stack>
      </Stack>
    </Stack>
  );
};
