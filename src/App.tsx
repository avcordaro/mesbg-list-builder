import { Fragment } from "react";
import { Alerts } from "./components/alerts/Alerts";
import { BuilderMode } from "./components/builder-mode/BuilderMode";
import { GameMode } from "./components/gamemode/GameMode";
import { TopNavbar } from "./components/layout/TopNavbar.jsx";
import { ModalContainer } from "./components/modal/ModalContainer";
import { SidebarContainer } from "./components/sidebar-drawer/SidebarContainer";
import { useStore } from "./state/store";

import "bootstrap/dist/css/bootstrap.min.css";
import "./App.css";

export const App = () => {
  const { gameMode } = useStore();

  // $(window).scroll(function () {
  //     // stops the left-hand options menu from scrolling horizontally
  //     $('.optionsList').css('left', -$(window).scrollLeft() + 24);
  // });

  // useEffect(() => {
  //   if (!factions || !factionType) return;
  //
  //   let bowCounts = {};
  //   let modelCounts = {};
  //   let heroicTiers = {};
  //   let siegeEngines = {};
  //   roster.warbands.map((_warband) => {
  //     if (_warband.hero) {
  //       let f = _warband.hero.faction;
  //       if (!bowCounts.hasOwnProperty(f)) {
  //         bowCounts[f] = 0;
  //       }
  //       if (!modelCounts.hasOwnProperty(f)) {
  //         modelCounts[f] = 0;
  //       }
  //       if (!heroicTiers.hasOwnProperty(f)) {
  //         heroicTiers[f] = [];
  //       }
  //       if (!siegeEngines.hasOwnProperty(f)) {
  //         siegeEngines[f] = 0;
  //       }
  //       heroicTiers[f].push(_warband.hero.unit_type);
  //       if (
  //         _warband.hero.model_id ===
  //         "[the_iron_hills] iron_hills_chariot_(captain)"
  //       ) {
  //         modelCounts[f] = modelCounts[f] + (_warband.hero.siege_crew - 1);
  //       }
  //       if (_warband.hero.unit_type === "Siege Engine") {
  //         modelCounts[f] = modelCounts[f] + (_warband.hero.siege_crew - 1);
  //         _warband.hero.options.map((opt) => {
  //           if (opt.option === "Additional Crew") {
  //             modelCounts[f] = modelCounts[f] + opt.opt_quantity;
  //           }
  //           return null;
  //         });
  //         siegeEngines[f] = siegeEngines[f] + 1;
  //       }
  //       _warband.units.map((_unit) => {
  //         if (
  //           _unit.name != null &&
  //           _unit.unit_type === "Warrior" &&
  //           _unit.bow_limit
  //         ) {
  //           modelCounts[f] =
  //             modelCounts[f] +
  //             (_unit.siege_crew > 0 ? _unit.siege_crew : 1) * _unit.quantity;
  //           if (_unit.inc_bow_count) {
  //             bowCounts[f] =
  //               bowCounts[f] +
  //               (_unit.siege_crew > 0 ? _unit.siege_crew : 1) * _unit.quantity;
  //           }
  //         }
  //         return null;
  //       });
  //     }
  //     return null;
  //   });
  //   setFactionBowCounts(bowCounts);
  //   setFactionModelCounts(modelCounts);
  //
  //   let newWarnings;
  //   [newWarnings] = checkWarnings(uniqueModels, factions, allianceLevel);
  //   newWarnings = checkSiegeEngineCounts(
  //     siegeEngines,
  //     heroicTiers,
  //     newWarnings,
  //   );
  //   newWarnings = checkAlliedHeroes(allianceLevel, heroicTiers, newWarnings);
  //   setWarnings(newWarnings);
  //   // eslint-disable-next-line react-hooks/exhaustive-deps
  // }, [roster]);

  // const checkWarnings = (_uniqueModels, faction_list, newAllianceLevel) => {
  //   let newWarnings = [];
  //   let _newAllianceLevel = newAllianceLevel;
  //   _uniqueModels.map((model_id) => {
  //     if (model_id in warning_rules) {
  //       let rules = warning_rules[model_id];
  //       rules.map((rule) => {
  //         if (
  //           rule["type"] === "requires_alliance" &&
  //           rule.dependencies[0] !== _newAllianceLevel
  //         ) {
  //           newWarnings.push(rule.warning);
  //         }
  //         let intersection = rule.dependencies.filter((x) =>
  //           _uniqueModels.includes(x),
  //         );
  //         if (
  //           rule["type"] === "requires_all" &&
  //           intersection.length !== rule.dependencies.length
  //         ) {
  //           newWarnings.push(rule.warning);
  //         }
  //         if (rule["type"] === "requires_one" && intersection.length === 0) {
  //           newWarnings.push(rule.warning);
  //         }
  //         if (
  //           rule["type"] === "incompatible" &&
  //           (intersection.length > 0 || rule.dependencies.length === 0)
  //         ) {
  //           newWarnings.push(rule.warning);
  //           if (rule.warning.includes("lose your army bonus")) {
  //             // setHasArmyBonus(false);
  //             // TODO: Make sure rules are checked when roster update takes place!
  //           }
  //           if (
  //             rule.warning.includes("become impossible allies") &&
  //             faction_list.length > 1
  //           ) {
  //             _newAllianceLevel = "Impossible";
  //           }
  //         }
  //         return null;
  //       });
  //     }
  //     return null;
  //   });
  //   faction_list.map((faction) => {
  //     if (faction in warning_rules) {
  //       let rules = warning_rules[faction];
  //       rules.map((rule) => {
  //         if (
  //           rule["type"] === "historical_dependent" &&
  //           _newAllianceLevel === "Historical" &&
  //           faction_list.includes(rule.dependencies[0]) &&
  //           !_uniqueModels.includes(rule.dependencies[1])
  //         ) {
  //           newWarnings.push(rule.warning);
  //         }
  //         let intersection = rule.dependencies.filter((x) =>
  //           _uniqueModels.includes(x),
  //         );
  //         if (rule["type"] === "compulsory" && intersection.length === 0) {
  //           newWarnings.push(rule.warning);
  //         }
  //         return null;
  //       });
  //     }
  //     return null;
  //   });
  //   return [newWarnings, _newAllianceLevel];
  // };

  return (
    <Fragment>
      <TopNavbar />
      <Alerts />
      <main
        style={{
          marginTop: "140px",
          minHeight: "600px",
          minWidth: "100%",
          padding: "1rem",
        }}
      >
        {!gameMode ? <BuilderMode /> : <GameMode />}
      </main>
      <aside>
        <SidebarContainer />
        <ModalContainer />
      </aside>
    </Fragment>
  );
};
