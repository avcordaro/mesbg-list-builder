import Stack from "react-bootstrap/Stack";
import Modal from "react-bootstrap/Modal";
import Table from "react-bootstrap/Table";
import Badge from "react-bootstrap/Badge";
import Button from "react-bootstrap/Button";
import Spinner from "react-bootstrap/Spinner";
import Form from "react-bootstrap/Form";
import html2canvas from "html2canvas";
import { useState } from "react";
import { FaDownload, FaImage } from "react-icons/fa6";
import { FcCheckmark } from "react-icons/fc";
import { RxCross1 } from "react-icons/rx";
import { GoCopy } from "react-icons/go";
import { GiQueenCrown } from "react-icons/gi";
import hero_constraint_data from "../assets/data/hero_constraint_data.json";
import JSZip from "jszip";
import { saveAs } from "file-saver";
import { useStore } from "../state/store";

/* Modal Roster Table is the component used to populate the pop-up modal which appears
after the user clicks the 'Roster Table' button. This component uses the full roster
state variable (passed to it as an argument) to populate a table of the army. */

export function ModalRosterTable({
  allianceLevel,
  allianceColour,
  showRosterTable,
  setShowRosterTable,
  factionList,
  factionData,
  hasArmyBonus,
}) {
  const roster = useStore((store) => store.roster);

  const [textView, setTextView] = useState(false);
  const [showArmyBonus, setShowArmyBonus] = useState(true);
  const [copyLabel, setCopyLabel] = useState("Copy");
  const [downloadSpinner, setDownloadSpinner] = useState(false);
  const [screenshot, setScreenshot] = useState(null);
  const [showScreenshotModal, setShowScreenshotModal] = useState(false);

  const handleTextToggle = () => {
    if (textView) {
      setTextView(false);
    } else {
      setTextView(true);
    }
  };

  const handleBonusToggle = () => {
    if (showArmyBonus) {
      setShowArmyBonus(false);
    } else {
      setShowArmyBonus(true);
    }
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(getTextView());
    setCopyLabel("Copied!");
    window.setTimeout(() => setCopyLabel("Copy"), 3000);
  };

  const createScreenshot = () => {
    let rosterList = document.getElementById("rosterList");
    let copyBtn = document.getElementById("copyBtn");
    if (copyBtn) {
      copyBtn.style.display = "none";
    }
    html2canvas(rosterList).then(function (data) {
      setScreenshot(data.toDataURL());
    });
    if (copyBtn) {
      copyBtn.style.display = "inline-block";
    }
    setShowScreenshotModal(true);
  };

  const getTextView = () => {
    let tableString = "";
    tableString += `| Total Points: ${roster.points} | Total Units: ${roster.num_units} | Break Point: ${Math.round(0.5 * roster.num_units * 100) / 100} | Bows: ${roster.bow_count} |`;
    tableString += `\n\nAlliance Level: ${allianceLevel}\n\n`;
    roster.warbands.map((warband) => {
      tableString += "----------------------------------------\n";
      tableString += `Warband ${warband.num} (${warband.points} points)\n`;
      if (warband.hero != null) {
        if (roster["leader_warband_num"] === warband.num) {
          tableString += `  ${warband.hero.name} *LEADER* (${warband.hero.pointsTotal} points)\n`;
        } else {
          tableString += `  ${warband.hero.name} (${warband.hero.pointsTotal} points)\n`;
        }
        warband.hero.options.map((option) => {
          if (option.opt_quantity > 0) {
            tableString += `    - ${option.max > 1 ? option.opt_quantity + " " + option.option : option.option}\n`;
          }
          return null;
        });
      }
      warband.units.map((unit) => {
        if (unit.name != null) {
          tableString += `  ${unit.quantity}x ${unit.name} (${unit.pointsTotal} points)\n`;
          unit.options.map((option) => {
            if (option.opt_quantity > 0) {
              tableString += `    - ${option.max > 1 ? option.opt_quantity + " " + option.option : option.option}\n`;
            }
            return null;
          });
        }
        return null;
      });
      return null;
    });
    tableString += "----------------------------------------\n";
    if (showArmyBonus) {
      tableString += "\n===== Army Bonuses =====\n\n";

      if (hasArmyBonus) {
        factionList.map((f) => {
          tableString += `--- ${f} ---\n\n`;
          tableString +=
            factionData[f]["armyBonus"]
              .replaceAll("<b>", "")
              .replaceAll("</b>", "")
              .replaceAll("<br/>", "\n") + "\n\n";
          return null;
        });
      } else {
        tableString += "No bonuses.";
      }
    }
    return tableString;
  };

  const downloadProfileCards = async () => {
    setDownloadSpinner(true);
    let profileCards = [];
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
      _warband.units.map((_unit) => {
        if (_unit.name != null && _unit.unit_type !== "Siege") {
          profileCards.push([_unit.profile_origin, _unit.name].join("|"));
        }
        return null;
      });
      return null;
    });
    let profileCardsSet = new Set(profileCards);
    let finalProfileCards = [...profileCardsSet];

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
      let ts = new Date();
      saveAs(
        blob,
        "MESBG-Army-Profiles-" + ts.toISOString().substring(0, 19) + ".zip",
      );
    });
    setDownloadSpinner(false);
  };

  return (
    <>
      <Modal
        show={showRosterTable}
        onHide={() => setShowRosterTable(false)}
        size="xl"
        centered
      >
        <Modal.Header closeButton>
          <Modal.Title className="w-100">
            <Stack direction="horizontal" gap={3}>
              <h4>Roster Table</h4>
              <h6 className="ms-auto mt-3">
                <Form.Check
                  type="switch"
                  id="switch-roster-show-army-bonus"
                  label="Show Army Bonus"
                  checked={showArmyBonus}
                  onChange={handleBonusToggle}
                />
              </h6>
              <h6 className="ms-2 me-3 mt-3">
                <Form.Check
                  type="switch"
                  id="switch-roster-text-print-view"
                  label="Text Print View"
                  checked={textView}
                  onChange={handleTextToggle}
                />
              </h6>
              <Button onClick={() => createScreenshot()}>
                <FaImage /> Screenshot
              </Button>
              <Button className="me-3" onClick={() => downloadProfileCards()}>
                {downloadSpinner ? (
                  <Spinner size="sm" animation="border" />
                ) : (
                  <FaDownload />
                )}{" "}
                Profile Cards
              </Button>
            </Stack>
          </Modal.Title>
        </Modal.Header>
        <Modal.Body id="rosterList">
          {!textView ? (
            <>
              <Stack direction="horizontal" gap={3} className="mb-3">
                <h6>
                  Alliance level:{" "}
                  <Badge style={{ fontSize: "14px" }} bg={allianceColour}>
                    {allianceLevel}
                  </Badge>
                </h6>
                <h6>
                  Total Points: <b>{roster.points}</b>
                </h6>
                <h6>
                  Total Units: <b>{roster.num_units}</b>
                </h6>
                <h6>
                  Break Point:{" "}
                  <b>{Math.round(0.5 * roster.num_units * 100) / 100}</b>
                </h6>
                <h6>
                  Bows: <b>{roster.bow_count}</b>
                </h6>
              </Stack>
              <Table style={{ verticalAlign: "middle" }} size="sm" bordered>
                <thead>
                  <tr>
                    <th>Warband</th>
                    <th>Name</th>
                    <th>Options</th>
                    <th>Per Unit</th>
                    <th>Quantity</th>
                    <th>Points</th>
                  </tr>
                </thead>
                <tbody>
                  {roster.warbands.map((warband) => (
                    <>
                      {warband.hero != null && (
                        <tr
                          className={warband.num % 2 === 0 ? "secondary" : ""}
                        >
                          <td
                            style={{
                              backgroundColor:
                                warband.num % 2
                                  ? "rgba(var(--bs-emphasis-color-rgb), 0.05)"
                                  : "white",
                            }}
                          >
                            <b>{warband.num}</b>{" "}
                            {roster["leader_warband_num"] === warband.num ? (
                              <span>
                                - <GiQueenCrown /> Leader
                              </span>
                            ) : (
                              ""
                            )}
                          </td>
                          <td
                            style={{
                              backgroundColor:
                                warband.num % 2
                                  ? "rgba(var(--bs-emphasis-color-rgb), 0.05)"
                                  : "white",
                            }}
                          >
                            {warband.hero.name}
                          </td>
                          <td
                            style={{
                              backgroundColor:
                                warband.num % 2
                                  ? "rgba(var(--bs-emphasis-color-rgb), 0.05)"
                                  : "white",
                              maxWidth: "350px",
                            }}
                          >
                            {warband.hero.options
                              .map((option) =>
                                option.opt_quantity > 0
                                  ? option.max > 1
                                    ? option.opt_quantity + " " + option.option
                                    : option.option
                                  : "",
                              )
                              .filter((opt) => opt !== "")
                              .join(", ")}
                          </td>
                          <td
                            style={{
                              backgroundColor:
                                warband.num % 2
                                  ? "rgba(var(--bs-emphasis-color-rgb), 0.05)"
                                  : "white",
                            }}
                          >
                            {warband.hero.pointsPerUnit}
                          </td>
                          <td
                            style={{
                              backgroundColor:
                                warband.num % 2
                                  ? "rgba(var(--bs-emphasis-color-rgb), 0.05)"
                                  : "white",
                            }}
                          >
                            {warband.hero.quantity}
                          </td>
                          <td
                            style={{
                              backgroundColor:
                                warband.num % 2
                                  ? "rgba(var(--bs-emphasis-color-rgb), 0.05)"
                                  : "white",
                            }}
                          >
                            {warband.hero.pointsTotal}
                          </td>
                        </tr>
                      )}
                      {warband.units.map((unit) => (
                        <>
                          {unit.name != null && (
                            <tr>
                              <td
                                style={{
                                  backgroundColor:
                                    warband.num % 2
                                      ? "rgba(var(--bs-emphasis-color-rgb), 0.05)"
                                      : "white",
                                }}
                              ></td>
                              <td
                                style={{
                                  backgroundColor:
                                    warband.num % 2
                                      ? "rgba(var(--bs-emphasis-color-rgb), 0.05)"
                                      : "white",
                                }}
                              >
                                {unit.name}
                              </td>
                              <td
                                style={{
                                  backgroundColor:
                                    warband.num % 2
                                      ? "rgba(var(--bs-emphasis-color-rgb), 0.05)"
                                      : "white",
                                }}
                              >
                                {unit.options
                                  .map((option) =>
                                    option.opt_quantity > 0
                                      ? option.max > 1
                                        ? option.opt_quantity +
                                          " " +
                                          option.option
                                        : option.option
                                      : "",
                                  )
                                  .filter((opt) => opt !== "")
                                  .join(", ")}
                              </td>
                              <td
                                style={{
                                  backgroundColor:
                                    warband.num % 2
                                      ? "rgba(var(--bs-emphasis-color-rgb), 0.05)"
                                      : "white",
                                }}
                              >
                                {unit.pointsPerUnit}
                              </td>
                              <td
                                style={{
                                  backgroundColor:
                                    warband.num % 2
                                      ? "rgba(var(--bs-emphasis-color-rgb), 0.05)"
                                      : "white",
                                }}
                              >
                                {unit.quantity}
                              </td>
                              <td
                                style={{
                                  backgroundColor:
                                    warband.num % 2
                                      ? "rgba(var(--bs-emphasis-color-rgb), 0.05)"
                                      : "white",
                                }}
                              >
                                {unit.pointsTotal}
                              </td>
                            </tr>
                          )}
                        </>
                      ))}
                    </>
                  ))}
                </tbody>
              </Table>
              {showArmyBonus && (
                <>
                  {hasArmyBonus ? (
                    <>
                      <h6>
                        Army Bonuses <FcCheckmark />
                      </h6>
                      <hr />
                      {factionList.map((f) => (
                        <div>
                          <h6 className="mt-4">
                            <Badge bg="dark">{f}</Badge>
                          </h6>
                          <div
                            className="text-body"
                            dangerouslySetInnerHTML={{
                              __html: factionData[f]["armyBonus"],
                            }}
                            style={{ fontSize: 14, maxWidth: "850px" }}
                          />
                        </div>
                      ))}
                    </>
                  ) : (
                    <>
                      <h6>
                        Army Bonuses <RxCross1 className="text-danger" />
                      </h6>
                      <hr />
                      <div
                        className="mt-4 text-body"
                        dangerouslySetInnerHTML={{
                          __html: "No bonuses.",
                        }}
                        style={{ fontSize: 14, maxWidth: "850px" }}
                      />
                    </>
                  )}
                </>
              )}
            </>
          ) : (
            <Stack direction="horizontal" gap={3}>
              <pre style={{ maxWidth: "800px" }}>{getTextView()}</pre>
              <Button
                id="copyBtn"
                variant="light"
                className="ms-auto mb-auto border"
                onClick={handleCopy}
              >
                <GoCopy /> {copyLabel}
              </Button>
            </Stack>
          )}
        </Modal.Body>
      </Modal>
      <Modal
        show={showScreenshotModal}
        onHide={() => setShowScreenshotModal(false)}
        size="xl"
        centered
      >
        <Modal.Header closeButton>
          <Modal.Title>
            <h4 className="mb-4">
              <FaImage /> Screenshot - Roster List
            </h4>
            <h6>
              The following is a screenshot image of your roster list which you
              can download, or copy to your clipboard as you wish.
            </h6>
          </Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <div className="screenshot m-3">
            {screenshot != null && (
              <img
                className="border shadow border-secondary"
                src={screenshot}
                alt=""
              />
            )}
          </div>
        </Modal.Body>
      </Modal>
    </>
  );
}
