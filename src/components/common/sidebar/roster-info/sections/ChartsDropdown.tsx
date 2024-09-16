import Button from "@mui/material/Button";
import Menu from "@mui/material/Menu";
import MenuItem from "@mui/material/MenuItem";
import { MouseEvent, useState } from "react";
import { GiSwordsEmblem } from "react-icons/gi";
import { useStore } from "../../../../../state/store.ts";
import { ModalTypes } from "../../../../modal/modals.tsx";

const charts: Record<string, string> = {
  "climb-table": "Climb Table",
  "detonation-table": "Detonation Table",
  "gates-doors-sieges": "Gates and Doors (Sieges)",
  "in-the-way-chart": "In The Way Chart",
  "jump-table": "Jump Table",
  "leap-table": "Leap Table",
  "missile-weapon-chart": "Missile Weapon Chart",
  "scatter-table": "Scatter Table",
  "sentry-chart": "Sentry chart",
  "swim-chart": "Swim chart",
  "siege-target-types": "Siege Target Types",
  "thrown-rider-table": "Thrown Rider Table",
  "to-wound-chart": "To Wound Chart",
};

export const ChartsDropdown = () => {
  const { setCurrentModal } = useStore();

  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const open = Boolean(anchorEl);

  const handleClick = (event: MouseEvent<HTMLButtonElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const openChart = (selectedChart: keyof typeof charts) => () => {
    setCurrentModal(ModalTypes.CHART, {
      selectedChart,
      title: charts[selectedChart],
    });
    setAnchorEl(null);
  };

  return (
    <>
      <Button
        variant="outlined"
        color="inherit"
        id="basic-button"
        aria-controls={open ? "basic-menu" : undefined}
        aria-haspopup="true"
        aria-expanded={open ? "true" : undefined}
        onClick={handleClick}
        startIcon={<GiSwordsEmblem />}
      >
        Charts
      </Button>
      <Menu
        id="basic-menu"
        anchorEl={anchorEl}
        open={open}
        onClose={() => setAnchorEl(null)}
        MenuListProps={{
          "aria-labelledby": "basic-button",
        }}
      >
        {Object.entries(charts).map(([fileName, chartName]) => (
          <MenuItem key={fileName} onClick={openChart(fileName)}>
            {chartName}
          </MenuItem>
        ))}
      </Menu>
    </>
  );
};
