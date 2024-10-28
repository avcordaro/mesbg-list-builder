import { UnfoldLess, UnfoldMore } from "@mui/icons-material";
import CancelIcon from "@mui/icons-material/Cancel";
import ContentCopyIcon from "@mui/icons-material/ContentCopy";
import IconButton from "@mui/material/IconButton";
import Stack from "@mui/material/Stack";
import useTheme from "@mui/material/styles/useTheme";
import { useScrollToElement } from "../../../hooks/scroll-to.ts";
import { useRosterBuildingState } from "../../../state/roster-building";
import { Warband } from "../../../types/warband.ts";

export const WarbandActions = ({
  warband,
  collapsed,
  collapse,
}: {
  warband: Warband;
  collapsed: boolean;
  collapse: (collapsed: boolean) => void;
}) => {
  const { duplicateWarband, deleteWarband, updateBuilderSidebar } =
    useRosterBuildingState();
  const { palette } = useTheme();
  const scrollTo = useScrollToElement();

  const handleCopyWarband = () => {
    const newWarbandId = duplicateWarband(warband.id);
    updateBuilderSidebar({
      warriorSelection: false,
      heroSelection: false,
    });
    setTimeout(scrollTo, null, newWarbandId);
  };

  const handleDeleteWarband = () => {
    deleteWarband(warband.id);
    updateBuilderSidebar({
      warriorSelection: false,
      heroSelection: false,
    });
  };

  return (
    <Stack direction="row" spacing={1} justifyContent="end">
      <IconButton
        onClick={handleDeleteWarband}
        aria-label="delete"
        sx={{
          borderRadius: 2,
          color: "white",
          backgroundColor: palette.error.dark,
          "&:hover": {
            backgroundColor: palette.error.light,
          },
        }}
      >
        <CancelIcon />
      </IconButton>
      <IconButton
        onClick={handleCopyWarband}
        aria-label="delete"
        sx={{
          borderRadius: 2,
          color: "white",
          backgroundColor: palette.info.light,
          "&:hover": {
            backgroundColor: palette.info.main,
          },
        }}
      >
        <ContentCopyIcon />
      </IconButton>

      <IconButton
        onClick={() => collapse(!collapsed)}
        aria-label="colapse"
        sx={{
          borderRadius: 2,
          color: "white",
          backgroundColor: palette.grey.A400,
          "&:hover": {
            backgroundColor: palette.grey.A700,
          },
        }}
      >
        {collapsed ? <UnfoldMore /> : <UnfoldLess />}
      </IconButton>
    </Stack>
  );
};
