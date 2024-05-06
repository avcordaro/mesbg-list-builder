import {FcCheckmark} from "react-icons/fc";
import {RxCross1} from "react-icons/rx";
import Badge from "react-bootstrap/Badge";
import faction_data from "../data/faction_data.json";
import Stack from "react-bootstrap/Stack";
import {FaChessRook} from "react-icons/fa";
import {GiCrackedShield, GiSwordsEmblem} from "react-icons/gi";
import React from "react";
import Button from "react-bootstrap/Button";


export function GameModeInfo({factionList, allianceLevel, allianceColours, roster, casualtyCount, heroCasualtyCount, setShowWoundModal}) {

  return (<div
    id="optionMenu"
    className="optionsList border border-4 rounded position-fixed bg-white p-3"
  >
      <h4><FaChessRook /> Game Mode</h4>
      <hr />
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
        <Button variant="light" className="ms-auto border shadow-sm" onClick={() => setShowWoundModal(true)}><GiSwordsEmblem /> To Wound Chart</Button>
      </Stack>
      <h6
        className={["Historical", "Legendary Legion"].includes(allianceLevel) ? "text-body" : "text-secondary"}
      >
        Army Bonuses{" "}
        {["Historical", "Legendary Legion"].includes(allianceLevel) ? (<FcCheckmark/>) : (<b>
          <RxCross1 className="text-danger"/>
        </b>)}
      </h6>
      <hr/>
      {factionList.map((f) => (<div>
        <h5 className="mt-4">
          <Badge
            bg={["Historical", "Legendary Legion"].includes(allianceLevel) ? "dark" : "secondary"}
          >
            {f}
          </Badge>
        </h5>
        <div
          className={["Historical", "Legendary Legion"].includes(allianceLevel) ? "text-body" : "text-secondary"}
          dangerouslySetInnerHTML={{
            __html: faction_data[f]["armyBonus"],
          }}
        />
      </div>))}
  </div>);
}
