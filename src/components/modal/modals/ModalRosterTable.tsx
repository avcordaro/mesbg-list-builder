import { ListAlt } from "@mui/icons-material";
import CloseIcon from "@mui/icons-material/Close";
import {
  Button,
  CircularProgress,
  DialogActions,
  DialogContent,
  FormControlLabel,
  FormGroup,
} from "@mui/material";
import Box from "@mui/material/Box";
import Divider from "@mui/material/Divider";
import IconButton from "@mui/material/IconButton";
import Typography from "@mui/material/Typography";
import { saveAs } from "file-saver";
import html2canvas from "html2canvas";
import JSZip from "jszip";
import { useState } from "react";
import { FaDownload, FaImage } from "react-icons/fa6";
import hero_constraint_data from "../../../assets/data/hero_constraint_data.json";
import { useStore } from "../../../state/store";
import { isDefinedUnit } from "../../../types/unit.ts";
import { RosterTableView } from "../../common/roster/TableView.tsx";
import { RosterTextView } from "../../common/roster/TextView.tsx";
import { CustomSwitch as Switch } from "../../common/switch/CustomSwitch.tsx";
import { ModalTypes } from "../modals";

/* Modal Roster Table is the component used to populate the pop-up modal which appears
after the user clicks the 'Roster Table' button. This component uses the full roster
state variable (passed to it as an argument) to populate a table of the army. */

export const ModalRosterTable = () => {
  const { roster, setCurrentModal, closeModal } = useStore();

  const [textView, setTextView] = useState(false);
  const [showArmyBonus, setShowArmyBonus] = useState(true);
  const [downloadSpinner, setDownloadSpinner] = useState(false);

  const handleTextToggle = () => setTextView(!textView);
  const handleBonusToggle = () => setShowArmyBonus(!showArmyBonus);

  const createScreenshot = () => {
    const rosterList = document.getElementById("rosterList");
    const copyBtn = document.getElementById("copyBtn");
    if (copyBtn) {
      copyBtn.style.display = "none";
    }
    html2canvas(rosterList, { scale: 5 }).then(function (data) {
      setCurrentModal(ModalTypes.ROSTER_SCREENSHOT, {
        screenshot: data.toDataURL(),
      });
    });
    if (copyBtn) {
      copyBtn.style.display = "inline-block";
    }
  };

  const downloadProfileCards = async () => {
    setDownloadSpinner(true);
    const profileCards = [];
    roster.warbands.map((_warband) => {
      if (_warband.hero) {
        profileCards.push(
          [_warband.hero.profile_origin, _warband.hero.name].join("|"),
        );
        if (
          _warband.hero.unit_type !== "Siege Engine" &&
          hero_constraint_data[_warband.hero.model_id][0]["extra_profiles"]
            .length > 0
        ) {
          hero_constraint_data[_warband.hero.model_id][0]["extra_profiles"].map(
            (_profile) => {
              profileCards.push(
                [_warband.hero.profile_origin, _profile].join("|"),
              );
              return null;
            },
          );
        }
      }
      _warband.units.filter(isDefinedUnit).map((_unit) => {
        if (_unit.name != null && _unit.unit_type !== "Siege") {
          profileCards.push([_unit.profile_origin, _unit.name].join("|"));
        }
        return null;
      });
      return null;
    });
    const profileCardsSet = new Set(profileCards);
    const finalProfileCards = [...profileCardsSet];

    const zip = new JSZip();
    for (const card of finalProfileCards) {
      const blob = await fetch(
        "assets/images/profiles/" +
          card.split("|")[0] +
          /cards/ +
          card.split("|")[1] +
          ".jpg",
      ).then((res) => res.blob());
      zip.file(card.split("|")[1] + ".jpg", blob, { binary: true });
    }
    zip.generateAsync({ type: "blob" }).then((blob) => {
      const ts = new Date();
      saveAs(
        blob,
        "MESBG-Army-Profiles-" + ts.toISOString().substring(0, 19) + ".zip",
      );
    });
    setDownloadSpinner(false);
  };

  return (
    <>
      <Box sx={{ display: "flex", alignItems: "center", p: 1 }}>
        <Typography variant="h6" component="h2" flexGrow={1}>
          <ListAlt />
          <b>Roster Table</b>
        </Typography>
        <FormGroup aria-label="position" row>
          <FormControlLabel
            checked={showArmyBonus}
            control={<Switch color="primary" />}
            label="show army bonus"
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

        <IconButton onClick={closeModal} sx={{ ml: "auto" }}>
          <CloseIcon />
        </IconButton>
      </Box>

      <Divider />

      <DialogContent id="rosterList" sx={{ minWidth: "50vw" }}>
        {!textView ? (
          <RosterTableView showArmyBonus={showArmyBonus} />
        ) : (
          <RosterTextView showArmyBonus={showArmyBonus} />
        )}
      </DialogContent>

      <Divider />

      <DialogActions sx={{ p: 2 }}>
        <Button
          variant="contained"
          onClick={() => createScreenshot()}
          startIcon={<FaImage />}
        >
          Screenshot
        </Button>
        <Button
          variant="contained"
          onClick={() => downloadProfileCards()}
          startIcon={
            downloadSpinner ? (
              <CircularProgress color="inherit" size={20} thickness={8} />
            ) : (
              <FaDownload />
            )
          }
        >
          Profile Cards
        </Button>
      </DialogActions>
    </>
  );
};
