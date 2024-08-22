import { useEffect, useState } from "react";
import faction_data from "./assets/data/faction_data.json";
import warning_rules from "./assets/data/warning_rules.json";
import { Alliances } from "./components/Alliances";
import { KeywordsSearch } from "./components/KeywordsSearch";
import { ModalRosterTable } from "./components/ModalRosterTable";
import { SelectionMenu } from "./components/SelectionMenu.jsx";
import { TopNavbar } from "./components/TopNavbar";
import { Warbands } from "./components/Warbands";
// import $ from 'jquery';
import "bootstrap/dist/css/bootstrap.min.css";
import "./App.css";
import { Alerts } from "./components/alerts/Alerts";
import { GameMode } from "./components/gamemode/GameMode";
import { ModalContainer } from "./components/modal/ModalContainer";
import {
  checkAlliedHeroes,
  checkSiegeEngineCounts,
} from "./components/specialRules.js";
import { useStore } from "./state/store";

export default function App() {
  const [factionSelection, setFactionSelection] = useState({
    "Good Army": "Minas Tirith",
    "Evil Army": "Mordor",
    "Good LL": "The Return of the King",
    "Evil LL": "The Host of the Dragon Emperor",
  });

  const {
    roster,
    factions,
    factionType,
    allianceLevel,
    uniqueModels,
    gameMode,
  } = useStore();

  const [factionBowCounts, setFactionBowCounts] = useState({});
  const [factionModelCounts, setFactionModelCounts] = useState({});

  const [tabSelection, setTabSelection] = useState("Good Army");
  const [heroSelection, setHeroSelection] = useState(false);
  const [warbandNumFocus, setWarbandNumFocus] = useState(0);
  const [newWarriorFocus, setNewWarriorFocus] = useState("");

  const [factionData, setFactionData] = useState(faction_data);

  const [specialArmyOptions, setSpecialArmyOptions] = useState([]);
  const [displaySelection, setDisplaySelection] = useState(false);

  const [warnings, setWarnings] = useState([]);

  // Modals
  const [showRosterTable, setShowRosterTable] = useState(false);
  // Sidebar
  const [showAlliances, setShowAlliances] = useState(false);
  const [showKeywordSearch, setShowKeywordSearch] = useState(false);

  // $(window).scroll(function () {
  //     // stops the left-hand options menu from scrolling horizontally
  //     $('.optionsList').css('left', -$(window).scrollLeft() + 24);
  // });

  useEffect(() => {
    if (!factions || !factionType) return;

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
    [newWarnings] = checkWarnings(uniqueModels, factions, allianceLevel);
    newWarnings = checkSiegeEngineCounts(
      siegeEngines,
      heroicTiers,
      newWarnings,
    );
    newWarnings = checkAlliedHeroes(allianceLevel, heroicTiers, newWarnings);
    setWarnings(newWarnings);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [roster]);

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
              // setHasArmyBonus(false);
              // TODO: Make sure rules are checked when roster update takes place!
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
      <Alerts />
      <ModalContainer />
      <TopNavbar setShowRosterTable={setShowRosterTable} />
      <div className="m-4">
        {!gameMode ? (
          <>
            <SelectionMenu
              displaySelection={displaySelection}
              setDisplaySelection={setDisplaySelection}
              tabSelection={tabSelection}
              setTabSelection={setTabSelection}
              factionSelection={factionSelection}
              setFactionSelection={setFactionSelection}
              heroSelection={heroSelection}
              newWarriorFocus={newWarriorFocus}
              warbandNumFocus={warbandNumFocus}
              specialArmyOptions={specialArmyOptions}
              setSpecialArmyOptions={setSpecialArmyOptions}
              warnings={warnings}
              factionBowCounts={factionBowCounts}
              factionModelCounts={factionModelCounts}
              setShowAlliances={setShowAlliances}
              factionData={factionData}
              setShowKeywordSearch={setShowKeywordSearch}
            />
            <Warbands
              setHeroSelection={setHeroSelection}
              setDisplaySelection={setDisplaySelection}
              setWarbandNumFocus={setWarbandNumFocus}
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
            factionData={factionData}
            setShowKeywordSearch={setShowKeywordSearch}
          />
        )}
      </div>
      <ModalRosterTable
        showRosterTable={showRosterTable}
        setShowRosterTable={setShowRosterTable}
        factionData={factionData}
      />
      <Alliances
        showAlliances={showAlliances}
        setShowAlliances={setShowAlliances}
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
