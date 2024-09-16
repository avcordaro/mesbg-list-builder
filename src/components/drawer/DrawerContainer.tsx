import CloseIcon from "@mui/icons-material/Close";
import Box from "@mui/material/Box";
import Drawer from "@mui/material/Drawer";
import IconButton from "@mui/material/IconButton";
import Stack from "@mui/material/Stack";
import Typography from "@mui/material/Typography";
import { useTheme } from "@mui/material/styles";
import { useStore } from "../../state/store.ts";
import { drawers } from "./drawers.tsx";

export const DrawerContainer = () => {
  const state = useStore();
  const { palette } = useTheme();

  return [...drawers.entries()].map(([type, props]) => {
    return (
      <Drawer
        key={type}
        open={type === state.currentlyOpenendSidebar}
        onClose={() => state.closeSidebar()}
        PaperProps={{
          sx: {
            maxWidth: "72ch",
            p: 2,
          },
        }}
      >
        <Stack
          direction="row"
          sx={{
            borderBottom: "1px solid black",
            mb: 3,
            pb: 1,
          }}
          justifyContent="center"
          alignItems="start"
        >
          <Box flexGrow={1}>
            <Typography variant="h5">{props.title}</Typography>
          </Box>
          <IconButton
            onClick={() => state.closeSidebar()}
            sx={{
              borderRadius: 2,
              backgroundColor: palette.primary.light,
              color: palette.primary.contrastText,
              "&:hover": {
                backgroundColor: palette.primary.main,
              },
            }}
          >
            <CloseIcon />
          </IconButton>
        </Stack>
        <Box>{props.children}</Box>
      </Drawer>
    );
  });
};
