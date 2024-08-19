import Stack from "react-bootstrap/Stack";
import Offcanvas from "react-bootstrap/Offcanvas";
import {MdReportGmailerrorred} from "react-icons/md";
import Button from "react-bootstrap/Button";
import {FaTableList} from "react-icons/fa6";
import {BiLinkAlt, BiSolidFileImport} from "react-icons/bi";
import {FaRegCopyright, FaChessRook} from "react-icons/fa";
import { FaQuestion } from "react-icons/fa6";
import { FaHammer } from "react-icons/fa6";
import {useState} from "react";
import {Navbar} from "react-bootstrap";
import logo from '../assets/images/logo.svg';
import title from '../assets/images/title.png'

export const VERSION = "5.3.10";
const UPDATED = "17-Aug-2024";

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

  const [showNews, setShowNews] = useState(false);

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

  return (
  <>
  <Navbar
    style={{minWidth: "1450px"}}
    bg="dark"
    data-bs-theme="dark"
    className="shadow fixed-top"
  >
    <Navbar.Brand className="ms-4">
      <Stack direction="horizontal" gap={3}>
        <Stack>
          <Stack direction="horizontal" className="mt-2">
            <img src={logo} className="ms-1" style={{width: "65px", height: "65px"}} alt=""/>
            <Stack gap={2} className="ms-2" style={{justifyContent: "center"}}>
              <img
                src={title}
                alt=""
                style={{width: "325px"}}
              />
              <Stack direction="horizontal" className="mt-2">
                <span className="p-0 m-0" style={{fontSize: "16px"}}>
                    Unofficial | v{VERSION} | updated {UPDATED}
                </span>
              </Stack>
            </Stack>
          </Stack>
        </Stack>
        <Stack style={{width: "750px"}}>
          <Stack className="mt-3" direction="horizontal" gap={3}>
            <Button
              variant="dark"
              className="ms-auto border border-secondary"
              onClick={() => setShowNews(true)}
            >
              <FaQuestion /> New Edition
            </Button>
            {!gameMode ?
              <Button
                variant="success"
                disabled={uniqueModels.length === 0}
                onClick={() => handleGameMode()}
              >
                <FaChessRook/> Game Mode
              </Button>
            :
              <Button
              variant="success"
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
          
        </Stack>
      </Stack>
      <Stack direction="horizontal" className="mt-3">
        <p
          className="ms-2 m-0 p-0 text-muted"
          style={{fontSize: "14px"}}
        >
          <MdReportGmailerrorred style={{fontSize: "20px"}}/> For any
          bugs and corrections, please contact:{" "}
          <a href="mailto:avcordaro@gmail.com?subject=MESBG List Builder - Bug/Correction">
            avcordaro@gmail.com
          </a>
        </p>
        <Stack direction="horizontal" gap={4} style={{width: "835px", marginLeft: "90px"}}>
          <h6 className="mb-0">
            Total Points: <b>{roster.points}</b>
          </h6>
          <h6 className="mb-0">
            Total Units: <b>{roster.num_units}</b>
          </h6>
          <h6 className="mb-0" style={{minWidth: "120px"}}>
            Break Point: <b>{Math.round((0.5 * roster.num_units) * 100) / 100}</b>
          </h6>
          <h6 className="mb-0">
            Bows: <b>{roster.bow_count}</b>
          </h6>
          <h6
            className="mb-0 ms-auto text-muted"
            style={{fontSize: "14px"}}
          >
            Developed by avcordaro | <FaRegCopyright/> 2024
          </h6>
        </Stack>
      </Stack>
    </Navbar.Brand>
  </Navbar>
  <Offcanvas show={showNews} onHide={() => setShowNews(false)}>
    <Offcanvas.Header className="border border-secondary" closeButton>
      <Offcanvas.Title><b>The New Edition of MESBG</b></Offcanvas.Title>
    </Offcanvas.Header>
    <Offcanvas.Body>
      <b>17th August 2024 - Message from avcordaro</b>
      <br/><br/>
      Hello everyone!
      <br/><br/>
      Games Workshop has announced that a new edition for MESBG will be released in the near future.
      You can find one of the latest announcements here, describing some of the incoming changes...
      <br/><br/>
      <a target="_blank" rel="noreferrer" href="https://www.warhammer-community.com/2024/08/15/the-road-goes-ever-on-and-on-the-next-edition-of-middle-earth-strategy-battle-game/">The Road Goes Ever On and On… The Next Edition of Middle-earth™ Strategy Battle Game</a>
      <br/><br/>
      You can see in the article above that a lot of profiles are being reworked, along with a new array of army lists and various rule changes.
      This is likely going to result in a very large amount of work for me once it is released, particularly for profile cards. I will definitely be
      working hard to bring you updates that support the new edition of the game on this website.
      <br/><br/>
      My plan is to maintain two versions of this list builder,
      one for the new edition, and one for the old edition. I may be able to better estimate the time and effort it will require as more details are
      released over the coming months. As a matter of tempering expectations, I'd like to disclaim in advance that it could take many weeks to
      fully support all of the changes.
      <br/><br/>
      In the meantime, thank you for all your support and kind words over the past year. It has meant a great deal to me.
      I appreciate your patience for what's to come in future as I transition this website over to supporting the new edition.
      <br/><br/>
      Thank you.
      <br/><br/>
    </Offcanvas.Body>
  </Offcanvas>
  </>
  );
}
