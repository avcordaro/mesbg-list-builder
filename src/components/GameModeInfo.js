import {FcCheckmark} from "react-icons/fc";
import {RxCross1} from "react-icons/rx";
import Badge from "react-bootstrap/Badge";
import Stack from "react-bootstrap/Stack";
import {FaChessRook, FaSearch} from "react-icons/fa";
import {GiCrackedShield, GiSwordsEmblem} from "react-icons/gi";
import React from "react";
import Button from "react-bootstrap/Button";
import Dropdown from "react-bootstrap/Dropdown";


export function GameModeInfo({factionList, allianceLevel, allianceColours, roster, casualtyCount, heroCasualtyCount, setShowChartModal, setSelectedChart, factionData, hasArmyBonus, setShowKeywordSearch}) {

  return (<div
    id="optionMenu"
    className="optionsList border border-4 rounded position-fixed bg-white p-3"
  >
      <Stack className="mb-5" direction="horizontal">
        <h4 className="m-0"><FaChessRook /> Game Mode</h4>
        <Button variant="light" className="ms-auto border shadow-sm"
                onClick={() => setShowKeywordSearch(true)}><FaSearch/> Search Keywords
        </Button>
      </Stack>
      {((factionList.includes("Isengard") && allianceLevel === "Historical") || factionList.includes("Assault Upon Helm's Deep")) && Math.ceil(0.66 * roster.num_units) - (casualtyCount + heroCasualtyCount) <= 0 &&
        <h6 className="mt-4 mb-2 text-danger">(Isengard Army Bonus) You are at least 66% defeated <GiCrackedShield /></h6>
      }
      {((factionList.includes("Isengard") && allianceLevel === "Historical") || factionList.includes("Assault Upon Helm's Deep")) && Math.ceil(0.66 * roster.num_units) - (casualtyCount + heroCasualtyCount) > 0 &&
        <h6 className="mt-4 mb-2">Until 66% (Isengard Army Bonus): <b>{Math.max(Math.ceil(0.66 * roster.num_units) - (casualtyCount + heroCasualtyCount), 0)}</b></h6>
      }
      <Stack direction="horizontal" gap={3} className="mt-4 mb-3">
        <h6>Alliance Level:</h6>
        <h5>
          <Badge bg={allianceColours[allianceLevel]}>{allianceLevel}</Badge>
        </h5>
        <Dropdown className="ms-auto">
          <Dropdown.Toggle variant="light" className="w-100 ms-auto border shadow-sm">
            <GiSwordsEmblem /> Charts
          </Dropdown.Toggle>
          <Dropdown.Menu>
            <Dropdown.Item onClick={() => {setSelectedChart("climb-table"); setShowChartModal(true);}}>Climb Table</Dropdown.Item>
            <Dropdown.Item onClick={() => {setSelectedChart("detonation-table"); setShowChartModal(true);}}>Detonation Table</Dropdown.Item>
            <Dropdown.Item onClick={() => {setSelectedChart("gates-doors-sieges"); setShowChartModal(true);}}>Gates and Doors (Sieges)</Dropdown.Item>
            <Dropdown.Item onClick={() => {setSelectedChart("in-the-way-chart"); setShowChartModal(true);}}>In The Way Chart</Dropdown.Item>
            <Dropdown.Item onClick={() => {setSelectedChart("jump-table"); setShowChartModal(true);}}>Jump Table</Dropdown.Item>
            <Dropdown.Item onClick={() => {setSelectedChart("leap-table"); setShowChartModal(true);}}>Leap Table</Dropdown.Item>
            <Dropdown.Item onClick={() => {setSelectedChart("missile-weapon-chart"); setShowChartModal(true);}}>Missile Weapon Chart</Dropdown.Item>
            <Dropdown.Item onClick={() => {setSelectedChart("scatter-table"); setShowChartModal(true);}}>Scatter Table</Dropdown.Item>
            <Dropdown.Item onClick={() => {setSelectedChart("sentry-chart"); setShowChartModal(true);}}>Sentry Chart</Dropdown.Item>
            <Dropdown.Item onClick={() => {setSelectedChart("swim-chart"); setShowChartModal(true);}}>Swim Chart</Dropdown.Item>
            <Dropdown.Item onClick={() => {setSelectedChart("siege-target-types"); setShowChartModal(true);}}>Siege Target Types</Dropdown.Item>
            <Dropdown.Item onClick={() => {setSelectedChart("thrown-rider-table"); setShowChartModal(true);}}>Thrown Rider Table</Dropdown.Item>
            <Dropdown.Item onClick={() => {setSelectedChart("to-wound-chart"); setShowChartModal(true);}}>To Wound Chart</Dropdown.Item>
          </Dropdown.Menu>
        </Dropdown>
      </Stack>
      <h6
        className={hasArmyBonus ? "text-body" : "text-secondary"}
      >
        Army Bonuses{" "}
        {hasArmyBonus ? (<FcCheckmark/>) : (<b>
          <RxCross1 className="text-danger"/>
        </b>)}
      </h6>
      <hr/>
      {factionList.map((f) => (<div>
        <h5 className="mt-4">
          <Badge
            bg={hasArmyBonus ? "dark" : "secondary"}
          >
            {f}
          </Badge>
        </h5>
        <div
          className={hasArmyBonus ? "text-body" : "text-secondary"}
          dangerouslySetInnerHTML={{
            __html: factionData[f]["armyBonus"],
          }}
        />
      </div>))}
  </div>);
}
