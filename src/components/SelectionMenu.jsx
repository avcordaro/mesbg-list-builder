import Button from "react-bootstrap/Button";
import { ImCross } from "react-icons/im";
import Tabs from "react-bootstrap/Tabs";
import Tab from "react-bootstrap/Tab";
import Stack from "react-bootstrap/Stack";
import DropdownButton from "react-bootstrap/DropdownButton";
import Dropdown from "react-bootstrap/Dropdown";
import mesbg_data from "../assets/data/mesbg_data.json";
import { SelectionUnit } from "./SelectionUnit";
import { SelectionSiege } from "./SelectionSiege";
import { v4 as uuid } from "uuid";
import hero_constraint_data from "../assets/data/hero_constraint_data.json";
import { IoWarningOutline } from "react-icons/io5";
import Badge from "react-bootstrap/Badge";
import { LuSwords } from "react-icons/lu";
import { FcCheckmark } from "react-icons/fc";
import { RxCross1 } from "react-icons/rx";
import { FaSearch } from "react-icons/fa";
import { FaHammer } from "react-icons/fa6";
import { FactionLogo } from "./FactionLogo.tsx";

/* The menu component on the left-hand side used for displaying information about warnings,
bow limits, and army bonuses. Also used as the selection menu when choosing a unit. */

export function SelectionMenu({
  roster,
  setRoster,
  displaySelection,
  setDisplaySelection,
  tabSelection,
  setTabSelection,
  factionType,
  factionSelection,
  setFactionSelection,
  heroSelection,
  newWarriorFocus,
  warbandNumFocus,
  setShowCardModal,
  setCardUnitData,
  allianceLevel,
  uniqueModels,
  specialArmyOptions,
  setSpecialArmyOptions,
  warnings,
  factionList,
  factionBowCounts,
  factionModelCounts,
  allianceColours,
  setShowAlliances,
  factionData,
  hasArmyBonus,
  setShowKeywordSearch,
}) {
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
            {Object.keys(faction_lists).map((f_type) => (
              <Tab
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
                      <Dropdown.Item style={{ width: "458px" }} eventKey={f}>
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
                            roster={roster}
                            setRoster={setRoster}
                            uniqueModels={uniqueModels}
                            warbandNumFocus={warbandNumFocus}
                            setShowCardModal={setShowCardModal}
                            setCardUnitData={setCardUnitData}
                            allianceLevel={allianceLevel}
                          />
                        ))}
                  {!heroSelection && (
                    <SelectionSiege
                      key={uuid()}
                      newWarriorFocus={newWarriorFocus}
                      setDisplaySelection={setDisplaySelection}
                      roster={roster}
                      setRoster={setRoster}
                      warbandNumFocus={warbandNumFocus}
                    />
                  )}
                </Stack>
              </Tab>
            ))}
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
              onClick={() => setShowKeywordSearch(true)}
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
              {warnings.map((w) => (
                <p className="text-danger">{w}</p>
              ))}
            </>
          )}
          <h6>Bow Limit</h6>
          <hr />
          {factionList
            .filter(
              (x) =>
                ![
                  "Tom Bombadil",
                  "Goldberry",
                  "Barliman Butterbur",
                  "Bill the Pony",
                  "Grimbeorn",
                  "Beorning",
                  "Harry Goatleaf",
                  "Murin & Drar",
                  "Thrain the Broken (Good)",
                  "Thrain the Broken (Evil)",
                ].includes(x),
            )
            .map((f) => (
              <p
                className={
                  factionBowCounts[f] >
                  Math.ceil(factionData[f]["bow_limit"] * factionModelCounts[f])
                    ? "text-danger"
                    : "text-dark"
                }
              >
                <b>{f}:</b>
                {" (" +
                  factionData[f]["bow_limit"] * 100 +
                  "% limit - " +
                  Math.ceil(
                    factionData[f]["bow_limit"] * factionModelCounts[f],
                  ) +
                  " bows) "}
                <b>
                  {factionBowCounts[f]} / {factionModelCounts[f]}
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
              onClick={() => setShowAlliances(true)}
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
            .filter(
              (x) =>
                ![
                  "Tom Bombadil",
                  "Goldberry",
                  "Barliman Butterbur",
                  "Bill the Pony",
                  "Grimbeorn",
                  "Beorning",
                  "Harry Goatleaf",
                  "Murin & Drar",
                  "Thrain the Broken (Good)",
                  "Thrain the Broken (Evil)",
                ].includes(x),
            )
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
