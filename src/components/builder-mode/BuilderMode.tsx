import { Download, UploadFile } from "@mui/icons-material";
import SaveIcon from "@mui/icons-material/Save";
import ShareIcon from "@mui/icons-material/Share";
import { SpeedDial, SpeedDialAction, SpeedDialIcon } from "@mui/material";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import { useEffect, useRef, useState } from "react";
import { useDownload } from "../../hooks/download.ts";
import { useAppState } from "../../state/app";
import {
  useRosterBuildingState,
  useTemporalRosterBuildingState,
} from "../../state/roster-building";
import { ModalTypes } from "../modal/modals.tsx";
import { Warbands } from "./warbands/Warbands.tsx";

export const BuilderMode = () => {
  const [fabBottom, setFabBottom] = useState("16px");
  const [isBouncing, setIsBouncing] = useState(false);
  const [fabOpen, setFabOpen] = useState(false);
  const { downloadProfileCards } = useDownload();
  const { roster } = useRosterBuildingState();
  const { undo, redo, pastStates, futureStates } =
    useTemporalRosterBuildingState((state) => state);
  const { setCurrentModal } = useAppState();
  const speedDialRef = useRef<HTMLDivElement | null>(null);

  const updateFabBottom = () => {
    const footerRect = document
      .getElementById("footer")
      ?.getBoundingClientRect();

    setFabBottom(`${Math.max(16, window.innerHeight - footerRect.top + 16)}px`);
  };

  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (!event.ctrlKey) return;

      if (event.key === "z" && !event.shiftKey) undo();
      else if (event.key === "y" || (event.shiftKey && event.key === "z"))
        redo();
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [undo, redo]);

  useEffect(() => {
    window.addEventListener("resize", updateFabBottom);
    window.addEventListener("scroll", updateFabBottom);
    return () => {
      window.removeEventListener("resize", updateFabBottom);
      window.removeEventListener("scroll", updateFabBottom);
    };
  }, []);

  useEffect(() => updateFabBottom());

  /**
   * This effect adds an event listener which registers clicks outside the FAB.
   * When this happens it's an indication that the user is no longer interested
   * in the actions in the FAB, and it can be closed.
   */
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        speedDialRef.current &&
        !speedDialRef.current.contains(event.target as Node)
      ) {
        setFabOpen(false);
      }
    };

    if (fabOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    } else {
      document.removeEventListener("mousedown", handleClickOutside);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [fabOpen]);

  /**
   * This effect sets the bounce value to true for N seconds, this triggers
   * the FAB to bounce up and down for this amount of time and draw attention
   * to its existence.
   */
  useEffect(() => {
    setIsBouncing(true);
    const timer = setTimeout(() => setIsBouncing(false), 2100);
    return () => clearTimeout(timer);
  }, []);

  const actions = [
    {
      icon: <SaveIcon />,
      name: "Export roster",
      callback: () => setCurrentModal(ModalTypes.EXPORT_ROSTER),
      disabled: roster.num_units === 0,
    },
    {
      icon: <UploadFile />,
      name: "Import roster",
      callback: () => setCurrentModal(ModalTypes.IMPORT_ROSTER),
      disabled: false,
    },
    {
      icon: <Download />,
      name: "Download profile cards",
      callback: downloadProfileCards,
      disabled: roster.num_units === 0,
    },
    {
      icon: <ShareIcon />,
      name: "Roster summary & sharing",
      callback: () => setCurrentModal(ModalTypes.ROSTER_TABLE),
      disabled: roster.num_units === 0,
    },
  ];

  return (
    <>
      <center>
        <Typography variant="overline">
          [ history: {pastStates.length} / future: {futureStates.length} ]
        </Typography>
      </center>
      <Warbands />
      <Box ref={speedDialRef}>
        <SpeedDial
          ariaLabel="action-buttons"
          sx={{ position: "fixed", bottom: fabBottom, right: 16 }}
          className={isBouncing ? "bounce" : ""}
          icon={<SpeedDialIcon />}
          open={fabOpen}
          onClick={() => setFabOpen((x) => !x)}
          onClose={null}
        >
          {actions.map((action) => (
            <SpeedDialAction
              key={action.name}
              icon={action.icon}
              onClick={() => {
                if (!action.disabled) action.callback();
              }}
              FabProps={{ disabled: action.disabled }}
              tooltipTitle={
                <span style={{ whiteSpace: "nowrap" }}> {action.name} </span>
              }
              tooltipOpen
            />
          ))}
        </SpeedDial>
      </Box>
    </>
  );
};
