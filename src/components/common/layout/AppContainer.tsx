import Box from "@mui/material/Box";
import Stack from "@mui/material/Stack";
import { FunctionComponent, PropsWithChildren } from "react";
import { Footer } from "./Footer.tsx";
import { Header } from "./Header.tsx";

export const AppContainer: FunctionComponent<PropsWithChildren> = ({
  children,
}) => {
  return (
    <Stack sx={{ height: "100vh" }}>
      <Box flexGrow={1}>
        <Header />
        {children}
      </Box>
      <Footer />
    </Stack>
  );
};
