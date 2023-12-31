import mesbg_data from "./mesbg_data.json";
import faction_data from "./faction_data.json";
import hero_constraint_data from "./hero_constraint_data.json";
import warning_rules from "./warning_rules.json";
import Card from "react-bootstrap/Card";
import Stack from "react-bootstrap/Stack";
import Dropdown from "react-bootstrap/Dropdown";
import Button from "react-bootstrap/Button";
import DropdownButton from "react-bootstrap/DropdownButton";
import Form from "react-bootstrap/Form";
import Navbar from "react-bootstrap/Navbar";
import Alert from "react-bootstrap/Alert";
import Modal from 'react-bootstrap/Modal';
import Tab from 'react-bootstrap/Tab';
import Tabs from 'react-bootstrap/Tabs';
import Badge from "react-bootstrap/Badge";
import { SelectionUnit } from "./components/SelectionUnit.js"
import { DefaultHeroUnit } from "./components/DefaultHeroUnit.js"
import { DefaultWarriorUnit } from "./components/DefaultWarriorUnit.js"
import { RosterHero } from "./components/RosterHero.js"
import { RosterWarrior } from "./components/RosterWarrior.js"
import { ModalRosterTable } from "./components/ModalRosterTable.js"
import { Alliances } from "./components/Alliances.js"
import React, { useState, useEffect } from "react";
import { FaPlus } from "react-icons/fa";  
import { FaTableList } from "react-icons/fa6";  
import { MdDelete } from "react-icons/md";
import { FcCheckmark } from "react-icons/fc";
import { LuSwords } from "react-icons/lu";
import { RxCross1 } from "react-icons/rx";
import { ImCross } from "react-icons/im";
import { IoWarningOutline } from "react-icons/io5"; 
import { BiLinkAlt, BiSolidFileImport } from "react-icons/bi";
import { v4 as uuid } from "uuid";
import JSZip from "jszip";
import { saveAs } from "file-saver";
import "bootstrap/dist/css/bootstrap.min.css";
import "./App.css";

