import Badge from "react-bootstrap/Badge";
import Button from "react-bootstrap/Button";
import Dropdown from "react-bootstrap/Dropdown";
import DropdownButton from "react-bootstrap/DropdownButton";
import Stack from "react-bootstrap/Stack";
import Tab from "react-bootstrap/Tab";
import Tabs from "react-bootstrap/Tabs";
import { FaSearch } from "react-icons/fa";
import { FaHammer } from "react-icons/fa6";
import { FcCheckmark } from "react-icons/fc";
import { ImCross } from "react-icons/im";
import { IoWarningOutline } from "react-icons/io5";
import { LuSwords } from "react-icons/lu";
import { RxCross1 } from "react-icons/rx";
import { v4 as uuid } from "uuid";
import hero_constraint_data from "../../assets/data/hero_constraint_data.json";
import mesbg_data from "../../assets/data/mesbg_data.json";
import { useFactionData } from "../../hooks/faction-data";
import { useStore } from "../../state/store";
import { allianceColours } from "../constants/alliances";
import { wanderers } from "../constants/wanderers";
import { FactionLogo } from "../images/FactionLogo.tsx";
import { SidebarTypes } from "../sidebar-drawer/sidebars";
import { SelectionSiege } from "./selection/SelectionSiege.jsx";
import { SelectionUnit } from "./selection/SelectionUnit.jsx";

/* The menu component on the left-hand side used for displaying information about warnings,
bow limits, and army bonuses. Also used as the selection menu when choosing a unit. */

