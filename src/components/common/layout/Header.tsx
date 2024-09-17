import {
  Attachment,
  FileDownload,
  Handyman,
  ListAlt,
} from "@mui/icons-material";
import FortIcon from "@mui/icons-material/Fort";
import MenuIcon from "@mui/icons-material/Menu";
import QuestionMarkIcon from "@mui/icons-material/QuestionMark";
import { ListItemButton, ListItemIcon } from "@mui/material";
import AppBar from "@mui/material/AppBar";
import Box from "@mui/material/Box";
import Button, { ButtonProps } from "@mui/material/Button";
import Divider from "@mui/material/Divider";
import Drawer from "@mui/material/Drawer";
import IconButton from "@mui/material/IconButton";
import List from "@mui/material/List";
import ListItem from "@mui/material/ListItem";
import ListItemText from "@mui/material/ListItemText";
import Stack from "@mui/material/Stack";
import Toolbar from "@mui/material/Toolbar";
import Typography from "@mui/material/Typography";
import { useTheme } from "@mui/material/styles";
import useMediaQuery from "@mui/material/useMediaQuery";
import { Fragment, useState } from "react";
import logo from "../../../assets/images/logo.svg";
import title from "../../../assets/images/title.png";
import { useStore } from "../../../state/store.ts";
import { AlertTypes } from "../../alerts/alert-types.tsx";
import { DrawerTypes } from "../../drawer/drawers.tsx";
import { ModalTypes } from "../../modal/modals.tsx";

const RosterInfoBar = () => {
  const { roster } = useStore();
  const breakPoint = Math.ceil(roster.num_units / 2);
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));
  return (
    <Box
      id="roster-totals"
      sx={{
        backgroundColor: "#1c1c1e",
        color: "white",
        p: 2,
        textAlign: "center",
        position: "sticky",
        top: 0,
        overflow: "auto",
        zIndex: 1,
      }}
    >
      <Stack
        direction={isMobile ? "column" : "row"}
        spacing={isMobile ? 0 : 4}
        justifyContent="center"
        flexWrap="wrap"
      >
        <Typography variant="body1" component="div">
          Total Points: <b>{roster.points}</b>
        </Typography>
        <Typography variant="body1" component="div">
          Total Units: <b>{roster.num_units}</b>
        </Typography>
        <Typography variant="body1" component="div">
          Break Point: <b>{breakPoint}</b>
        </Typography>
        <Typography variant="body1" component="div">
          Bows: <b>{roster.bow_count}</b>
        </Typography>
      </Stack>
    </Box>
  );
};

export const Header = () => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("lg"));
  const [drawerOpen, setDrawerOpen] = useState(false);
  const {
    gameMode,
    roster,
    setCurrentModal,
    triggerAlert,
    openSidebar,
    startNewGame,
  } = useStore();

  const handleDrawerToggle = () => {
    setDrawerOpen(!drawerOpen);
  };

  const handleExportJSON = () => {
    /* Convert the full roster dictionary into a JSON string and save it to the user's clipboard.
                            Also notify them with an alert that fades away after 3 seconds. */
    navigator.clipboard.writeText(
      JSON.stringify(roster).replaceAll('["",', "[0,"),
    );
    triggerAlert(AlertTypes.EXPORT_ALERT);
  };

  const handleGameMode = () => {
    if (parseInt(roster.version.substring(0, 1)) < 5) {
      triggerAlert(AlertTypes.GAMEMODE_ALERT);
    } else {
      startNewGame();
      window.scrollTo(0, 0);
    }
  };

  // List of buttons
  const buttons = [
    {
      icon: <QuestionMarkIcon />,
      label: "New Edition",
      onClick: () => openSidebar(DrawerTypes.NEW_EDITION_NEWS),
      outlined: true,
      color: "inherit" as ButtonProps["color"],
    },
    {
      icon: gameMode ? <Handyman /> : <FortIcon />,
      label: gameMode ? "Builder" : "Game Mode",
      onClick: gameMode
        ? () => setCurrentModal(ModalTypes.BUILDER_MODE)
        : handleGameMode,
      color: "success" as ButtonProps["color"],
    },
    {
      icon: <ListAlt />,
      label: "Roster Table",
      onClick: () => setCurrentModal(ModalTypes.ROSTER_TABLE),
    },
    {
      icon: <Attachment />,
      label: "Export JSON",
      onClick: handleExportJSON,
    },
    {
      icon: <FileDownload />,
      label: "Import JSON",
      onClick: () => setCurrentModal(ModalTypes.IMPORT_ROSTER_JSON),
    },
  ];

  return (
    <>
      <AppBar position="static" sx={{ backgroundColor: "#1c1c1e" }}>
        <Toolbar>
          {/* Logo */}
          <Button aria-label="logo" sx={{ mr: 2 }}>
            <img src={logo} alt="Logo" style={{ height: "50px" }} />
            <img
              src={title}
              alt="MESBG List Builder"
              style={{ maxHeight: "20px", margin: "0 .25rem" }}
            />
          </Button>

          <Box sx={{ flexGrow: 1 }} />

          {/* Right side buttons (hide in mobile) */}
          {!isMobile && (
            <Box sx={{ display: { xs: "none", sm: "flex" } }}>
              {buttons.map((button, index) => (
                <Button
                  key={index}
                  sx={{ p: 1, pt: 1, pb: 1, m: 1, minWidth: "144px" }}
                  variant={button.outlined ? "outlined" : "contained"}
                  color={button.color ? button.color : "primary"}
                  onClick={button.onClick}
                  size="small"
                  startIcon={button.icon}
                >
                  {button.label}
                </Button>
              ))}
            </Box>
          )}

          {/* Hamburger Menu for Mobile */}
          {isMobile && (
            <IconButton
              edge="end"
              color="inherit"
              aria-label="menu"
              onClick={handleDrawerToggle}
            >
              <MenuIcon />
            </IconButton>
          )}
        </Toolbar>
      </AppBar>
      <RosterInfoBar />

      {/* Drawer for mobile menu */}
      <Drawer
        anchor="top"
        open={drawerOpen}
        onClose={handleDrawerToggle}
        PaperProps={{
          sx: {
            backgroundColor: "#1c1c1e",
            color: "white",
          },
        }}
      >
        <Box
          role="presentation"
          onClick={handleDrawerToggle}
          onKeyDown={handleDrawerToggle}
        >
          <List>
            <ListItem>
              <img
                src={title}
                alt="MESBG List Builder"
                style={{ maxWidth: "400px", width: "100%" }}
              />
            </ListItem>
            <Divider sx={{ m: 2 }} />
            {buttons.map((button, index) => (
              <Fragment key={index}>
                <ListItemButton onClick={button.onClick}>
                  {button.icon && (
                    <ListItemIcon sx={{ color: "white" }}>
                      {button.icon}
                    </ListItemIcon>
                  )}
                  <ListItemText
                    primaryTypographyProps={{ fontSize: "1.4rem" }}
                    primary={button.label}
                  />
                </ListItemButton>
              </Fragment>
            ))}
          </List>
        </Box>
      </Drawer>
    </>
  );
};
