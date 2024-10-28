import Box from "@mui/material/Box";
import Stack from "@mui/material/Stack";
import Typography from "@mui/material/Typography";
import useTheme from "@mui/material/styles/useTheme";
import useMediaQuery from "@mui/material/useMediaQuery";
import { FunctionComponent, PropsWithChildren, ReactNode } from "react";

type SidebarContainerProps = {
  title: string;
  icon: ReactNode;
};

export const SidebarContainer: FunctionComponent<
  PropsWithChildren<SidebarContainerProps>
> = ({ title, icon, children }) => {
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
      <Stack direction={shouldWrapButtons ? "column" : "row"} sx={{ mb: 1 }}>
        <Typography
          variant="h5"
          component="span"
          flexGrow={1}
          sx={{
            display: "flex",
            alignItems: "center",
            gap: 1,
          }}
        >
          {icon}
          <b>{title}</b>
        </Typography>
      </Stack>
      <Box sx={{ py: 1 }}>{children}</Box>
    </Stack>
  );
};
