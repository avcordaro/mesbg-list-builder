import Stack from "react-bootstrap/Stack";
import Modal from 'react-bootstrap/Modal'; 
import Table from 'react-bootstrap/Table';
import Badge from "react-bootstrap/Badge";
import Button from "react-bootstrap/Button";
import Spinner from 'react-bootstrap/Spinner';
import { FaDownload } from "react-icons/fa6";

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
  downloadSpinner
}) {

  return (
    <Modal show={showRosterTable} onHide={() => setShowRosterTable(false)} size="xl" centered>
        <Modal.Header closeButton>
          <Modal.Title className="w-100">
            <Stack direction="horizontal" gap={3}>
              <h6 >Alliance level:</h6>
              <h5><Badge bg={allianceColour}>{allianceLevel}</Badge></h5>
              <h6>Total Points: <b>{roster.points}</b></h6>
              <h6>Total Units: <b>{roster.num_units}</b></h6>
              <h6>50%: <b>{Math.ceil(0.5 * roster.num_units)}</b></h6>
              <h6>25%: <b>{Math.floor(0.25 * roster.num_units)}</b></h6>
              <h6>Bows: <b>{roster.bow_count}</b></h6>
              <Button className="ms-auto me-3" onClick={() => downloadProfileCards()}>
                {downloadSpinner ? <Spinner size="sm" animation="border" /> : <FaDownload />} Profile Cards
              </Button>
            </Stack>
          </Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {showRosterTable &&
            <>
              <Table style={{verticalAlign: "middle"}}size="sm" bordered striped>
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
                          <tr>
                            <td>{warband.num}</td>
                            <td>{warband.hero.name}</td>
                            <td>
                              {warband.hero.options.map((option) => (
                                option.opt_quantity > 0 ? (option.max > 1 ? 
                                  option.opt_quantity + " " + option.option : option.option) : ""
                              )).filter((opt) => (opt != "")).join(", ")}
                            </td>
                            <td>{warband.hero.pointsPerUnit}</td>
                            <td>{warband.hero.quantity}</td>
                            <td>{warband.hero.pointsTotal}</td>
                          </tr>
                        }
                        {warband.units.map((unit) => (
                          <>
                          {unit.name != null &&
                            <tr>
                              <td>{warband.num}</td>
                              <td>{unit.name}</td>
                              <td>
                                {unit.options.map((option) => (
                                  option.opt_quantity > 0 ? option.option : ""
                                )).filter((opt) => (opt != "")).join(", ")}
                              </td>
                              <td>{unit.pointsPerUnit}</td>
                              <td>{unit.quantity}</td>
                              <td>{unit.pointsTotal}</td>
                            </tr>
                          }
                          </>
                        ))}
                      </>
                    ))}
                </tbody>
              </Table>
              <div>
              </div>
            </>
          }
        </Modal.Body>
      </Modal>
  )
}