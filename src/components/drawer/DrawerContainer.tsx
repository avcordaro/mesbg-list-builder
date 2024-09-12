import Box from "@mui/material/Box";
import Drawer from "@mui/material/Drawer";
import Typography from "@mui/material/Typography";
import { useStore } from "../../state/store.ts";
import { drawers } from "./drawers.tsx";

export const DrawerContainer = () => {
  const state = useStore();

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
        <Box
          sx={{
            borderBottom: "1px solid black",
            mb: 3,
          }}
        >
          <Typography variant="h3">{props.title}</Typography>
        </Box>
        <Box>{props.children}</Box>
      </Drawer>
    );
  });
};
