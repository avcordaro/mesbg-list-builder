import { AlertTitle, Container, Grid2, Skeleton } from "@mui/material";
import Alert from "@mui/material/Alert";
import Box from "@mui/material/Box";
import Stack from "@mui/material/Stack";
import { useTheme } from "@mui/material/styles";
import useMediaQuery from "@mui/material/useMediaQuery";
import { useEffect, useState } from "react";
import { Alerts } from "./components/alerts/Alerts";
import { BuilderMode } from "./components/builder-mode/BuilderMode.tsx";
import { AppContainer } from "./components/common/layout/AppContainer.tsx";
import { Sidebar } from "./components/common/sidebar/Sidebar.tsx";
import { DrawerContainer } from "./components/drawer/DrawerContainer.tsx";
import { SavedGameResults } from "./components/game-history/SavedGameResults.tsx";
import { GameMode } from "./components/gamemode/GameMode.tsx";
import { ModalContainer } from "./components/modal/ModalContainer";
import { ModalTypes } from "./components/modal/modals.tsx";
import { useAppState } from "./state/app";
import { useGameModeState } from "./state/gamemode";
import { useUserPreferences } from "./state/preference";
import { useRecentGamesState } from "./state/recent-games";
import { useRosterBuildingState } from "./state/roster-building";
import { useCurrentRosterState, useSavedRostersState } from "./state/rosters";

export const App = () => {
  const { gameMode, initializeGameState } = useGameModeState();
  const { showHistory } = useRecentGamesState();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("lg"));
  const { setCurrentModal } = useAppState();

  const { activeRoster, setActiveRoster } = useCurrentRosterState();
  const { storageNoticeActive, dismissStorageNotice } = useUserPreferences();
  const { lastOpenedRoster } = useSavedRostersState();
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    if (activeRoster === null) {
      setActiveRoster(lastOpenedRoster);
    }
    if (activeRoster !== null) {
      setLoaded(false);
      useRosterBuildingState.persist.setOptions({
        name: "mlb-builder-" + activeRoster.replaceAll(" ", "_"),
      });
      useGameModeState.persist.setOptions({
        name: "mlb-gamestate-" + activeRoster.replaceAll(" ", "_"),
      });
      Promise.all([
        useRosterBuildingState.persist.rehydrate(),
        useGameModeState.persist.rehydrate(),
      ]).finally(() => {
        const currentGameState = localStorage.getItem(
          "mlb-gamestate-" + activeRoster.replaceAll(" ", "_"),
        );
        if (!currentGameState) {
          initializeGameState();
        }
        useRosterBuildingState.temporal.getState().clear();

        setLoaded(true);
      });
    }

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [activeRoster]);

  useEffect(() => {
    setCurrentModal(ModalTypes.DOMAIN_MESSAGE);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const _30DaysAgo = 30 * 24 * 60 * 60 * 1000;
  return (
    <AppContainer>
      <Container maxWidth={false} fixed sx={{ p: 2 }}>
        <Alerts />
        <main>
          {Date.now() - storageNoticeActive >= _30DaysAgo && (
            <Alert
              severity="warning"
              sx={{ m: "0 auto 1rem", maxWidth: "100ch" }}
              closeText="dismiss"
              onClose={dismissStorageNotice}
              icon={false}
            >
              <Box sx={{ maxWidth: "90ch" }}>
                <AlertTitle>
                  <strong>Important Notice: Data Storage</strong>
                </AlertTitle>
                This application uses your browser’s{" "}
                <em>
                  <b>local storage</b>
                </em>{" "}
                for saving data. Please note that any data saved here will be{" "}
                <em>
                  <b>deleted if you clear your browser history or cache</b>
                </em>
                . To avoid losing your data, make use of the{" "}
                <em>
                  <b>export options</b>
                </em>{" "}
                available via the floating action button in the bottom right
                corner of this page.
              </Box>
            </Alert>
          )}
          {showHistory ? (
            <SavedGameResults />
          ) : (
            <Grid2 container spacing={2}>
              <Grid2
                data-scroll-id="sidebar"
                size={!isMobile ? 4 : 12}
                sx={
                  isMobile
                    ? {}
                    : {
                        position: "sticky",
                        top: 70,
                        height: "100%",
                        overflow: "auto",
                        scrollbarWidth: "thin",
                      }
                }
              >
                {loaded ? (
                  <Sidebar />
                ) : (
                  <Skeleton
                    variant="rectangular"
                    height={isMobile ? "10dvh" : "70dvh"}
                  />
                )}
              </Grid2>
              <Grid2 size={!isMobile ? 8 : 12}>
                {loaded ? (
                  gameMode ? (
                    <GameMode />
                  ) : (
                    <BuilderMode />
                  )
                ) : (
                  <Stack gap={1}>
                    <Skeleton variant="rectangular" height="5dvh" />
                    <Skeleton variant="rectangular" height="20dvh" />
                    <Skeleton variant="rectangular" height="20dvh" />
                    <Skeleton variant="rectangular" height="10dvh" />
                    <Skeleton variant="rectangular" height="12dvh" />
                  </Stack>
                )}
              </Grid2>
            </Grid2>
          )}
        </main>
        <aside>
          <DrawerContainer />
          <ModalContainer />
        </aside>
      </Container>
    </AppContainer>
  );
};
