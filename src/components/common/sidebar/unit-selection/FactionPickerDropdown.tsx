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
import { FunctionComponent } from "react";
import { useMesbgData } from "../../../../hooks/mesbg-data.ts";
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
    factionSelection,
    updateBuilderSidebar,
    heroSelection,
    factionType: currentlySelectedFactionType,
  } = useStore();
  const theme = useTheme();

  const selectFaction = (faction: Faction) => {
    updateBuilderSidebar({
      factionSelection: {
        ...factionSelection,
        [type]: faction,
      },
    });
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
            <MenuItem key={name} value={name}>
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
