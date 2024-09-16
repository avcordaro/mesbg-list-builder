import SearchIcon from "@mui/icons-material/Search";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import Stack from "@mui/material/Stack";
import Typography from "@mui/material/Typography";
import useTheme from "@mui/material/styles/useTheme";
import useMediaQuery from "@mui/material/useMediaQuery";
import { FunctionComponent, PropsWithChildren, ReactNode } from "react";
import { useStore } from "../../../state/store.ts";
import { DrawerTypes } from "../../drawer/drawers.tsx";

type SidebarContainerProps = {
  title: string;
  icon: ReactNode;
};

export const SidebarContainer: FunctionComponent<
  PropsWithChildren<SidebarContainerProps>
> = ({ title, icon, children }) => {
  const { openSidebar } = useStore();
  const { palette, breakpoints } = useTheme();
  const isTablet = useMediaQuery(breakpoints.down("lg"));
  const isMobile = useMediaQuery(breakpoints.down("sm"));
  const isLargeScreen = useMediaQuery(breakpoints.between("lg", "xl"));

  const shouldWrapButtons = isMobile || isLargeScreen;

  return (
    <Stack
      sx={{
        p: 2,
        border: 2,
        borderColor: palette.grey.A400,
        borderRadius: 2,
        minHeight: isTablet ? "" : "70vh",
      }}
    >
      <Stack direction={shouldWrapButtons ? "column" : "row"} sx={{ mb: 2 }}>
        <Typography variant="h5" component="span" flexGrow={1}>
          <b>
            {icon} {title}
          </b>
        </Typography>
        <Button
          variant="outlined"
          color="inherit"
          sx={{
            mt: isMobile ? 1 : "auto",
          }}
          onClick={() => openSidebar(DrawerTypes.KEYWORD_SEARCH)}
          startIcon={<SearchIcon />}
        >
          Search Keywords
        </Button>
      </Stack>
      <Box>{children}</Box>
    </Stack>
  );
};
