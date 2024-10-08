import Box from "@mui/material/Box";
import IconButton from "@mui/material/IconButton";
import Stack from "@mui/material/Stack";
import Tab from "@mui/material/Tab";
import Tabs from "@mui/material/Tabs";
import { useTheme } from "@mui/material/styles";
import useMediaQuery from "@mui/material/useMediaQuery";
import { ImCross } from "react-icons/im";
import { useMesbgData } from "../../../hooks/mesbg-data.ts";
import { Tabs as TabName } from "../../../state/builder-selection";
import { useStore } from "../../../state/store.ts";
import { FactionType } from "../../../types/factions.ts";
import { FactionTypeTab } from "./FactionTypeTab.tsx";

const CloseUnitSelectorButton = () => {
  const { updateBuilderSidebar } = useStore();

  return (
    <IconButton
      onClick={() =>
        updateBuilderSidebar({
          warriorSelection: false,
        })
      }
      sx={{
        border: 1,
        borderRadius: 2,
        backgroundColor: "inherit",
        color: "grey",
      }}
    >
      <ImCross />
    </IconButton>
  );
};

function a11yProps(value: string) {
  return {
    id: `${value}-tab`,
    "aria-controls": `tabpanel-${value}`,
  };
}

export const UnitSelector = () => {
  const theme = useTheme();
  const isTablet = useMediaQuery(theme.breakpoints.down("xl"));
  const { updateBuilderSidebar, tabSelection, factionType, heroSelection } =
    useStore();
  const { factionsGroupedByType } = useMesbgData();

  const tabNames = [
    "Good Army",
    "Evil Army",
    "Good LL",
    "Evil LL",
  ] as TabName[];

  const setTabSelection = (tab: number) => {
    updateBuilderSidebar({
      tabSelection: tabNames[tab],
    });
  };

  return (
    <Stack>
      <Stack direction={isTablet ? "column-reverse" : "row"} alignItems="end">
        <Box sx={{ width: "100%" }}>
          <Tabs
            value={tabNames.indexOf(tabSelection)}
            onChange={(_, tab) => setTabSelection(tab)}
            variant="scrollable"
            scrollButtons="auto"
            allowScrollButtonsMobile
          >
            {Object.keys(factionsGroupedByType).map((type: FactionType) => (
              <Tab
                key={type}
                label={type}
                disabled={
                  !heroSelection || (factionType !== "" && factionType !== type)
                }
                {...a11yProps(type)}
              />
            ))}
          </Tabs>
        </Box>
        <Box>
          <CloseUnitSelectorButton />
        </Box>
      </Stack>
      <Box>
        {Object.keys(factionsGroupedByType).map((type: FactionType) => (
          <FactionTypeTab key={type} type={type} activeTab={tabSelection} />
        ))}
      </Box>
    </Stack>
  );
};
