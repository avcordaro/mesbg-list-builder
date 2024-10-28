import {
  Button,
  DialogActions,
  DialogContent,
  FormControlLabel,
  FormGroup,
} from "@mui/material";
import Divider from "@mui/material/Divider";
import { useTheme } from "@mui/material/styles";
import useMediaQuery from "@mui/material/useMediaQuery";
import html2canvas from "html2canvas";
import { useState } from "react";
import { FaImage } from "react-icons/fa6";
import { useStore } from "../../../state/store";
import { RosterTableView } from "../../common/roster/TableView.tsx";
import { RosterTextView } from "../../common/roster/TextView.tsx";
import { CustomSwitch as Switch } from "../../common/switch/CustomSwitch.tsx";
import { ModalTypes } from "../modals";

/* Modal Roster Table is the component used to populate the pop-up modal which appears
after the user clicks the 'Roster Table' button. This component uses the full roster
state variable (passed to it as an argument) to populate a table of the army. */

export const ModalRosterTable = () => {
  const { setCurrentModal } = useStore();

  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));

  const [textView, setTextView] = useState(false);
  const [showArmyBonus, setShowArmyBonus] = useState(true);
  const [showUnitTotals, setShowUnitTotals] = useState(false);
  const [screenshotting, setScreenshotting] = useState(false);

  const handleTotalsToggle = () => setShowUnitTotals(!showUnitTotals);
  const handleTextToggle = () => setTextView(!textView);
  const handleBonusToggle = () => setShowArmyBonus(!showArmyBonus);

  const createScreenshot = () => {
    const rosterList = document.getElementById("rosterList");
    const admission = document.getElementById("admission");
    const copyBtn = document.getElementById("copyBtn");
    if (copyBtn) {
      copyBtn.style.display = "none";
    }
    if (admission) {
      admission.style.display = "inline-block";
    }

    setScreenshotting(true);
    setTimeout(() => {
      const width = rosterList.style.width;
      rosterList.style.width = "1200px";
      html2canvas(rosterList).then(function (data) {
        setCurrentModal(ModalTypes.ROSTER_SCREENSHOT, {
          screenshot: data.toDataURL(),
          rawScreenshot: data,
          onClose: () => setCurrentModal(ModalTypes.ROSTER_TABLE),
        });
        setScreenshotting(false);
      });
      rosterList.style.width = width;
      if (copyBtn) {
        copyBtn.style.display = "inline-block";
      }
      if (admission) {
        admission.style.display = "none";
      }
    });
  };

  return (
    <>
      <DialogContent id="rosterList" sx={{ minWidth: "50vw" }}>
        <FormGroup
          row
          sx={{
            mb: 2,
            display: screenshotting ? "none" : "flex",
            direction: isMobile ? "column" : "row",
            justifyContent: isMobile ? "start" : "end",
          }}
        >
          <FormControlLabel
            checked={showUnitTotals}
            control={<Switch color="primary" />}
            label="Show unit totals"
            labelPlacement="end"
            onChange={handleTotalsToggle}
          />
          <FormControlLabel
            checked={showArmyBonus}
            control={<Switch color="primary" />}
            label="Show army bonus"
            labelPlacement="end"
            onChange={handleBonusToggle}
          />
          <FormControlLabel
            checked={textView}
            control={<Switch color="primary" />}
            label="Text print view"
            labelPlacement="end"
            onChange={handleTextToggle}
          />
        </FormGroup>
        {!textView ? (
          <RosterTableView
            showArmyBonus={showArmyBonus}
            showUnitTotals={showUnitTotals}
            screenshotting={screenshotting}
          />
        ) : (
          <RosterTextView
            showUnitTotals={showUnitTotals}
            showArmyBonus={showArmyBonus}
            screenshotting={screenshotting}
          />
        )}
      </DialogContent>

      <Divider />

      <DialogActions
        sx={{
          p: 2,
          display: "flex",
          flexDirection: isMobile ? "column" : "row",
          alignItems: "end",
          gap: isMobile ? 2 : 0,
        }}
      >
        <Button
          variant="contained"
          onClick={() => createScreenshot()}
          startIcon={<FaImage />}
          fullWidth={isMobile}
        >
          Create pretty image
        </Button>
      </DialogActions>
    </>
  );
};
