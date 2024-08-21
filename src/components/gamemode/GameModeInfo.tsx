import { FunctionComponent } from "react";
import Badge from "react-bootstrap/Badge";
import Button from "react-bootstrap/Button";
import Dropdown from "react-bootstrap/Dropdown";
import Stack from "react-bootstrap/Stack";
import { FaChessRook, FaSearch } from "react-icons/fa";
import { FcCheckmark } from "react-icons/fc";
import { GiCrackedShield, GiSwordsEmblem } from "react-icons/gi";
import { RxCross1 } from "react-icons/rx";
import { useStore } from "../../state/store";
import { FactionData } from "../../types/faction-data.ts";
import { Faction } from "../../types/factions.ts";
import { allianceColours } from "../constants/alliances";
import { MODAL_KEYS } from "../modal/modals";

export type GameModeInfoProps = {
  factionList: Faction[];
  allianceLevel: keyof typeof allianceColours;
  factionData: Record<Faction, FactionData>;
  hasArmyBonus: boolean;
  setShowKeywordSearch: (boolean) => void;
};

export const GameModeInfo: FunctionComponent<GameModeInfoProps> = ({
  factionList,
  allianceLevel,
  factionData,
  hasArmyBonus,
  setShowKeywordSearch,
}) => {
  const {
    roster,
    setCurrentModal,
    gameState: { casualties = 0, heroCasualties = 0 },
  } = useStore();
  const openChart = (selectedChart) => () =>
    setCurrentModal(MODAL_KEYS.CHART, { selectedChart });
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
          onClick={() => setShowKeywordSearch(true)}
        >
          <FaSearch /> Search Keywords
        </Button>
      </Stack>
      {((factionList.includes("Isengard") && allianceLevel === "Historical") ||
        factionList.includes("Assault Upon Helm's Deep")) &&
        Math.ceil(0.66 * roster.num_units) - (casualties + heroCasualties) <=
          0 && (
          <h6 className="mt-4 mb-2 text-danger">
            (Isengard Army Bonus) You are at least 66% defeated{" "}
            <GiCrackedShield />
          </h6>
        )}
      {((factionList.includes("Isengard") && allianceLevel === "Historical") ||
        factionList.includes("Assault Upon Helm's Deep")) &&
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
            <Dropdown.Item onClick={openChart("climb-table")}>
              Climb Table
            </Dropdown.Item>
            <Dropdown.Item onClick={openChart("detonation-table")}>
              Detonation Table
            </Dropdown.Item>
            <Dropdown.Item onClick={openChart("gates-doors-sieges")}>
              Gates and Doors (Sieges)
            </Dropdown.Item>
            <Dropdown.Item onClick={openChart("in-the-way-chart")}>
              In The Way Chart
            </Dropdown.Item>
            <Dropdown.Item onClick={openChart("jump-table")}>
              Jump Table
            </Dropdown.Item>
            <Dropdown.Item onClick={openChart("leap-table")}>
              Leap Table
            </Dropdown.Item>
            <Dropdown.Item onClick={openChart("missile-weapon-chart")}>
              Missile Weapon Chart
            </Dropdown.Item>
            <Dropdown.Item onClick={openChart("scatter-table")}>
              Scatter Table
            </Dropdown.Item>
            <Dropdown.Item onClick={openChart("sentry-chart")}>
              Sentry Chart
            </Dropdown.Item>
            <Dropdown.Item onClick={openChart("swim-chart")}>
              Swim Chart
            </Dropdown.Item>
            <Dropdown.Item onClick={openChart("siege-target-types")}>
              Siege Target Types
            </Dropdown.Item>
            <Dropdown.Item onClick={openChart("thrown-rider-table")}>
              Thrown Rider Table
            </Dropdown.Item>
            <Dropdown.Item onClick={openChart("to-wound-chart")}>
              To Wound Chart
            </Dropdown.Item>
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
