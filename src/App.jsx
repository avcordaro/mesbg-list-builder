import warning_rules from "./assets/data/warning_rules.json";
import faction_data from "./assets/data/faction_data.json";
import { ModalRosterTable } from "./components/ModalRosterTable";
import { ModalImportJSON } from "./components/ModalImportJSON";
import { ModalProfileCard } from "./components/ModalProfileCard";
import { TopNavbar } from "./components/TopNavbar";
import { Alliances, calculateAllianceLevel } from "./components/Alliances";
import { SelectionMenu } from "./components/SelectionMenu.jsx";
import { Warbands } from "./components/Warbands";
import { useEffect, useState } from "react";
// import $ from 'jquery';
import "bootstrap/dist/css/bootstrap.min.css";
import "./App.css";
import { GameMode } from "./components/GameMode";
import { ExportAlert } from "./components/ExportAlert";
import { GameModeAlert } from "./components/GameModeAlert";
import { ModalBuilderMode } from "./components/ModalBuilderMode";
import {
  checkSiegeEngineCounts,
  checkAlliedHeroes,
  checkDunharrow,
  checkGilGalad,
} from "./components/specialRules.js";
import { KeywordsSearch } from "./components/KeywordsSearch";
import { useStore } from "./state/store";

export default function App() {
  const allianceColours = {
    Historical: "success",
    Convenient: "warning",
    Impossible: "danger",
    "Legendary Legion": "info",
    "n/a": "secondary",
  };
  const [factionSelection, setFactionSelection] = useState({
    "Good Army": "Minas Tirith",
    "Evil Army": "Mordor",
    "Good LL": "The Return of the King",
    "Evil LL": "The Host of the Dragon Emperor",
  });
  const [tabSelection, setTabSelection] = useState("Good Army");
  const [heroSelection, setHeroSelection] = useState(false);
  const [warbandNumFocus, setWarbandNumFocus] = useState(0);
  const [newWarriorFocus, setNewWarriorFocus] = useState("");
  const { roster, gameMode } = useStore();
  const [factionData, setFactionData] = useState(faction_data);
  const [uniqueModels, setUniqueModels] = useState([]);
  const [specialArmyOptions, setSpecialArmyOptions] = useState([]);
  const [displaySelection, setDisplaySelection] = useState(false);
  const [exportAlert, setExportAlert] = useState(false);
  const [showCardModal, setShowCardModal] = useState(false);
  const [showImportModal, setShowImportModal] = useState(false);
  const [cardUnitData, setCardUnitData] = useState(null);
  const [showRosterTable, setShowRosterTable] = useState(false);
  const [factionType, setFactionType] = useState("");
  const [factionList, setFactionList] = useState([]);
  const [factionBowCounts, setFactionBowCounts] = useState({});
  const [factionModelCounts, setFactionModelCounts] = useState({});
  const [allianceLevel, setAllianceLevel] = useState("n/a");
  const [hasArmyBonus, setHasArmyBonus] = useState(true);
  const [showAlliances, setShowAlliances] = useState(false);
  const [warnings, setWarnings] = useState([]);
  const [gameModeAlert, setGameModeAlert] = useState(false);
  const [showBuilderModal, setShowBuilderModal] = useState(false);
  const [showKeywordSearch, setShowKeywordSearch] = useState(false);

  // $(window).scroll(function () {
  //     // stops the left-hand options menu from scrolling horizontally
  //     $('.optionsList').css('left', -$(window).scrollLeft() + 24);
  // });

  useEffect(() => {
    // Every time roster is updated, update the faction type of the army roster e.g. Good Army
    let faction_types = roster.warbands.map((warband) => {
      if (warband.hero) {
        return warband.hero.faction_type;
      }
      return null;
    });
    faction_types = faction_types.filter((e) => e !== null && e !== undefined);
    let faction_type = faction_types.length === 0 ? "" : faction_types[0];
    setFactionType(faction_type);

    // Every time roster is updated, update the list of unique factions currently in the roster.
    let factions = roster.warbands.map((warband) => {
      if (warband.hero) {
        return warband.hero.faction;
      }
      return null;
    });
    factions = new Set(factions.filter((e) => e !== null && e !== undefined));
    factions = [...factions];

    if (
      factions.includes("Wanderers in the Wild (Good)") ||
      factions.includes("Wanderers in the Wild (Evil)")
    ) {
      factions = factions.filter(
        (e) =>
          e !== "Wanderers in the Wild (Good)" &&
          e !== "Wanderers in the Wild (Evil)",
      );

      roster.warbands.map((_warband) => {
        if (
          _warband.hero &&
          [
            "Wanderers in the Wild (Good)",
            "Wanderers in the Wild (Evil)",
          ].includes(_warband.hero.faction)
        ) {
          factions.push(_warband.hero.name);
        }
        return null;
      });
    }

    let newUniqueModels = getAllUniqueModels();
    setUniqueModels(newUniqueModels);

    let _factions = factions;
    let newAllianceLevel = calculateAllianceLevel(
      _factions,
      faction_type,
      factionData,
    );
    setAllianceLevel(newAllianceLevel);
    setHasArmyBonus(
      ["Historical", "Legendary Legion"].includes(newAllianceLevel),
    );
    setFactionList(factions);

    let bowCounts = {};
    let modelCounts = {};
    let heroicTiers = {};
    let siegeEngines = {};
    roster.warbands.map((_warband) => {
      if (_warband.hero) {
        let f = _warband.hero.faction;
        if (!bowCounts.hasOwnProperty(f)) {
          bowCounts[f] = 0;
        }
        if (!modelCounts.hasOwnProperty(f)) {
          modelCounts[f] = 0;
        }
        if (!heroicTiers.hasOwnProperty(f)) {
          heroicTiers[f] = [];
        }
        if (!siegeEngines.hasOwnProperty(f)) {
          siegeEngines[f] = 0;
        }
        heroicTiers[f].push(_warband.hero.unit_type);
        if (
          _warband.hero.model_id ===
          "[the_iron_hills] iron_hills_chariot_(captain)"
        ) {
          modelCounts[f] = modelCounts[f] + (_warband.hero.siege_crew - 1);
        }
        if (_warband.hero.unit_type === "Siege Engine") {
          modelCounts[f] = modelCounts[f] + (_warband.hero.siege_crew - 1);
          _warband.hero.options.map((opt) => {
            if (opt.option === "Additional Crew") {
              modelCounts[f] = modelCounts[f] + opt.opt_quantity;
            }
            return null;
          });
          siegeEngines[f] = siegeEngines[f] + 1;
        }
        _warband.units.map((_unit) => {
          if (
            _unit.name != null &&
            _unit.unit_type === "Warrior" &&
            _unit.bow_limit
          ) {
            modelCounts[f] =
              modelCounts[f] +
              (_unit.siege_crew > 0 ? _unit.siege_crew : 1) * _unit.quantity;
            if (_unit.inc_bow_count) {
              bowCounts[f] =
                bowCounts[f] +
                (_unit.siege_crew > 0 ? _unit.siege_crew : 1) * _unit.quantity;
            }
          }
          return null;
        });
      }
      return null;
    });
    setFactionBowCounts(bowCounts);
    setFactionModelCounts(modelCounts);

    let newWarnings;
    [newWarnings, newAllianceLevel] = checkWarnings(
      newUniqueModels,
      factions,
      newAllianceLevel,
    );
    newWarnings = checkSiegeEngineCounts(
      siegeEngines,
      heroicTiers,
      newWarnings,
    );
    newWarnings = checkAlliedHeroes(newAllianceLevel, heroicTiers, newWarnings);
    if (factions.includes("The Dead of Dunharrow") && factions.length > 1) {
      [newAllianceLevel, newWarnings] = checkDunharrow(
        newAllianceLevel,
        newUniqueModels,
        newWarnings,
      );
    }
    if (newUniqueModels.includes("[rivendell] gil-galad")) {
      newAllianceLevel = checkGilGalad(newAllianceLevel, factions);
    }
    setAllianceLevel(newAllianceLevel);
    setWarnings(newWarnings);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [roster]);

  const getAllUniqueModels = () => {
    let newUniqueModels = new Set();
    roster.warbands.map((_warband) => {
      if (_warband.hero) {
        newUniqueModels.add(_warband.hero.model_id);
      }
      _warband.units.map((_unit) => {
        if (_unit.name != null) {
          newUniqueModels.add(_unit.model_id);
        }
        return null;
      });
      return null;
    });
    return [...newUniqueModels];
  };

  const checkWarnings = (_uniqueModels, faction_list, newAllianceLevel) => {
    let newWarnings = [];
    let _newAllianceLevel = newAllianceLevel;
    _uniqueModels.map((model_id) => {
      if (model_id in warning_rules) {
        let rules = warning_rules[model_id];
        rules.map((rule) => {
          if (
            rule["type"] === "requires_alliance" &&
            rule.dependencies[0] !== _newAllianceLevel
          ) {
            newWarnings.push(rule.warning);
          }
          let intersection = rule.dependencies.filter((x) =>
            _uniqueModels.includes(x),
          );
          if (
            rule["type"] === "requires_all" &&
            intersection.length !== rule.dependencies.length
          ) {
            newWarnings.push(rule.warning);
          }
          if (rule["type"] === "requires_one" && intersection.length === 0) {
            newWarnings.push(rule.warning);
          }
          if (
            rule["type"] === "incompatible" &&
            (intersection.length > 0 || rule.dependencies.length === 0)
          ) {
            newWarnings.push(rule.warning);
            if (rule.warning.includes("lose your army bonus")) {
              setHasArmyBonus(false);
            }
            if (
              rule.warning.includes("become impossible allies") &&
              faction_list.length > 1
            ) {
              _newAllianceLevel = "Impossible";
            }
          }
          return null;
        });
      }
      return null;
    });
    faction_list.map((faction) => {
      if (faction in warning_rules) {
        let rules = warning_rules[faction];
        rules.map((rule) => {
          if (
            rule["type"] === "historical_dependent" &&
            _newAllianceLevel === "Historical" &&
            faction_list.includes(rule.dependencies[0]) &&
            !_uniqueModels.includes(rule.dependencies[1])
          ) {
            newWarnings.push(rule.warning);
          }
          let intersection = rule.dependencies.filter((x) =>
            _uniqueModels.includes(x),
          );
          if (rule["type"] === "compulsory" && intersection.length === 0) {
            newWarnings.push(rule.warning);
          }
          return null;
        });
      }
      return null;
    });
    return [newWarnings, _newAllianceLevel];
  };

  return (
    <div
      style={{
        marginTop: "165px",
        minHeight: "600px",
        height: "calc(100vh - 165px)",
        minWidth: "1450px",
      }}
    >
      <TopNavbar
        uniqueModels={uniqueModels}
        setShowRosterTable={setShowRosterTable}
        setExportAlert={setExportAlert}
        setShowImportModal={setShowImportModal}
        setGameModeAlert={setGameModeAlert}
        setShowBuilderModal={setShowBuilderModal}
      />
      <div className="m-4">
        <ExportAlert
          exportAlert={exportAlert}
          setExportAlert={setExportAlert}
        />
        <GameModeAlert
          gameModeAlert={gameModeAlert}
          setGameModeAlert={setGameModeAlert}
        />
        {!gameMode ? (
          <>
            <SelectionMenu
              displaySelection={displaySelection}
              setDisplaySelection={setDisplaySelection}
              tabSelection={tabSelection}
              setTabSelection={setTabSelection}
              factionType={factionType}
              factionSelection={factionSelection}
              setFactionSelection={setFactionSelection}
              heroSelection={heroSelection}
              newWarriorFocus={newWarriorFocus}
              warbandNumFocus={warbandNumFocus}
              setShowCardModal={setShowCardModal}
              setCardUnitData={setCardUnitData}
              allianceLevel={allianceLevel}
              uniqueModels={uniqueModels}
              specialArmyOptions={specialArmyOptions}
              setSpecialArmyOptions={setSpecialArmyOptions}
              warnings={warnings}
              factionList={factionList}
              factionBowCounts={factionBowCounts}
              factionModelCounts={factionModelCounts}
              allianceColours={allianceColours}
              setShowAlliances={setShowAlliances}
              factionData={factionData}
              hasArmyBonus={hasArmyBonus}
              setShowKeywordSearch={setShowKeywordSearch}
            />
            <Warbands
              setHeroSelection={setHeroSelection}
              setDisplaySelection={setDisplaySelection}
              setWarbandNumFocus={setWarbandNumFocus}
              setShowCardModal={setShowCardModal}
              setCardUnitData={setCardUnitData}
              specialArmyOptions={specialArmyOptions}
              setSpecialArmyOptions={setSpecialArmyOptions}
              setNewWarriorFocus={setNewWarriorFocus}
              setTabSelection={setTabSelection}
              factionSelection={factionSelection}
              setFactionSelection={setFactionSelection}
            />
          </>
        ) : (
          <GameMode
            factionList={factionList}
            allianceLevel={allianceLevel}
            allianceColours={allianceColours}
            factionData={factionData}
            hasArmyBonus={hasArmyBonus}
            setShowKeywordSearch={setShowKeywordSearch}
          />
        )}
      </div>
      <ModalProfileCard
        showCardModal={showCardModal}
        setShowCardModal={setShowCardModal}
        cardUnitData={cardUnitData}
      />
      <ModalImportJSON
        showImportModal={showImportModal}
        setShowImportModal={setShowImportModal}
      />
      <ModalRosterTable
        allianceLevel={allianceLevel}
        allianceColour={allianceColours[allianceLevel]}
        showRosterTable={showRosterTable}
        setShowRosterTable={setShowRosterTable}
        factionList={factionList}
        factionData={factionData}
        hasArmyBonus={hasArmyBonus}
      />
      <ModalBuilderMode
        showBuilderModal={showBuilderModal}
        setShowBuilderModal={setShowBuilderModal}
      />
      <Alliances
        allianceLevel={allianceLevel}
        showAlliances={showAlliances}
        setShowAlliances={setShowAlliances}
        factionList={factionList}
        factionData={factionData}
        setFactionData={setFactionData}
      />
      <KeywordsSearch
        showKeywordSearch={showKeywordSearch}
        setShowKeywordSearch={setShowKeywordSearch}
      />
    </div>
  );
}
