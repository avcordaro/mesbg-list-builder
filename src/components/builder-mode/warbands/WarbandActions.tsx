import CancelIcon from "@mui/icons-material/Cancel";
import ContentCopyIcon from "@mui/icons-material/ContentCopy";
import IconButton from "@mui/material/IconButton";
import Stack from "@mui/material/Stack";
import useTheme from "@mui/material/styles/useTheme";
import { useStore } from "../../../state/store.ts";
import { Warband } from "../../../types/warband.ts";

export const WarbandActions = ({ warband }: { warband: Warband }) => {
  const { duplicateWarband, deleteWarband, updateBuilderSidebar } = useStore();
  const { palette } = useTheme();

  const handleCopyWarband = () => {
    duplicateWarband(warband.id);
    updateBuilderSidebar({
      warriorSelection: false,
      heroSelection: false,
    });
  };

  const handleDeleteWarband = () => {
    deleteWarband(warband.id);
    updateBuilderSidebar({
      warriorSelection: false,
      heroSelection: false,
    });
  };

  return (
    <Stack direction="row" spacing={1} flexGrow={1} justifyContent="end">
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
    </Stack>
  );
};
