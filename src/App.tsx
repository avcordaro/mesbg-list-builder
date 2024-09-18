import { Container, Grid2 } from "@mui/material";
import { useTheme } from "@mui/material/styles";
import useMediaQuery from "@mui/material/useMediaQuery";
import { useEffect, useState } from "react";
import { Alerts } from "./components/alerts/Alerts";
import { BuilderMode } from "./components/builder-mode/BuilderMode.tsx";
import { AppContainer } from "./components/common/layout/AppContainer.tsx";
import { Sidebar } from "./components/common/sidebar/Sidebar.tsx";
import { DrawerContainer } from "./components/drawer/DrawerContainer.tsx";
import { GameMode } from "./components/gamemode/GameMode.tsx";
import { ModalContainer } from "./components/modal/ModalContainer";
import { useStore } from "./state/store";

export const App = () => {
  const { gameMode } = useStore();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("lg"));

  const [rosterTotalsBarHeight, setRosterTotalsBarHeight] = useState(64);

  useEffect(() => {
    const y: number =
      document.getElementById("roster-totals")?.getBoundingClientRect()
        ?.height || 64;
    setRosterTotalsBarHeight(y);
  }, []);

  return (
    <AppContainer>
      <Container maxWidth={false} fixed sx={{ p: 2 }}>
        <Alerts />
        <main>
          <Grid2 container spacing={2}>
            <Grid2
              size={!isMobile ? 4 : 12}
              sx={
                isMobile
                  ? {}
                  : {
                      position: "sticky",
                      top: rosterTotalsBarHeight + 16,
                      height: "100%",
                      overflow: "auto",
                      scrollbarWidth: "thin",
                    }
              }
            >
              <Sidebar />
            </Grid2>
            <Grid2 size={!isMobile ? 8 : 12}>
              {gameMode ? <GameMode /> : <BuilderMode />}
            </Grid2>
          </Grid2>
        </main>
        <aside>
          <DrawerContainer />
          <ModalContainer />
        </aside>
      </Container>
    </AppContainer>
  );
};