export default function App() {
  const VERSION = "3.1.3"
  const faction_lists = {
    "Good Army": new Set(mesbg_data.filter(data => data.faction_type == "Good Army").map((data) => data.faction)),
    "Evil Army": new Set(mesbg_data.filter(data => data.faction_type == "Evil Army").map((data) => data.faction)),
    "Good LL": new Set(mesbg_data.filter(data => data.faction_type == "Good LL").map((data) => data.faction)),    
    "Evil LL": new Set(mesbg_data.filter(data => data.faction_type == "Evil LL").map((data) => data.faction))
  }
  const [factionSelection, setFactionSelection] = useState({
    "Good Army": "Minas Tirith",
    "Evil Army": "Mordor",
    "Good LL": "The Return of the King",
    "Evil LL": "The Host of the Dragon Emperor"
  });
  const allianceColours = {
    "Historical": "success",
    "Convenient": "warning",
    "Impossible": "danger",
    "Legendary Legion": "info",
    "n/a": "secondary"
  }
  const [tabSelection, setTabSelection] = useState("Good Army");
  const [heroSelection, setHeroSelection] = useState(false);
  const [warbandNumFocus, setWarbandNumFocus] = useState(0);
  const [newWarriorFocus, setNewWarriorFocus] = useState("");
  const [roster, setRoster] = useState({version: VERSION, num_units: 0, points: 0, bow_count: 0, warbands: []});
  const [uniqueModels, setUniqueModels] = useState([]);
  const [displaySelection, setDisplaySelection] = useState(false);
  const [JSONImport, setJSONImport] = useState("");
  const [exportAlert, setExportAlert] = useState(false);
  const [importAlert, setImportAlert] = useState(false);
  const [showCardModal, setShowCardModal] = useState(false);
  const [showImportModal, setShowImportModal] = useState(false); 
  const [cardUnitData, setCardUnitData] = useState(null); 
  const [showRosterTable, setShowRosterTable] = useState(false);
  const [factionType, setFactionType] = useState("");
  const [factionList, setFactionList] = useState([]);
  const [factionBowCounts, setFactionBowCounts] = useState({});
  const [factionModelCounts, setFactionModelCounts] = useState({});
  const [allianceLevel, setAllianceLevel] = useState("n/a");
  const [showAlliances, setShowAlliances] = useState(false);
  const [warnings, setWarnings] = useState([]);
  const [downloadSpinner, setDownloadSpinner] = useState(false);
  
  useEffect(() => {
    // Every time roster is updated, update the faction type of the army roster e.g. Good Army
    let faction_types = roster.warbands.map((warband) => {
      if (warband.hero) {
        return warband.hero.faction_type
      }
    })
    faction_types = faction_types.filter((e) => e !== undefined)
    let faction_type = faction_types.length == 0 ? "" : faction_types[0]
    setFactionType(faction_type);

    // Every time roster is updated, update the list of unique factions currently in the roster.
    let factions = roster.warbands.map(warband => {
      if (warband.hero) {
        return warband.hero.faction
      }
    });
    factions = new Set(factions.filter((e) => e !== undefined));
    factions = [...factions]
    setFactionList(factions);
    calculateAllianceLevel(factions, faction_type)

    // Every time roster is updated, update count of bows per faction
    let bowCounts = {};
    let modelCounts = {};
    roster.warbands.map((_warband) => {
      if (_warband.hero) {
        let f = _warband.hero.faction;
        if (!bowCounts.hasOwnProperty(f)) {
          bowCounts[f] = 0;
        }
        if (!modelCounts.hasOwnProperty(f)) {
          modelCounts[f] = 0;
        }
        _warband.units.map((_unit) => {
          console.log(_unit.name != null)
          console.log(_unit.type == "Warrior")
          console.log(_unit.bow_limit)
          if (_unit.name != null && _unit.unit_type == "Warrior" && _unit.bow_limit) {
            console.log("Success")
            modelCounts[f] = modelCounts[f] + ((_unit.siege_crew > 0 ? _unit.siege_crew : 1) * _unit.quantity);
            if (_unit.inc_bow_count) {
              bowCounts[f] = bowCounts[f] + ((_unit.siege_crew > 0 ? _unit.siege_crew : 1) * _unit.quantity);
            }
          }
        });
      }
      console.log(bowCounts);
      console.log(modelCounts);
    });
    setFactionBowCounts(bowCounts);
    setFactionModelCounts(modelCounts);

    let newUniqueModels = getAllUniqueModels()
    setUniqueModels(newUniqueModels);

    checkWarnings(newUniqueModels, factions);
  }, [roster]);

  const downloadProfileCards = async () => {
    setDownloadSpinner(true);
    let profileCards = new Set()
    roster.warbands.map((_warband) => {
      if (_warband.hero) {
        profileCards.add([_warband.hero.profile_origin, _warband.hero.name]);
      }
      _warband.units.map((_unit) => {
        if (_unit.name != null) {
          profileCards.add([_unit.profile_origin, _unit.name]);
        }
      });
    });
    profileCards = [ ...profileCards ]

    const zip = new JSZip();
    for (const card of profileCards) {
      const blob = await fetch(require('./images/' + card[0] + /cards/ + card[1] + ".jpg")).then(res => res.blob());
      zip.file(card[1] + ".jpg", blob, {binary:true});
    }
    zip.generateAsync({type: "blob"}).then((blob) => {
      let ts = new Date()
      saveAs(blob, "MESBG-Army-Profiles-" + ts.toISOString().substring(0, 19) + ".zip");
    });
    setDownloadSpinner(false);
  }

  const getAllUniqueModels = () => {
    let newUniqueModels = new Set()
    roster.warbands.map((_warband) => {
      if (_warband.hero) {
        newUniqueModels.add(_warband.hero.model_id);
      }
      _warband.units.map((_unit) => {
        if (_unit.name != null) {
          newUniqueModels.add(_unit.model_id);
        }
      });
    });
    return [ ...newUniqueModels ]
  }

  const checkWarnings = (_uniqueModels, faction_list) => {
    let newWarnings = []
    _uniqueModels.map(model_id => {
      if (model_id in warning_rules) {
        let rules = warning_rules[model_id]
        rules.map(rule => {
          let intersection = rule.dependencies.filter(x => _uniqueModels.includes(x));
          if (rule['type'] == 'requires' && intersection.length != rule.dependencies.length) {
            newWarnings.push(rule.warning);
          } 
          if (rule['type'] == 'incompatible' && (intersection.length > 0 || rule.dependencies.length == 0)) {
            newWarnings.push(rule.warning);
          }
        });
      }
    });
    faction_list.map(faction => {
      if (faction in warning_rules) {
        let rules = warning_rules[faction]
        rules.map(rule => {
          let intersection = rule.dependencies.filter(x => _uniqueModels.includes(x));
          if (rule['type'] == 'compulsory' && intersection.length == 0) {
            newWarnings.push(rule.warning);
          }
        });
      }
    });
    setWarnings(newWarnings);
  };

  const checkAlliance = (army_A, army_B) => {
    // Checks the alliance level between two given armies
    if (faction_data[army_A]['primaryAllies'].includes(army_B)) {
      return 'Historical'
    } else if (faction_data[army_A]['secondaryAllies'].includes(army_B)){
      return 'Convenient'
    }
    return 'Impossible'
  };

  const calculateAllianceLevel = (_factionList, _factionType) => {
    // Calculates overall alliance level for current army roster selection
    if (_factionType.includes('LL')) {
      setAllianceLevel('Legendary Legion');
    }
    else if (_factionList.length == 0) {
      // If no factions currently selected
      setAllianceLevel('n/a');
    }
    else if (_factionList.length == 1) {
      // If just one faction selected
      setAllianceLevel('Historical');
    } else {
      // Create all possible pairs from the list of factions
      let faction_pairs = _factionList.flatMap((v, i) => _factionList.slice(i+1).map(w => [v, w]));
      // Calculate the alliance level for each pair
      let pairs_alliances = faction_pairs.map(pair => checkAlliance(pair[0], pair[1]))
      // The lowest alliance level found between the pairs becomes the overall alliance level of the army roster
      if (pairs_alliances.includes('Impossible')) {
        setAllianceLevel('Impossible');
      } else if (pairs_alliances.includes('Convenient')) {
        setAllianceLevel('Convenient');
      } else {
        setAllianceLevel('Historical');
      }
    }
  }

  const handleFaction = (f_type, f) => {
    // Update the faction selection state variable to newly selected value
    let newFaction = { ...factionSelection }
    newFaction[f_type] = f
    setFactionSelection(newFaction);
  };

  const handleNewWarband = () => {
    // Create a new empty warband dictionary and add to the roster
    let newRoster = { ...roster };
    let newWarband = {
      id: uuid(),
      num: newRoster.warbands.length + 1,
      points: 0,
      num_units: 0,
      max_units: "-",
      bow_count: 0,
      hero: null,
      units: [],
    };
    newRoster.warbands.push(newWarband);
    setRoster(newRoster);
    setDisplaySelection(false);
  };

  const handleDeleteWarband = (warbandNum) => {
    let newRoster = { ...roster };
    let model_ids = newRoster.warbands[warbandNum - 1].units.map(data => data.model_id);
    if (newRoster.warbands[warbandNum - 1].hero) {
      model_ids.push(newRoster.warbands[warbandNum - 1].hero.model_id);
    }

    // Substract the warband's points, bows and unit counts from the overall roster
    newRoster.warbands.map((warband) => {
      if (warband.num == warbandNum) {
        newRoster['points'] = newRoster['points'] - warband['points']
        newRoster['bow_count'] = newRoster['bow_count'] - warband['bow_count']
        
        // Bit of awkward logic here for siege engines where the whole siege crew needs to be removed from unit count.
        if (warband.hero && warband.hero.unit_type == "Siege Engine") {
          newRoster["num_units"] = newRoster["num_units"] - warband.hero.siege_crew;
          warband.hero.options.map((option) => {
            if (option.option == "Additional Crew") {
              newRoster["num_units"] = newRoster["num_units"] - option.opt_quantity;
            }
          });
        } else {
          newRoster['num_units'] = newRoster['num_units'] - warband['num_units'] - (warband.hero != null ? 1 : 0)
        }
      }
    });
    // Remove the warband from the roster, and for all warbands that appear below the one being deleted, shift their warband number down by 1
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
    // Add an empty placeholder dictionary for the new unit (it will be replaced by the actual warrior that gets selected)
    let newRoster = { ...roster };
    newRoster.warbands[warbandNum - 1].units.push({ id: uuid(), name: null });
    setRoster(newRoster);
    setHeroSelection(false);
    setDisplaySelection(false);
  };

  const handleExportJSON = () => {
    /* Convert the full roster dictionary into a JSON string and save it to the user's clipboard. 
    Also notify them with an alert that fades away after 3 seconds. */
    navigator.clipboard.writeText(JSON.stringify(roster))
    setExportAlert(true)
    window.setTimeout(()=>(setExportAlert(false)), 5000)
  }

  const handleImportJSON = (e) => {
    // Attempts to read the input, convert it to JSON, and assigns the JSON dictionary to the roster state variable. 
    e.preventDefault()
    try {
        let json = JSON.parse(JSONImport);
        let valid_json = ["num_units", "points", "bow_count", "warbands"].every(key => json.hasOwnProperty(key))
        if (valid_json) {
          setRoster(json);
          setShowImportModal(false);
          setJSONImport("");
        } else {
          setImportAlert(true);
          window.setTimeout(()=>(setImportAlert(false)), 5000);
        }
    } catch(err) {
        setImportAlert(true);
        window.setTimeout(()=>(setImportAlert(false)), 5000);
    }
  }

  return (
    <div>
      <Navbar style={{ minWidth: "1525px" }} bg="dark" data-bs-theme="dark" className="sticky-nav">
        <Navbar.Brand className="ms-4">
          <Stack direction="horizontal" gap={3}>
            <img src={require("./images/title-logo.png")} />
            <Stack>
              <p className="p-0 m-0" style={{ fontSize: "24px" }}>
                MESBG List Builder
              </p>
              <p className="p-0 m-0" style={{ fontSize: "16px" }}>
                version {VERSION} (updated 06-Jan-24)
              </p>
            </Stack>
            <h6 className="mb-0" style={{ marginLeft: "30px"}}>Total Points: <b>{roster.points}</b></h6>
            <h6 className="mb-0">Total Units: <b>{roster.num_units}</b></h6>
            <h6 className="mb-0">50%: <b>{Math.ceil(0.5 * roster.num_units)}</b></h6>
            <h6 className="mb-0">25%: <b>{Math.floor(0.25 * roster.num_units)}</b></h6>
            <h6 className="mb-0">Bows: <b>{roster.bow_count}</b></h6>
            <Button className="ms-2" disabled={uniqueModels.length == 0} onClick={() => setShowRosterTable(true)}><FaTableList/> Roster Table</Button>
            <Button disabled={uniqueModels.length == 0} onClick={() => handleExportJSON()}><BiLinkAlt /> Export JSON</Button>
            <Button onClick={() => setShowImportModal(true)}><BiSolidFileImport /> Import JSON</Button>
          </Stack>
        </Navbar.Brand>
      </Navbar>
      <div className="m-4">
        <div className="optionsList border border-4 rounded position-fixed bg-white">
          {displaySelection ?
            <>
            <Button variant="light" className="ms-2 border" style={{float: "right"}} onClick={() => setDisplaySelection(false)}><ImCross /></Button>
            <Tabs activeKey={tabSelection} fill onSelect={setTabSelection}>
              {Object.keys(faction_lists).map((f_type) => ( 
                <Tab eventKey={f_type} title={f_type} disabled={!heroSelection || (factionType != "" && factionType != f_type)}>
                  <Stack gap={2}>
                    <DropdownButton
                      className="dropDownButton mt-3"
                      title={factionSelection[f_type] + " "}
                      onSelect={(e) => handleFaction(f_type, e)}
                      disabled={!heroSelection || factionType.includes("LL")}
                    >
                    {[...faction_lists[f_type]].map((f) => (
                      <Dropdown.Item
                        style={{ width: "458px", textAlign: "center" }}
                        eventKey={f}
                      >
                        <img className="faction_logo" src={require("./images/faction_logos/" + f + ".png")} />{" " + f}
                      </Dropdown.Item>
                    ))}
                    </DropdownButton>
                    {heroSelection
                      ? mesbg_data
                          .filter(
                            (data) =>
                              data.faction == factionSelection[f_type] && !['Independent Hero*', 'Warrior'].includes(data.unit_type)
                              && !(data.unique && uniqueModels.includes(data.model_id))
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
                              uniqueModels={uniqueModels}
                              warbandNumFocus={warbandNumFocus}
                              setShowCardModal={setShowCardModal}
                              setCardUnitData={setCardUnitData}
                            />
                          ))
                      : mesbg_data
                          .filter(
                            (data) =>
                              roster.warbands[warbandNumFocus].hero 
                              && hero_constraint_data[roster.warbands[warbandNumFocus].hero.model_id][0]['valid_warband_units'].includes(data.model_id)
                              && !(data.unique && uniqueModels.includes(data.model_id))
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
                              uniqueModels={uniqueModels}
                              warbandNumFocus={warbandNumFocus}
                              setShowCardModal={setShowCardModal}
                              setCardUnitData={setCardUnitData}
                            />
                    ))}
                  </Stack>
                </Tab>
              ))}
            </Tabs>
            </>
            :
            <div className="p-2">
              {warnings.length > 0 && 
                <>
                  <h6><IoWarningOutline /> Warnings</h6> 
                  <hr/>
                  {warnings.map(w => (<p className="text-danger">{w}</p>))}
                </>
              }
              <h6>Bow Limit</h6> 
              <hr/>
              {factionList.map((f) => (
                <p className={Math.round(factionBowCounts[f] / factionModelCounts[f] * 100) / 100 > faction_data[f]['bow_limit'] ? 'text-danger' : 'text-dark'}>
                  <b>{f}:</b>{" (" + faction_data[f]['bow_limit']*100 + "% limit)"} {factionBowCounts[f]} / {factionModelCounts[f]} -- <b>{factionModelCounts[f] > 0 ? Math.round(factionBowCounts[f] / factionModelCounts[f] * 100) : 0}%</b>
                </p>
              ))}
              <Stack direction="horizontal" gap={3} className="mt-5 mb-3"> 
                <h6>Alliance Level:</h6> 
                <h5><Badge bg={allianceColours[allianceLevel]}>{allianceLevel}</Badge></h5>
                <Button variant="light" className="ms-auto border" onClick={() => setShowAlliances(true)} disabled={!factionList.length || factionType.includes('LL')}><LuSwords /> Alliances</Button>
              </Stack>
              <h6 className={['Historical', 'Legendary Legion'].includes(allianceLevel) ? "text-body" : "text-secondary"}>
                  Army Bonuses {['Historical', 'Legendary Legion'].includes(allianceLevel) ? <FcCheckmark /> : <b><RxCross1 className="text-danger"/></b>}
              </h6>
              <hr/>
              {factionList.map((f) => (
                <div >
                  <h5 className="mt-4">
                    <Badge bg={['Historical', 'Legendary Legion'].includes(allianceLevel) ? "dark" : "secondary"}>
                      {f}
                    </Badge>
                  </h5>
                  <div 
                    className={['Historical', 'Legendary Legion'].includes(allianceLevel) ? "text-body" : "text-secondary"} 
                    dangerouslySetInnerHTML={{__html: faction_data[f]['armyBonus']}} 
                  />
                </div>
              ))}  
            </div>
          }
        </div>
        <Stack style={{ marginLeft: "535px" }} gap={3}>
          <Alert style={{ width: "950px", zIndex: 1050 }} className="position-fixed" show={exportAlert} variant="success" onClose={() => setExportAlert(false)} dismissible>
            <b>JSON string copied to your clipboard.</b>
            <hr />
            You can keep this somewhere safe, such as in a text file, to reload your army list again later using 'Import JSON'.
          </Alert>
          {roster.warbands.map((warband) => (
            <Card
              style={{ width: "950px" }}
              className="p-2"
              bg={"secondary"}
              text={"light"}
            >
              <Stack direction="horizontal">
                {warband.hero ?
                  <Card.Text className="ms-2" style={{fontSize: 20}}>

                    <Badge bg="dark">{warband.hero.faction}</Badge>
                  </Card.Text>
                  :
                  <Card.Text className="ms-2" style={{fontSize: 20}}>
                    <Badge bg="dark">[Faction]</Badge>
                  </Card.Text>
                }
                <Card.Text className="ms-5">
                  Warband: <b>{warband.num}</b>
                </Card.Text>
                <Card.Text className={warband.num_units > warband.max_units ? "ms-5 text-warning" : "ms-5"}>
                  Units: <b>{warband.num_units} / {warband.max_units}</b>
                </Card.Text>
                <Card.Text className="ms-5">
                  Points: <b>{warband.points}</b>
                </Card.Text>
                <Card.Text className="ms-5">
                  Bows: <b>{warband.bow_count}</b>
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
                      setTabSelection={setTabSelection}
                      factionSelection={factionSelection}
                      setFactionSelection={setFactionSelection}
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
              {(warband.hero != null && !['Independent Hero', 'Independent Hero*', 'Siege Engine'].includes(warband.hero.unit_type))  &&
                <Button
                  onClick={() => handleNewWarrior(warband.num)}
                  variant={"info"}
                  className="m-1"
                  style={{ width: "920px" }}
                >
                  Add Unit <FaPlus />
                </Button>
             }
            </Card>
          ))}
          <Button onClick={() => handleNewWarband()} style={{ width: "950px" }}>
            Add Warband <FaPlus />
          </Button>
          
        </Stack>
      </div>
      <Modal show={showCardModal} onHide={() => setShowCardModal(false)} size="xl" centered>
        <Modal.Header closeButton>
          <div>
            <h5>
              <b>{cardUnitData != null && "(" + cardUnitData.faction + ") " + cardUnitData.name}</b>
            </h5>
            <h6>You can download a zip of all profile cards for your current army list by clicking <b className="text-primary">Roster Table > Profile Cards</b></h6>
          </div>
        </Modal.Header>
        <Modal.Body style={{textAlign: "center"}}>

          {cardUnitData != null &&
            <img
              className="profile_card border border-secondary"
              src={(() => {
                try {
                  return require("./images/" + cardUnitData.profile_origin + "/cards/" + cardUnitData.name + ".jpg")
                } 
                catch (e) {
                  return require("./images/default_card.jpg")
                }
              })()}
            />
          }
        </Modal.Body>
      </Modal>
      <Modal show={showImportModal} onHide={() => setShowImportModal(false)} size="lg" centered>
        <Modal.Header closeButton>
          <Modal.Title>
            Import JSON
          </Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form noValidate style={{"textAlign": "right"}} onSubmit={handleImportJSON} className="me-4">        
            <Form.Control 
              value={JSONImport} 
              onChange={e => setJSONImport(e.target.value.replace(/^"(.*)"$/, '$1').replaceAll('""', '"'))}
              placeholder="Paste your army roster JSON string..."
            />
            {importAlert && <p style={{"textAlign": "left"}} className="mt-2 ms-2 text-danger">
              JSON string for army list is invalid. 
            </p>}
            <Button className="ms-auto mt-3" onClick={handleImportJSON} type="submit"><BiSolidFileImport /> Import JSON</Button>
          </Form>
        </Modal.Body>
      </Modal>
      <ModalRosterTable 
        allianceLevel={allianceLevel} 
        allianceColour={allianceColours[allianceLevel]} 
        roster={roster} showRosterTable={showRosterTable} 
        setShowRosterTable={setShowRosterTable} 
        downloadProfileCards={downloadProfileCards}
        downloadSpinner={downloadSpinner}
        factionList={factionList}
      />
      <Alliances showAlliances={showAlliances} setShowAlliances={setShowAlliances} factionList={factionList} />
    </div>
  );
}