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
import { FaRegCopyright } from "react-icons/fa";
import { MdReportGmailerrorred } from "react-icons/md";  
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
  const VERSION = "3.8.0"
  const UPDATED = "09-Feb-24"
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
  const [specialArmyOptions, setSpecialArmyOptions] = useState([]);
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
    factions = [...factions];
    setFactionList(factions);
    let newAllianceLevel = calculateAllianceLevel(factions, faction_type);
    setAllianceLevel(newAllianceLevel);

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
        if (_warband.hero.model_id == "[the_iron_hills] iron_hills_chariot_(captain)") {
          modelCounts[f] = modelCounts[f] + (_warband.hero.siege_crew - 1);
        }
        if (_warband.hero.unit_type == "Siege Engine") {
          modelCounts[f] = modelCounts[f] + (_warband.hero.siege_crew - 1);
          _warband.hero.options.map((opt) => {
            if (opt.option == "Additional Crew") {
              modelCounts[f] = modelCounts[f] + opt.opt_quantity;
            }
          });
        }
        _warband.units.map((_unit) => {
          if (_unit.name != null && _unit.unit_type == "Warrior" && _unit.bow_limit) {
            modelCounts[f] = modelCounts[f] + ((_unit.siege_crew > 0 ? _unit.siege_crew : 1) * _unit.quantity);
            if (_unit.inc_bow_count) {
              bowCounts[f] = bowCounts[f] + ((_unit.siege_crew > 0 ? _unit.siege_crew : 1) * _unit.quantity);
            }
          } 
        });
      }
    });
    setFactionBowCounts(bowCounts);
    setFactionModelCounts(modelCounts);

    let newUniqueModels = getAllUniqueModels()
    setUniqueModels(newUniqueModels);

    checkWarnings(newUniqueModels, factions, newAllianceLevel);
  }, [roster]);

  useEffect(() => {
    //If alliance level changes, and Halls of Thranduil is included in army, there might be some changes needed for Mirkwood Rangers.
    if (factionList.includes("Halls of Thranduil")) {
      let newRoster = handleMirkwoodRangers(roster, allianceLevel);
      setRoster(newRoster);
    }
    //If alliance level chaneges, and Army of Lake-town is included in army, there might be some changes needed for the Master of Lake-town
    if (factionList.includes("Army of Lake-town")) {
      let newRoster = handleMasterLaketown(roster, allianceLevel);
      setRoster(newRoster);
    }
    //If alliance level chaneges, and Goblin-town is included in army, there might be some changes needed for the warband sizes
    if (factionList.includes("Goblin-town")) {
      let newRoster = handleGoblinTown(roster, allianceLevel);
      setRoster(newRoster);
    }
    //If alliance level chaneges, and The Trolls are included in army, there might be some changes needed for Bill's campfire
    if (factionList.includes("The Trolls")) {
      let newRoster = handleBillCampfire(roster, allianceLevel);
      setRoster(newRoster);
    }

  }, [allianceLevel]);

  const downloadProfileCards = async () => {
    setDownloadSpinner(true);
    let profileCards = new Set()
    roster.warbands.map((_warband) => {
      if (_warband.hero) {
        profileCards.add([_warband.hero.profile_origin, _warband.hero.name]);
        if (hero_constraint_data[_warband.hero.model_id][0]['extra_profiles'].length > 0) {
          hero_constraint_data[_warband.hero.model_id][0]['extra_profiles'].map((_profile) => {
            profileCards.add([_warband.hero.profile_origin, _profile]);
          })
        }
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

  const checkWarnings = (_uniqueModels, faction_list, newAllianceLevel) => {
    let newWarnings = []
    _uniqueModels.map(model_id => {
      if (model_id in warning_rules) {
        let rules = warning_rules[model_id]
        rules.map(rule => {
          if (rule['type'] == 'requires_alliance' && rule.dependencies[0] != newAllianceLevel) {
            newWarnings.push(rule.warning);
          }
          let intersection = rule.dependencies.filter(x => _uniqueModels.includes(x));
          if (rule['type'] == 'requires_all' && intersection.length != rule.dependencies.length) {
            newWarnings.push(rule.warning);
          } 
          if (rule['type'] == 'requires_one' && intersection.length == 0 ) {
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
      return 'Legendary Legion';
    }
    else if (_factionList.length == 0) {
      // If no factions currently selected
      return 'n/a';
    }
    else if (_factionList.length == 1) {
      // If just one faction selected
      return 'Historical';
    } else {
      // Create all possible pairs from the list of factions
      let faction_pairs = _factionList.flatMap((v, i) => _factionList.slice(i+1).map(w => [v, w]));
      // Calculate the alliance level for each pair
      let pairs_alliances = faction_pairs.map(pair => checkAlliance(pair[0], pair[1]))
      // The lowest alliance level found between the pairs becomes the overall alliance level of the army roster
      if (pairs_alliances.includes('Impossible')) {
        return 'Impossible';
      } else if (pairs_alliances.includes('Convenient')) {
        return 'Convenient';
      } else {
        return 'Historical';
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
    if (newRoster['leader_warband_num'] == warbandNum) {
      newRoster['leader_warband_num'] = null;
    }
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

  const handleMirkwoodRangers = (roster, alliance_level) => {
    // Specific logic for Mirkwood Rangers and counting towards bow limit, depending on if the alliance level is Historical or not.
    let newRoster = { ...roster };
    let newWarbands = newRoster.warbands.map((warband) => {
      let newWarband = { ...warband };
      let newUnits = newWarband.units.map((_unit) => {
        let newUnit = { ..._unit };
        if (newUnit.model_id == '[halls_of_thranduil] mirkwood_ranger') {
          newUnit["inc_bow_count"] = alliance_level == 'Historical' ? false : true;
          newUnit["bow_limit"] = alliance_level == 'Historical' ? false : true;;
        }
        return newUnit;
      });
      newWarband.units = newUnits;
      return newWarband;
    });
    newRoster.warbands = newWarbands;
    return newRoster
  };

  const handleMasterLaketown = (roster, alliance_level) => {
    // Specific logic for Master of Lake-town's heroic tier, depending on if the alliance level is Historical or not.
    let newRoster = { ...roster };
    let newWarbands = newRoster.warbands.map((warband) => {
      let newWarband = { ...warband };
      if (newWarband.hero && newWarband.hero.model_id == "[army_of_lake-town] master_of_lake-town") {
        let newHero = newWarband.hero
        newHero.warband_size = alliance_level == 'Historical' ? 15 : 12;
        newHero.unit_type = alliance_level == 'Historical' ? "Hero of Valour" : "Hero of Fortitude";
        newWarband.max_units = alliance_level == 'Historical' ? 15 : 12;
        newWarband.hero = newHero;
      }
      return newWarband;
    });
    newRoster.warbands = newWarbands;
    return newRoster
  };

  const handleGoblinTown = (roster, alliance_level) => {
    // Specific logic for Goblin-town warband sizes, depending on if the alliance level is Historical or not.
    let sizes = {
      "Hero of Legend": 18,
      "Hero of Valour": 15,
      "Hero of Fortitude": 12,
      "Minor Hero": 6
    }

    let newRoster = { ...roster };
    let newWarbands = newRoster.warbands.map((warband) => {
      let newWarband = { ...warband };
      if (newWarband.hero && newWarband.hero.faction == "Goblin-town") {
        let newHero = newWarband.hero
        newHero.warband_size = alliance_level == 'Historical' ? sizes[newHero.unit_type] + 6 : sizes[newHero.unit_type];
        newWarband.max_units = alliance_level == 'Historical' ? sizes[newHero.unit_type] + 6 : sizes[newHero.unit_type];
        newWarband.hero = newHero;
      }
      return newWarband;
    });
    newRoster.warbands = newWarbands;
    return newRoster
  };

  const handleBillCampfire = (roster, alliance_level) => {
    // Specific logic for Bill the Troll's campfire cost, depending on if the alliance level is Historical or not.
    let newRoster = { ...roster };
    let newWarbands = newRoster.warbands.map((warband) => {
      let newWarband = { ...warband };
      let newHero = { ...newWarband.hero }
      if (newHero.model_id == "[the_trolls] bill_the_troll") {
        let newOptions = newHero.options.map((_option) => {
          let newOption = { ..._option };
          if(newOption.option == "Campfire") {
            if (newOption.opt_quantity == 1) {
              newRoster['points'] = newRoster['points'] - newHero['pointsTotal']
              newWarband['points'] = newWarband['points'] - newHero['pointsTotal'];
              newHero['pointsPerUnit'] = newHero['pointsPerUnit'] - newOption['points']
              newOption['points'] = alliance_level == 'Historical' ? 0 : 15
              newHero['pointsPerUnit'] = newHero['pointsPerUnit'] + newOption['points']
              newHero['pointsTotal'] = newHero['pointsPerUnit']
              newWarband['points'] = newWarband['points'] + newHero['pointsTotal'];
              newRoster['points'] = newRoster['points'] + newHero['pointsTotal']
            } else {
              newOption['points'] = alliance_level == 'Historical' ? 0 : 15
            }
          }
          return newOption
        });
        newHero.options = newOptions
        newWarband.hero = newHero
      }
      return newWarband;
    });
    newRoster.warbands = newWarbands
    return newRoster;
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
    <div style={{minHeight: "750px"}}>
      <Navbar style={{ minWidth: "1450px" }} bg="dark" data-bs-theme="dark" className="sticky-nav">
        <Navbar.Brand className="ms-4">
        <Stack direction="horizontal" gap={3}>
          <Stack>
          <Stack direction="horizontal" gap={3}>
            <img src={require("./images/title-logo.png")} />
            <Stack>
              <p className="p-0 m-0" style={{ fontSize: "24px" }}>
                MESBG List Builder
              </p>
              <p className="p-0 m-0" style={{ fontSize: "16px" }}>
                version {VERSION} (updated {UPDATED})
              </p>
            </Stack>
          </Stack>
            <p className="mt-3 ms-3 m-0 p-0 text-muted" style={{ fontSize: "14px" }}>
              <MdReportGmailerrorred style={{ fontSize: "20px" }} /> For any bugs and corrections, please contact: <a href="mailto:avcordaro@gmail.com?subject=MESBG List Builder - Bug/Correction">avcordaro@gmail.com</a>
            </p>
          </Stack>
          <Stack style={{ width: "850px" }}>
            <Stack className="mt-3 ms-4" direction="horizontal" gap={3}>
              <Button className="ms-auto" disabled={uniqueModels.length == 0} onClick={() => setShowRosterTable(true)}><FaTableList/> Roster Table</Button>
              <Button disabled={uniqueModels.length == 0} onClick={() => handleExportJSON()}><BiLinkAlt /> Export JSON</Button>
              <Button onClick={() => setShowImportModal(true)}><BiSolidFileImport /> Import JSON</Button>
            </Stack>
            <Stack className="mt-4 ms-4" direction="horizontal" gap={4}>
              <h6 className="mb-0 mt-2">Total Points: <b>{roster.points}</b></h6>
              <h6 className="mb-0 mt-2">Total Units: <b>{roster.num_units}</b></h6>
              <h6 className="mb-0 mt-2">50%: <b>{Math.ceil(0.5 * roster.num_units)}</b></h6>
              <h6 className="mb-0 mt-2">25%: <b>{Math.floor(0.25 * roster.num_units)}</b></h6>
              <h6 className="mb-0 mt-2">Bows: <b>{roster.bow_count}</b></h6>
              <h6 className="mb-0 mt-2 ms-auto text-muted" style={{ fontSize: "14px" }}>Developed by avcordaro | <FaRegCopyright /> 2024</h6>
            </Stack>
          </Stack>
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
                    {[...faction_lists[f_type]].sort().map((f) => (
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
                              allianceLevel={allianceLevel}
                              specialArmyOptions={specialArmyOptions}
                              setSpecialArmyOptions={setSpecialArmyOptions}
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
                              allianceLevel={allianceLevel}
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
                <p className={factionBowCounts[f] > Math.ceil(faction_data[f]['bow_limit'] * factionModelCounts[f]) ? 'text-danger' : 'text-dark'}>
                  <b>{f}:</b>{" (" + faction_data[f]['bow_limit']*100 + "% limit - " + Math.ceil(faction_data[f]['bow_limit'] * factionModelCounts[f]) + " bows)"} <b>{factionBowCounts[f]} / {factionModelCounts[f]}</b>
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
              style={{ width: "850px" }}
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
                <Card.Text className="ms-4">
                  Warband: <b>{warband.num}</b>
                </Card.Text>
                <Card.Text className={warband.num_units > warband.max_units ? "ms-4 text-warning" : "ms-4"}>
                  Units: <b>{warband.num_units} / {warband.max_units}</b>
                </Card.Text>
                <Card.Text className="ms-4">
                  Points: <b>{warband.points}</b>
                </Card.Text>
                <Card.Text className="ms-4">
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
                  specialArmyOptions={specialArmyOptions}
                  setSpecialArmyOptions={setSpecialArmyOptions}
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
                      specialArmyOptions={specialArmyOptions}
                    />
                  )
                )}
              {(warband.hero != null && !['Independent Hero', 'Independent Hero*', 'Siege Engine'].includes(warband.hero.unit_type) 
                && warband.hero.model_id != "[erebor_reclaimed_(king_thorin)] iron_hills_chariot_(champions_of_erebor)") 
                && warband.hero.model_id !="[desolator_of_the_north] smaug"  &&
                <Button
                  onClick={() => handleNewWarrior(warband.num)}
                  variant={"info"}
                  className="m-1"
                  style={{ width: "820px" }}
                >
                  Add Unit <FaPlus />
                </Button>
             }
            </Card>
          ))}
          <Button onClick={() => handleNewWarband()} style={{ width: "850px" }}>
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
            <>
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
              {cardUnitData.unit_type.includes("Hero") && hero_constraint_data[cardUnitData.model_id][0]['extra_profiles'].length != 0 && (
                hero_constraint_data[cardUnitData.model_id][0]['extra_profiles'].map((profile) => (
                  <img
                    className="profile_card border border-secondary mt-3"
                    src={(() => {
                      try {
                        return require("./images/" + cardUnitData.profile_origin + "/cards/" + profile + ".jpg")
                      } 
                      catch (e) {
                        return require("./images/default_card.jpg")
                      }
                    })()}
                  />
                ))
              )}
            </>
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