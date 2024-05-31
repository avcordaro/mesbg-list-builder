import Stack from "react-bootstrap/Stack";
import {MdReportGmailerrorred} from "react-icons/md";
import Button from "react-bootstrap/Button";
import {FaTableList} from "react-icons/fa6";
import {BiLinkAlt, BiSolidFileImport} from "react-icons/bi";
import {FaRegCopyright, FaChessRook} from "react-icons/fa";
import { FaHammer } from "react-icons/fa6";
import React from "react";
import {Navbar} from "react-bootstrap";

export const VERSION = "5.2.11";
const UPDATED = "31-May-2024";

/* Navbar component that displays at the top of the page. */

export function TopNavbar({
                            roster,
                            uniqueModels,
                            setShowRosterTable,
                            setExportAlert,
                            setShowImportModal,
                            gameMode,
                            setGameMode,
                            setGameModeAlert,
                            setShowBuilderModal
                          }) {
  const handleExportJSON = () => {
    /* Convert the full roster dictionary into a JSON string and save it to the user's clipboard.
    Also notify them with an alert that fades away after 3 seconds. */
    navigator.clipboard.writeText(JSON.stringify(roster).replaceAll("[\"\",", "[0,"));
    setExportAlert(true);
    window.setTimeout(() => setExportAlert(false), 5000);
  };

  const handleBacktoBuilder = () => {
    setShowBuilderModal(true)
  }

  const handleGameMode = () => {
    if (parseInt(roster.version.substring(0, 1)) < 5) {
      setGameModeAlert(true);
      window.setTimeout(() => setGameModeAlert(false), 12000);
    } else {
      setGameMode(true);
      window.scrollTo(0, 0)
    }
  }

  return (<Navbar
    style={{minWidth: "1450px"}}
    bg="dark"
    data-bs-theme="dark"
    className="shadow fixed-top"
  >
    <Navbar.Brand className="ms-4">
      <Stack direction="horizontal" gap={3}>
        <Stack>
          <Stack direction="horizontal" gap={3}>
            <img src={require("../images/title-logo.png")} alt=""/>
            <Stack gap={2} style={{width: "260px"}}>
              <img
                className="mt-2"
                src={require("../images/title.png")}
                alt=""
              />
              <span className="p-0 m-0" style={{fontSize: "16px"}}>
                  v{VERSION} (updated {UPDATED})
                </span>
            </Stack>
          </Stack>
          <p
            className="mt-3 ms-3 m-0 p-0 text-muted"
            style={{fontSize: "14px"}}
          >
            <MdReportGmailerrorred style={{fontSize: "20px"}}/> For any
            bugs and corrections, please contact:{" "}
            <a href="mailto:avcordaro@gmail.com?subject=MESBG List Builder - Bug/Correction">
              avcordaro@gmail.com
            </a>
          </p>
        </Stack>
        <Stack style={{width: "835px"}}>
          <Stack className="mt-3" direction="horizontal" gap={3}>
            {!gameMode ?
              <Button
                variant="success"
                className="ms-auto"
                disabled={uniqueModels.length === 0}
                onClick={() => handleGameMode()}
              >
                <FaChessRook/> Game Mode
              </Button>
            :
              <Button
              variant="success"
              className="ms-auto"
              onClick={() => handleBacktoBuilder()}
              >
                <FaHammer/> Builder Mode
              </Button>
            }
            <Button
              disabled={uniqueModels.length === 0}
              onClick={() => setShowRosterTable(true)}
            >
              <FaTableList/> Roster Table
            </Button>
            <Button
              disabled={uniqueModels.length === 0 || gameMode}
              onClick={() => handleExportJSON()}
            >
              <BiLinkAlt/> Export JSON
            </Button>
            <Button onClick={() => setShowImportModal(true)} disabled={gameMode}>
              <BiSolidFileImport/> Import JSON
            </Button>
          </Stack>
          <Stack className="mt-4" direction="horizontal" gap={4}>
            <h6 className="mb-0 mt-2">
              Total Points: <b>{roster.points}</b>
            </h6>
            <h6 className="mb-0 mt-2">
              Total Units: <b>{roster.num_units}</b>
            </h6>
            <h6 className="mb-0 mt-2" style={{minWidth: "120px"}}>
              Break Point: <b>{Math.round((0.5 * roster.num_units) * 100) / 100}</b>
            </h6>
            <h6 className="mb-0 mt-2">
              Bows: <b>{roster.bow_count}</b>
            </h6>
            <h6
              className="mb-0 mt-2 ms-auto text-muted"
              style={{fontSize: "14px"}}
            >
              Developed by avcordaro | <FaRegCopyright/> 2024
            </h6>
          </Stack>
        </Stack>
      </Stack>
    </Navbar.Brand>
  </Navbar>);
}
