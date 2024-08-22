import Badge from "react-bootstrap/Badge";
import Button from "react-bootstrap/Button";
import Dropdown from "react-bootstrap/Dropdown";
import Stack from "react-bootstrap/Stack";
import { FaChessRook, FaSearch } from "react-icons/fa";
import { FcCheckmark } from "react-icons/fc";
import { GiCrackedShield, GiSwordsEmblem } from "react-icons/gi";
import { RxCross1 } from "react-icons/rx";
import factionData from "../../assets/data/faction_data.json";
import { useStore } from "../../state/store";
import { Factions } from "../../types/factions.ts";
import { allianceColours } from "../constants/alliances";
import { ModalTypes } from "../modal/modals";
import { SidebarTypes } from "../sidebar-drawer/sidebars.tsx";

const charts: Record<string, string> = {
  "climb-table": "Climb Table",
  "detonation-table": "Detonation Table",
  "gates-doors-sieges": "Gates and Doors (Sieges)",
  "in-the-way-chart": "In The Way Chart",
  "jump-table": "Jump Table",
  "leap-table": "Leap Table",
  "missile-weapon-chart": "Missile Weapon Chart",
  "scatter-table": "Scatter Table",
  "sentry-chart": "Sentry chart",
  "swim-chart": "Swim chart",
  "siege-target-types": "Siege Target Types",
  "thrown-rider-table": "Thrown Rider Table",
  "to-wound-chart": "To Wound Chart",
};

export const GameModeInfo = () => {
  const {
    roster,
    setCurrentModal,
    gameState: { casualties = 0, heroCasualties = 0 },
    factions: factionList,
    allianceLevel,
    armyBonusActive: hasArmyBonus,
    openSidebar,
  } = useStore();
  const openChart = (selectedChart: keyof typeof charts) => () =>
    setCurrentModal(ModalTypes.CHART, { selectedChart });
  return (
    <div
      id="optionMenu"
      className="optionsList border border-4 rounded position-fixed bg-white p-3"
    >
      <Stack className="mb-5" direction="horizontal">
        <h4 className="m-0">
          <FaChessRook /> Game Mode
        </h4>
        <Button
          variant="light"
          className="ms-auto border shadow-sm"
          onClick={() => openSidebar(SidebarTypes.KEYWORD_SEARCH)}
        >
          <FaSearch /> Search Keywords
        </Button>
      </Stack>
      {((factionList.includes(Factions.Isengard) &&
        allianceLevel === "Historical") ||
        factionList.includes(Factions.Assault_Upon_Helms_Deep)) &&
        Math.ceil(0.66 * roster.num_units) - (casualties + heroCasualties) <=
          0 && (
          <h6 className="mt-4 mb-2 text-danger">
            (Isengard Army Bonus) You are at least 66% defeated{" "}
            <GiCrackedShield />
          </h6>
        )}
      {((factionList.includes(Factions.Isengard) &&
        allianceLevel === "Historical") ||
        factionList.includes(Factions.Assault_Upon_Helms_Deep)) &&
        Math.ceil(0.66 * roster.num_units) - (casualties + heroCasualties) >
          0 && (
          <h6 className="mt-4 mb-2">
            Until 66% (Isengard Army Bonus):{" "}
            <b>
              {Math.max(
                Math.ceil(0.66 * roster.num_units) -
                  (casualties + heroCasualties),
                0,
              )}
            </b>
          </h6>
        )}
      <Stack direction="horizontal" gap={3} className="mt-4 mb-3">
        <h6>Alliance Level:</h6>
        <h5>
          <Badge bg={allianceColours[allianceLevel]}>{allianceLevel}</Badge>
        </h5>
        <Dropdown className="ms-auto">
          <Dropdown.Toggle
            variant="light"
            className="w-100 ms-auto border shadow-sm"
          >
            <GiSwordsEmblem /> Charts
          </Dropdown.Toggle>
          <Dropdown.Menu>
            {Object.entries(charts).map(([fileName, chartName]) => (
              <Dropdown.Item key={fileName} onClick={openChart(fileName)}>
                {chartName}
              </Dropdown.Item>
            ))}
          </Dropdown.Menu>
        </Dropdown>
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
      {factionList.map((f) => (
        <div key={f}>
          <h5 className="mt-4">
            <Badge bg={hasArmyBonus ? "dark" : "secondary"}>{f}</Badge>
          </h5>
          <div
            className={hasArmyBonus ? "text-body" : "text-secondary"}
            dangerouslySetInnerHTML={{
              __html: factionData[f].armyBonus,
            }}
          />
        </div>
      ))}
    </div>
  );
};
