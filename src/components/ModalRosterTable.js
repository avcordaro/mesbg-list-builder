import Stack from "react-bootstrap/Stack";
import Modal from 'react-bootstrap/Modal'; 
import Table from 'react-bootstrap/Table';
import Badge from "react-bootstrap/Badge";
import Button from "react-bootstrap/Button";
import Spinner from 'react-bootstrap/Spinner';
import Form from "react-bootstrap/Form";
import { useState } from "react";
import { FaDownload } from "react-icons/fa6";
import { FcCheckmark } from "react-icons/fc";
import { RxCross1 } from "react-icons/rx";
import { GoCopy } from "react-icons/go";
import { GiQueenCrown } from "react-icons/gi";
import faction_data from "../faction_data.json";

/* Modal Roster Table is the component used to populate the pop-up modal which appears 
after the user clicks the 'Roster Table' button. This component uses the full roster
state variable (passed to it as an argument) to populate a table of the army. */

export function ModalRosterTable({
  allianceLevel,
  allianceColour,
  roster,
  showRosterTable,
  setShowRosterTable,
  downloadProfileCards,
  downloadSpinner,
  factionList
}) {
  const [textView, setTextView] = useState(false);
  const [copyLabel, setCopyLabel] = useState("Copy");

  const handleToggle = () => {
    if (textView) {
      setTextView(false);
    } else {
      setTextView(true);
    }
  }

  const handleCopy = () => {
    navigator.clipboard.writeText(getTextView());
    setCopyLabel("Copied!");
    window.setTimeout(()=>(setCopyLabel("Copy")), 3000);
  }

  const getTextView = () => {
    let tableString = ""
    tableString += `| Total Points: ${roster.points} | Total Units: ${roster.num_units} | 50%: ${Math.ceil(0.5 * roster.num_units)} | 25%: ${Math.floor(0.25 * roster.num_units)} | Bows: ${roster.bow_count} |`
    tableString += `\n\nAlliance Level: ${allianceLevel}\n\n`
    roster.warbands.map((warband) => {
      tableString += "----------------------------------------\n"
      tableString += `Warband ${warband.num} (${warband.points} points)\n`
      if (warband.hero != null) {
        if (roster['leader_warband_num'] == warband.num) {
          tableString += `  ${warband.hero.name} *LEADER* (${warband.hero.pointsTotal} points)\n`
        } else {
          tableString += `  ${warband.hero.name} (${warband.hero.pointsTotal} points)\n`
        }
        warband.hero.options.map((option) => {
          if (option.opt_quantity > 0) {
            tableString += `    - ${option.max > 1 ? option.opt_quantity + " " + option.option : option.option}\n`
          }
        });
      }
      warband.units.map((unit) => {
        if (unit.name != null) {
          tableString += `  ${unit.quantity}x ${unit.name} (${unit.pointsTotal} points)\n`
          unit.options.map((option) => {
            if (option.opt_quantity > 0) {
              tableString += `    - ${option.max > 1 ? option.opt_quantity + " " + option.option : option.option}\n`
            }
          });
        }
      });
      
    });
    tableString += "----------------------------------------\n"
    tableString += "\n===== Army Bonuses =====\n\n"

    if (['Legendary Legion', 'Historical'].includes(allianceLevel)) {
      factionList.map((f) => {
          tableString += `--- ${f} ---\n\n`
          tableString += faction_data[f]['armyBonus'].replaceAll("<b>", "").replaceAll("</b>", "").replaceAll("<br/>", "\n") + "\n\n"
      })
    } else {
      tableString += "No bonuses due to Alliance Level not being Historical."
    }
    return tableString;
  }

  return (
    <Modal show={showRosterTable} onHide={() => setShowRosterTable(false)} size="xl" centered>
        <Modal.Header closeButton>
          <Modal.Title className="w-100">
            <Stack direction="horizontal" gap={3}>
              <h4>Roster Table</h4>
              <h6 className='ms-auto me-3 mt-3'><Form.Check
                type="switch"
                label="Text Print View"
                checked={textView}
                onChange={handleToggle}
              /></h6>
              <Button className="me-3" onClick={() => downloadProfileCards()}>
                {downloadSpinner ? <Spinner size="sm" animation="border" /> : <FaDownload />} Profile Cards
              </Button>
            </Stack>
          </Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {!textView ?
            <>
              <Stack direction="horizontal" gap={3} className="mb-3">
                <h6 >Alliance level: <Badge style={{fontSize: "14px"}} bg={allianceColour}>{allianceLevel}</Badge></h6>
                <h6>Total Points: <b>{roster.points}</b></h6>
                <h6>Total Units: <b>{roster.num_units}</b></h6>
                <h6>50%: <b>{Math.ceil(0.5 * roster.num_units)}</b></h6>
                <h6>25%: <b>{Math.floor(0.25 * roster.num_units)}</b></h6>
                <h6>Bows: <b>{roster.bow_count}</b></h6>
              </Stack>
              <Table style={{verticalAlign: "middle"}}size="sm" bordered>
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
                        {warband.hero != null &&
                          <tr className={warband.num % 2 == 0 ? "secondary" : ""}>
                            <td style={{backgroundColor: warband.num % 2 ? "rgba(var(--bs-emphasis-color-rgb), 0.05)" : "white"}}><b>{warband.num}</b> {roster['leader_warband_num'] == warband.num ? <span>- <GiQueenCrown /> Leader</span> : ""}</td>
                            <td style={{backgroundColor: warband.num % 2 ? "rgba(var(--bs-emphasis-color-rgb), 0.05)" : "white"}}>{warband.hero.name}</td>
                            <td style={{backgroundColor: warband.num % 2 ? "rgba(var(--bs-emphasis-color-rgb), 0.05)" : "white"}}>
                              {warband.hero.options.map((option) => (
                                option.opt_quantity > 0 ? (option.max > 1 ? 
                                  option.opt_quantity + " " + option.option : option.option) : ""
                              )).filter((opt) => (opt != "")).join(", ")}
                            </td>
                            <td style={{backgroundColor: warband.num % 2 ? "rgba(var(--bs-emphasis-color-rgb), 0.05)" : "white"}}>{warband.hero.pointsPerUnit}</td>
                            <td style={{backgroundColor: warband.num % 2 ? "rgba(var(--bs-emphasis-color-rgb), 0.05)" : "white"}}>{warband.hero.quantity}</td>
                            <td style={{backgroundColor: warband.num % 2 ? "rgba(var(--bs-emphasis-color-rgb), 0.05)" : "white"}}>{warband.hero.pointsTotal}</td>
                          </tr>
                        }
                        {warband.units.map((unit) => (
                          <>
                          {unit.name != null &&
                            <tr>
                              <td style={{backgroundColor: warband.num % 2 ? "rgba(var(--bs-emphasis-color-rgb), 0.05)" : "white"}}></td>
                              <td style={{backgroundColor: warband.num % 2 ? "rgba(var(--bs-emphasis-color-rgb), 0.05)" : "white"}}>{unit.name}</td>
                              <td style={{backgroundColor: warband.num % 2 ? "rgba(var(--bs-emphasis-color-rgb), 0.05)" : "white"}}>
                                {unit.options.map((option) => (
                                  option.opt_quantity > 0 ? (option.max > 1 ? 
                                    option.opt_quantity + " " + option.option : option.option) : ""
                                )).filter((opt) => (opt != "")).join(", ")}
                              </td>
                              <td style={{backgroundColor: warband.num % 2 ? "rgba(var(--bs-emphasis-color-rgb), 0.05)" : "white"}}>{unit.pointsPerUnit}</td>
                              <td style={{backgroundColor: warband.num % 2 ? "rgba(var(--bs-emphasis-color-rgb), 0.05)" : "white"}}>{unit.quantity}</td>
                              <td style={{backgroundColor: warband.num % 2 ? "rgba(var(--bs-emphasis-color-rgb), 0.05)" : "white"}}>{unit.pointsTotal}</td>
                            </tr>
                          }
                          </>
                        ))}
                      </>
                    ))}
                </tbody>
              </Table>
              {['Legendary Legion', 'Historical'].includes(allianceLevel) ?
                <>
                  <h6>Army Bonuses <FcCheckmark /></h6>
                  <hr />
                  {factionList.map((f) => (
                    <div>
                      <h6 className="mt-4">
                        <Badge bg="dark">
                          {f}
                        </Badge>
                      </h6>
                      <div 
                        className="text-body"
                        dangerouslySetInnerHTML={{__html: faction_data[f]['armyBonus']}} 
                        style={{fontSize: 14, maxWidth: "850px"}}
                      />
                    </div>
                  ))}
                </>
              :
                <>
                  <h6>Army Bonuses <RxCross1 className="text-danger"/></h6>
                  <hr />
                  <div 
                    className="mt-4 text-body"
                    dangerouslySetInnerHTML={{__html: "No bonuses due to Alliance Level not being Historical."}}
                    style={{fontSize: 14, maxWidth: "850px"}}
                  />
                </>
              }
            </>
            :
            <Stack direction="horizontal" gap={3}>
              <pre style={{maxWidth: "800px"}}>
                {getTextView()}
              </pre>
              <Button variant="light" className="ms-auto mb-auto border" onClick={handleCopy}>
                <GoCopy /> {copyLabel}
              </Button>
            </Stack>
          }
        </Modal.Body>
      </Modal>
  )
}