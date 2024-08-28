import { Navbar } from "react-bootstrap";
import Button from "react-bootstrap/Button";
import Stack from "react-bootstrap/Stack";
import { BiLinkAlt, BiSolidFileImport } from "react-icons/bi";
import { FaChessRook, FaRegCopyright } from "react-icons/fa";
import { FaHammer, FaQuestion, FaTableList } from "react-icons/fa6";
import { MdReportGmailerrorred } from "react-icons/md";
import logo from "../../assets/images/logo.svg";
import title from "../../assets/images/title.png";
import { useStore } from "../../state/store";
import { AlertTypes } from "../alerts/alert-types";
import { ModalTypes } from "../modal/modals";
import { SidebarTypes } from "../sidebar-drawer/sidebars";

/* Navbar component that displays at the top of the page. */
// TODO: Update this component to use typescript.
export function TopNavbar() {
  const {
    roster,
    gameMode,
    uniqueModels,
    setCurrentModal,
    triggerAlert,
    startNewGame,
    openSidebar,
  } = useStore();

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

  return (
    <>
      <Navbar
        style={{ minWidth: "1450px" }}
        bg="dark"
        data-bs-theme="dark"
        className="shadow fixed-top"
      >
        <Navbar.Brand className="ms-4">
          <Stack direction="horizontal" gap={3}>
            <Stack>
              <Stack direction="horizontal" className="mt-2">
                <img
                  src={logo}
                  className="ms-1"
                  style={{ width: "65px", height: "65px" }}
                  alt=""
                />
                <Stack
                  gap={2}
                  className="ms-2"
                  style={{ justifyContent: "center" }}
                >
                  <img src={title} alt="" style={{ width: "325px" }} />
                  <Stack direction="horizontal" className="mt-2">
                    <span className="p-0 m-0" style={{ fontSize: "16px" }}>
                      {/* eslint-disable-next-line no-undef */}
                      Unofficial | v{BUILD_VERSION} | updated {BUILD_DATE}
                    </span>
                  </Stack>
                </Stack>
              </Stack>
            </Stack>
            <Stack style={{ width: "750px" }}>
              <Stack className="mt-3" direction="horizontal" gap={3}>
                <Button
                  variant="dark"
                  className="ms-auto border border-secondary"
                  onClick={() => openSidebar(SidebarTypes.NEW_EDITION_NEWS)}
                >
                  <FaQuestion /> New Edition
                </Button>
                {!gameMode ? (
                  <Button
                    variant="success"
                    disabled={uniqueModels.length === 0}
                    onClick={() => handleGameMode()}
                  >
                    <FaChessRook /> Game Mode
                  </Button>
                ) : (
                  <Button
                    variant="success"
                    onClick={() => setCurrentModal(ModalTypes.BUILDER_MODE, {})}
                  >
                    <FaHammer /> Builder Mode
                  </Button>
                )}
                <Button
                  disabled={uniqueModels.length === 0}
                  onClick={() => setCurrentModal(ModalTypes.ROSTER_TABLE)}
                >
                  <FaTableList /> Roster Table
                </Button>
                <Button
                  disabled={uniqueModels.length === 0 || gameMode}
                  onClick={() => handleExportJSON()}
                >
                  <BiLinkAlt /> Export JSON
                </Button>
                <Button
                  onClick={() =>
                    setCurrentModal(ModalTypes.IMPORT_ROSTER_JSON, {})
                  }
                  disabled={gameMode}
                >
                  <BiSolidFileImport /> Import JSON
                </Button>
              </Stack>
            </Stack>
          </Stack>
          <Stack direction="horizontal" className="mt-3">
            <p className="ms-2 m-0 p-0 text-muted" style={{ fontSize: "14px" }}>
              <MdReportGmailerrorred style={{ fontSize: "20px" }} /> For any
              bugs and corrections, please contact:{" "}
              <a href="mailto:avcordaro@gmail.com?subject=MESBG List Builder - Bug/Correction">
                avcordaro@gmail.com
              </a>
            </p>
            <Stack
              direction="horizontal"
              gap={4}
              style={{ width: "835px", marginLeft: "90px" }}
            >
              <h6 className="mb-0">
                Total Points: <b>{roster.points}</b>
              </h6>
              <h6 className="mb-0">
                Total Units: <b>{roster.num_units}</b>
              </h6>
              <h6 className="mb-0" style={{ minWidth: "120px" }}>
                Break Point:{" "}
                <b>{Math.round(0.5 * roster.num_units * 100) / 100}</b>
              </h6>
              <h6 className="mb-0">
                Bows: <b>{roster.bow_count}</b>
              </h6>
              <h6
                className="mb-0 ms-auto text-muted"
                style={{ fontSize: "14px" }}
              >
                Developed by{" "}
                <a href="https://github.com/avcordaro">avcordaro</a> &{" "}
                <a href="https://github.com/mhollink">mhollink</a> |{" "}
                <FaRegCopyright /> 2024
              </h6>
            </Stack>
          </Stack>
        </Navbar.Brand>
      </Navbar>
    </>
  );
}
