import {
  FormControl,
  MenuItem,
  OutlinedInput,
  Select,
  SelectChangeEvent,
} from "@mui/material";
import Stack from "@mui/material/Stack";
import Typography from "@mui/material/Typography";
import { useTheme } from "@mui/material/styles";
import useMediaQuery from "@mui/material/useMediaQuery";
import { FunctionComponent } from "react";
import { AllianceLevel } from "../../../../constants/alliances.ts";
import { useMesbgData } from "../../../../hooks/mesbg-data.ts";
import { getAllianceLevel } from "../../../../state/roster/calculations";
import { useStore } from "../../../../state/store.ts";
import { Faction, FactionType } from "../../../../types/factions.ts";
import { FactionLogo } from "../../images/FactionLogo.tsx";

type FactionPickerDropdownProps = {
  type: FactionType;
};

export const FactionPickerDropdown: FunctionComponent<
  FactionPickerDropdownProps
> = ({ type }) => {
  const { getFactionsOfType } = useMesbgData();
  const {
    factions,
    factionSelection,
    updateBuilderSidebar,
    heroSelection,
    factionType: currentlySelectedFactionType,
  } = useStore();
  const theme = useTheme();
  const isLaptopOrBigger = useMediaQuery(theme.breakpoints.up("lg"));

  const selectFaction = (faction: Faction) => {
    updateBuilderSidebar({
      factionSelection: {
        ...factionSelection,
        [type]: faction,
      },
    });
  };

  const getFactionColor = (faction: Faction) => {
    if (factions.length === 0) return "black";

    const selectionIncludingFaction = [...new Set([...factions, faction])];
    const allianceLevel: AllianceLevel = getAllianceLevel(
      selectionIncludingFaction,
    );
    switch (allianceLevel) {
      case "Historical":
        return theme.palette.success.main;
      case "Convenient":
        return theme.palette.warning.light;
      case "Impossible":
        return theme.palette.error.main;
      default:
        return "black";
    }
  };

  return (
    <FormControl sx={{ mt: 1 }}>
      <Select
        value={factionSelection[type]}
        variant="filled"
        onChange={(event: SelectChangeEvent<Faction>) =>
          selectFaction(event.target.value as Faction)
        }
        input={
          <OutlinedInput
            fullWidth
            size="small"
            sx={{
              backgroundColor: theme.palette.primary.main,
              color: theme.palette.primary.contrastText,
              "& p": { width: "100%", textAlign: "center" },
              "& .MuiAvatar-root": { display: "none" },
            }}
          />
        }
        disabled={!heroSelection || currentlySelectedFactionType.includes("LL")}
      >
        {getFactionsOfType(type)
          .sort()
          .map((name) => (
            <MenuItem
              key={name}
              value={name}
              dense={isLaptopOrBigger}
              sx={{ color: getFactionColor(name) }}
            >
              <Stack direction="row" spacing={1}>
                <FactionLogo faction={name} />
                <Typography>{name}</Typography>
              </Stack>
            </MenuItem>
          ))}
      </Select>
    </FormControl>
  );
};
