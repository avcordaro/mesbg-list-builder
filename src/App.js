import mesbg_data from "./mesbg_data.json";
import Card from "react-bootstrap/Card";
import Stack from "react-bootstrap/Stack";
import Dropdown from "react-bootstrap/Dropdown";
import Button from "react-bootstrap/Button";
import DropdownButton from "react-bootstrap/DropdownButton";
import Form from "react-bootstrap/Form";
import Navbar from "react-bootstrap/Navbar";
import Alert from "react-bootstrap/Alert";
import Modal from 'react-bootstrap/Modal';
import { SelectionUnit } from "./components/SelectionUnit.js"
import { DefaultHeroUnit } from "./components/DefaultHeroUnit.js"
import { DefaultWarriorUnit } from "./components/DefaultWarriorUnit.js"
import { RosterHero } from "./components/RosterHero.js"
import { RosterWarrior } from "./components/RosterWarrior.js"
import { ModalRosterTable } from "./components/ModalRosterTable.js"
import React, { useState } from "react";
import { FaPlus } from "react-icons/fa";
import { MdDelete } from "react-icons/md";
import { v4 as uuid } from "uuid";
import "bootstrap/dist/css/bootstrap.min.css";
import "./App.css";

export default function App() {
  const faction_list = new Set(mesbg_data.map((data) => data.faction));
  const [faction, setFaction] = useState("Minas Tirith");
  const [heroSelection, setHeroSelection] = useState(false);
  const [warbandNumFocus, setWarbandNumFocus] = useState(0);
  const [newWarriorFocus, setNewWarriorFocus] = useState("");
  const [roster, setRoster] = useState({num_units: 0, points: 0, bow_count: 0, warbands: []});
  const [displaySelection, setDisplaySelection] = useState(false);
  const [JSONImport, setJSONImport] = useState("");
  const [exportAlert, setExportAlert] = useState(false);
  const [showCardModal, setShowCardModal] = useState(false); 
  const [cardUnitData, setCardUnitData] = useState(null); 
  const [showRosterTable, setShowRosterTable] = useState(false); 
  
  const handleFaction = (e) => {
    setFaction(e);
  };

  const handleNewWarband = () => {
    let newRoster = { ...roster };
    let newWarband = {
      id: uuid(),
      num: newRoster.warbands.length + 1,
      points: 0,
      num_units: 0,
      max_units: "-",
      hero: null,
      units: [],
    };
    newRoster.warbands.push(newWarband);
    setRoster(newRoster);
    setDisplaySelection(false);
  };

  const handleDeleteWarband = (warbandNum) => {
    let newRoster = { ...roster };
    newRoster.warbands.map((warband) => {
      if (warband.num == warbandNum) {
        newRoster['points'] = newRoster['points'] - warband['points']
        newRoster['num_units'] = newRoster['num_units'] - warband['num_units'] - (warband.hero == null ? 0 : 1)
      }
    });
    let newWarbands = newRoster.warbands.filter((data) => data.num != warbandNum);
    newWarbands = newWarbands.map((warband) => {
      let newWarband = { ...warband };
      if (warband.num > warbandNum) {
        newWarband["num"] = newWarband["num"] - 1;
      }
      return newWarband;
    });
    newRoster.warbands = newWarbands
    setRoster(newRoster);
    setDisplaySelection(false);
  };

  const handleNewWarrior = (warbandNum) => {
    let newRoster = { ...roster };
    newRoster.warbands[warbandNum - 1].units.push({ id: uuid(), name: null });
    setRoster(newRoster);
    setHeroSelection(false);
    setDisplaySelection(false);
  };

  const handleExportJSON = () => {
    navigator.clipboard.writeText(JSON.stringify(roster))
    setExportAlert(true)
    window.setTimeout(()=>(setExportAlert(false)), 3000)
  }

  const handleImportJSON = (e) => {
    e.preventDefault()
    setRoster(JSON.parse(JSONImport))
    setJSONImport("")
  }

  return (
    <div>
      <Navbar style={{ minWidth: "1750px" }} bg="dark" data-bs-theme="dark" className="justify-content-between">
        <Navbar.Brand className="ms-4">
          <Stack direction="horizontal" gap={3}>
            <img src={require("./images/title-logo.png")} />
            <Stack>
              <p className="p-0 m-0" style={{ fontSize: "24px" }}>
                Army Roster Builder
              </p>
              <p className="p-0 m-0" style={{ fontSize: "16px" }}>
                version 1.0.0
              </p>
            </Stack>
          </Stack>
        </Navbar.Brand>
        <Form onSubmit={handleImportJSON} className="me-4">
          <Stack direction="horizontal" gap={3}>             
            <Form.Control style={{ width: "400px" }} value={JSONImport} onChange={e => setJSONImport(e.target.value)}/>
            <Button onClick={handleImportJSON} type="submit">Import JSON</Button>
          </Stack>
        </Form>
      </Navbar>
      <div className="m-4">
        <div className="optionsList border position-fixed">
          {displaySelection && (
            <Stack gap={2}>
              <DropdownButton
                className="dropDownButton"
                title={faction + " "}
                onSelect={handleFaction}
              >
                {[...faction_list].map((f) => (
                  <Dropdown.Item
                    style={{ width: "455px", textAlign: "center" }}
                    eventKey={f}
                  >
                    {f}
                  </Dropdown.Item>
                ))}
              </DropdownButton>
              {heroSelection
                ? mesbg_data
                    .filter(
                      (data) =>
                        data.faction == faction && data.unit_type != "Warrior"
                    )
                    .map((row) => (
                      <SelectionUnit
                        key={uuid()}
                        newWarriorFocus={newWarriorFocus}
                        setDisplaySelection={setDisplaySelection}
                        heroSelection={heroSelection}
                        unitData={row}
                        roster={roster}
                        setRoster={setRoster}
                        warbandNumFocus={warbandNumFocus}
                        setShowCardModal={setShowCardModal}
                        setCardUnitData={setCardUnitData}
                      />
                    ))
                : mesbg_data
                    .filter(
                      (data) =>
                        data.faction == faction && data.unit_type == "Warrior"
                    )
                    .map((row) => (
                      <SelectionUnit
                        key={uuid()}
                        newWarriorFocus={newWarriorFocus}
                        setDisplaySelection={setDisplaySelection}
                        heroSelection={heroSelection}
                        unitData={row}
                        roster={roster}
                        setRoster={setRoster}
                        warbandNumFocus={warbandNumFocus}
                        setShowCardModal={setShowCardModal}
                        setCardUnitData={setCardUnitData}
                      />
                    ))}
            </Stack>
          )}
        </div>
        <Stack style={{ marginLeft: "535px" }} gap={3}>
          <Alert style={{ width: "1130px" }} show={exportAlert} variant="success" onClose={() => setExportAlert(false)} dismissible>
            JSON copied to clipboard.
          </Alert>
          <Stack style={{ width: "1130px" }} direction="horizontal" gap={3}>
            <h4>
              <b>Army Roster</b>
            </h4>
            <h5 className="ms-auto">Total Points: <b>{roster.points}</b></h5>
            <h5>Total Units: <b>{roster.num_units}</b></h5>
            <h5>50%: <b>{Math.ceil(0.5 * roster.num_units)}</b></h5>
            <h5>25%: <b>{Math.floor(0.25 * roster.num_units)}</b></h5>
            <h5 className={roster.bow_count > Math.ceil(0.333 * roster.num_units) ? "text-warning" : ""}>Bows: <b>{roster.bow_count} / {Math.ceil(0.333 * roster.num_units)}</b></h5>
            <Button onClick={() => handleExportJSON()}>Export JSON</Button>
            <Button onClick={() => setShowRosterTable(true)}>Roster Table</Button>
          </Stack>
          {roster.warbands.map((warband) => (
            <Card
              style={{ width: "1130px" }}
              className="p-2"
              bg={"secondary"}
              text={"light"}
            >
              <Stack direction="horizontal">
                <Card.Text className="ms-2">
                  Warband: <b>{warband.num}</b>
                </Card.Text>
                <Card.Text className={warband.num_units > warband.max_units ? "ms-5 text-warning" : "ms-5"}>
                  Units: <b>{warband.num_units} / {warband.max_units}</b>
                </Card.Text>
                <Card.Text className="ms-5">
                  Points: <b>{warband.points}</b>
                </Card.Text>
                <Button
                  onClick={() => handleDeleteWarband(warband.num)}
                  className="ms-auto mb-3"
                  style={{ marginRight: "10px" }}
                  variant={"danger"}
                >
                  <MdDelete />
                </Button>
              </Stack>
              {warband.hero == null ? (
                <DefaultHeroUnit
                  key={uuid()}
                  setHeroSelection={setHeroSelection}
                  setDisplaySelection={setDisplaySelection}
                  warbandNum={warband.num}
                  setWarbandNumFocus={setWarbandNumFocus}
                />
              ) : (
                <RosterHero
                  key={warband.hero.id}
                  warbandNum={warband.num}
                  unitData={warband.hero}
                  roster={roster}
                  setRoster={setRoster}
                  setShowCardModal={setShowCardModal}
                  setCardUnitData={setCardUnitData}
                />
              )}
              {warband.units.length > 0 &&
                warband.units.map((unit) =>
                  unit.name == null ? (
                    <DefaultWarriorUnit
                      key={uuid()}
                      setNewWarriorFocus={setNewWarriorFocus}
                      unitData={unit}
                      roster={roster}
                      setRoster={setRoster}
                      setHeroSelection={setHeroSelection}
                      setDisplaySelection={setDisplaySelection}
                      warbandNum={warband.num}
                      setWarbandNumFocus={setWarbandNumFocus}
                    />
                  ) : (
                    <RosterWarrior
                      key={unit.id}
                      warbandNum={warband.num}
                      unitData={unit}
                      roster={roster}
                      setRoster={setRoster}
                      setShowCardModal={setShowCardModal}
                      setCardUnitData={setCardUnitData}
                    />
                  )
                )}
              {(warband.hero != null && warband.hero.unit_type != "Independent Hero" && warband.hero.unit_type != "Siege Engine") &&
                <Button
                  onClick={() => handleNewWarrior(warband.num)}
                  variant={"info"}
                  className="m-1"
                  style={{ width: "1100px" }}
                >
                  Add Unit <FaPlus />
                </Button>
             }
            </Card>
          ))}
          <Button onClick={() => handleNewWarband()} style={{ width: "1130px" }}>
            Add Warband <FaPlus />
          </Button>
        </Stack>
      </div>
      <Modal show={showCardModal} onHide={() => setShowCardModal(false)} size="xl" centered>
        <Modal.Header closeButton>
          <Modal.Title>
            {cardUnitData != null && "(" + cardUnitData.faction + ") " + cardUnitData.name}
          </Modal.Title>
        </Modal.Header>
        <Modal.Body style={{textAlign: "center"}}>
          {cardUnitData != null &&
            <img
              className="profile_card border border-secondary"
              src={require("./images/" +
                cardUnitData.faction +
                "/cards/" +
                cardUnitData.name +
                ".jpg")}
            />
          }
        </Modal.Body>
      </Modal>
      <ModalRosterTable roster={roster} showRosterTable={showRosterTable} setShowRosterTable={setShowRosterTable} />
    </div>
  );
}