export function SelectionMenu({
  displaySelection,
  setDisplaySelection,
  tabSelection,
  setTabSelection,
  factionSelection,
  setFactionSelection,
  heroSelection,
  newWarriorFocus,
  warbandNumFocus,
  specialArmyOptions,
  setSpecialArmyOptions,
}) {
  const {
    roster,
    uniqueModels,
    allianceLevel,
    rosterBuildingWarnings: warnings,
    factions: factionList,
    factionType,
    armyBonusActive: hasArmyBonus,
    factionMetaData,
    openSidebar,
  } = useStore();
  const factionData = useFactionData();

  const faction_lists = {
    "Good Army": new Set(
      mesbg_data
        .filter((data) => data.faction_type === "Good Army")
        .map((data) => data.faction),
    ),
    "Evil Army": new Set(
      mesbg_data
        .filter((data) => data.faction_type === "Evil Army")
        .map((data) => data.faction),
    ),
    "Good LL": new Set(
      mesbg_data
        .filter((data) => data.faction_type === "Good LL")
        .map((data) => data.faction),
    ),
    "Evil LL": new Set(
      mesbg_data
        .filter((data) => data.faction_type === "Evil LL")
        .map((data) => data.faction),
    ),
  };

  const handleFaction = (f_type, f) => {
    // Update the faction selection state variable to newly selected value
    let newFaction = { ...factionSelection };
    newFaction[f_type] = f;
    setFactionSelection(newFaction);
  };

  return (
    <div
      id="optionMenu"
      className="optionsList p-3 border border-4 rounded position-fixed bg-white"
    >
      {displaySelection ? (
        <>
          <Button
            variant="light"
            className="ms-2 border"
            style={{ float: "right" }}
            onClick={() => setDisplaySelection(false)}
          >
            <ImCross />
          </Button>
          <Tabs activeKey={tabSelection} fill onSelect={setTabSelection}>
            {Object.keys(faction_lists).map((f_type) => {
              return (
                <Tab
                  key={f_type}
                  eventKey={f_type}
                  title={f_type}
                  disabled={
                    !heroSelection ||
                    (factionType !== "" && factionType !== f_type)
                  }
                >
                  <Stack gap={2}>
                    <DropdownButton
                      className="dropDownButton mt-3"
                      title={factionSelection[f_type] + " "}
                      onSelect={(e) => handleFaction(f_type, e)}
                      disabled={!heroSelection || factionType.includes("LL")}
                    >
                      {[...faction_lists[f_type]].sort().map((f) => (
                        <Dropdown.Item
                          style={{ width: "458px" }}
                          eventKey={f}
                          key={f}
                        >
                          <FactionLogo faction={f} className="faction_logo" />
                          {" " + f}
                        </Dropdown.Item>
                      ))}
                    </DropdownButton>
                    {heroSelection
                      ? mesbg_data
                          .filter(
                            (data) =>
                              data.faction === factionSelection[f_type] &&
                              !["Independent Hero*", "Warrior"].includes(
                                data.unit_type,
                              ) &&
                              !(
                                data.unique &&
                                uniqueModels.includes(data.model_id)
                              ),
                          )
                          .map((row) => (
                            <SelectionUnit
                              key={uuid()}
                              newWarriorFocus={newWarriorFocus}
                              setDisplaySelection={setDisplaySelection}
                              heroSelection={heroSelection}
                              unitData={row}
                              warbandNumFocus={warbandNumFocus}
                              specialArmyOptions={specialArmyOptions}
                              setSpecialArmyOptions={setSpecialArmyOptions}
                            />
                          ))
                      : mesbg_data
                          .filter(
                            (data) =>
                              roster.warbands[warbandNumFocus].hero &&
                              hero_constraint_data[
                                roster.warbands[warbandNumFocus].hero.model_id
                              ][0]["valid_warband_units"].includes(
                                data.model_id,
                              ) &&
                              !(
                                data.unique &&
                                uniqueModels.includes(data.model_id)
                              ),
                          )
                          .map((row) => (
                            <SelectionUnit
                              key={uuid()}
                              newWarriorFocus={newWarriorFocus}
                              setDisplaySelection={setDisplaySelection}
                              heroSelection={heroSelection}
                              unitData={row}
                              warbandNumFocus={warbandNumFocus}
                            />
                          ))}
                    {!heroSelection && (
                      <SelectionSiege
                        key={uuid()}
                        newWarriorFocus={newWarriorFocus}
                        setDisplaySelection={setDisplaySelection}
                        warbandNumFocus={warbandNumFocus}
                      />
                    )}
                  </Stack>
                </Tab>
              );
            })}
          </Tabs>
        </>
      ) : (
        <div>
          <Stack className="mb-5" direction="horizontal">
            <h4 className="m-0">
              <FaHammer /> Builder Mode
            </h4>
            <Button
              variant="light"
              className="ms-auto border shadow-sm"
              onClick={() => openSidebar(SidebarTypes.KEYWORD_SEARCH)}
            >
              <FaSearch /> Search Keywords
            </Button>
          </Stack>
          {warnings.length > 0 && (
            <>
              <h6>
                <IoWarningOutline /> Warnings
              </h6>
              <hr />
              {warnings.map((w, i) => (
                <p key={i} className="text-danger">
                  {w}
                </p>
              ))}
            </>
          )}
          <h6>Bow Limit</h6>
          <hr />
          {factionList
            .filter((x) => !wanderers.includes(x))
            .map((f) => (
              <p
                key={f}
                className={
                  factionMetaData[f].modelsWithBow >
                  Math.ceil(
                    factionData[f]["bow_limit"] *
                      factionMetaData[f].modelsThatCountForBowLimit,
                  )
                    ? "text-danger"
                    : "text-dark"
                }
              >
                <b>{f}:</b>
                {" (" +
                  factionData[f]["bow_limit"] * 100 +
                  "% limit - " +
                  Math.ceil(
                    factionData[f]["bow_limit"] *
                      factionMetaData[f].modelsThatCountForBowLimit,
                  ) +
                  " bows) "}
                <b>
                  {factionMetaData[f].modelsWithBow} /{" "}
                  {factionMetaData[f].modelsThatCountForBowLimit}
                </b>
              </p>
            ))}
          <Stack direction="horizontal" gap={3} className="mt-5 mb-3">
            <h6>Alliance Level:</h6>
            <h5>
              <Badge bg={allianceColours[allianceLevel]}>{allianceLevel}</Badge>
            </h5>
            <Button
              variant="light"
              className="ms-auto border shadow-sm"
              onClick={() => openSidebar(SidebarTypes.ALLIANCE)}
              disabled={!factionList.length || factionType.includes("LL")}
            >
              <LuSwords /> Alliances
            </Button>
          </Stack>
          <h6 className={hasArmyBonus ? "text-body" : "text-secondary"}>
            Army Bonuses{" "}
            {hasArmyBonus ? (
              <FcCheckmark />
            ) : (
              <b>
                <RxCross1 className="text-danger" />
              </b>
            )}
          </h6>
          <hr />
          {factionList
            .filter((x) => !wanderers.includes(x))
            .map((f) => (
              <div>
                <h5 className="mt-4">
                  <Badge bg={hasArmyBonus ? "dark" : "secondary"}>{f}</Badge>
                </h5>
                <div
                  className={hasArmyBonus ? "text-body" : "text-secondary"}
                  dangerouslySetInnerHTML={{
                    __html: factionData[f]["armyBonus"],
                  }}
                />
              </div>
            ))}
        </div>
      )}
    </div>
  );
}
