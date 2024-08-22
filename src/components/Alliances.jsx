import { useEffect } from "react";
import Badge from "react-bootstrap/Badge";
import Offcanvas from "react-bootstrap/Offcanvas";
import { useStore } from "../state/store";
import { FactionLogo } from "./FactionLogo.tsx";
import {
  handle50PctBowLimit,
  handleBillCampfire,
  handleGoblinTown,
  handleMasterLaketown,
  handleMirkwoodRangers,
  handleKhandishHorsemanCharioteers,
} from "./specialRules.js";

/* Displays an Offcanvas component showing the possible alliances for the current army selection. */

export function Alliances({
  showAlliances,
  setShowAlliances,
  factionData,
  setFactionData,
}) {
  const {
    roster,
    setRoster,
    allianceLevel,
    factions: factionList,
  } = useStore();

  useEffect(() => {
    //If alliance level changes, and Halls of Thranduil is included in army, there might be some changes needed for Mirkwood Rangers.
    if (factionList.includes("Halls of Thranduil")) {
      let newRoster = handleMirkwoodRangers(roster, allianceLevel);
      setRoster(newRoster);
    }
    //If alliance level changes, and Variags of Khand is included in army, there might be some changes needed for Khandish Horseman/Charioteers.
    if (factionList.includes("Variags of Khand")) {
      let newRoster = handleKhandishHorsemanCharioteers(roster, allianceLevel);
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
    //The Serpent Horde and Azog's Hunters can have 50% bow limit if alliance level is Historical, otherwise it reverts to 33%.
    if (
      factionList.includes("The Serpent Horde") ||
      factionList.includes("Azog's Hunters")
    ) {
      let newFactionData = handle50PctBowLimit(factionData, allianceLevel);
      setFactionData(newFactionData);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [allianceLevel]);

  return (
    <Offcanvas show={showAlliances} onHide={() => setShowAlliances(false)}>
      <Offcanvas.Header className="border border-secondary" closeButton>
        <Offcanvas.Title>Alliances</Offcanvas.Title>
      </Offcanvas.Header>
      <Offcanvas.Body>
        <p className="pb-3">
          Historical allies keep their army bonuses, whereas Convenient and
          Impossible allies lose all army bonuses.
        </p>
        {factionList.map((f) => {
          return (
            <>
              <h5>
                <FactionLogo faction={f} className="faction_logo" />
                <b>{" " + f}</b>
              </h5>
              <hr />
              {factionData[f]["primaryAllies"].length > 0 && (
                <div className="pt-2">
                  <h5>
                    <Badge bg="success">Historical</Badge>
                  </h5>
                  {[
                    "Tom Bombadil",
                    "Goldberry",
                    "Barliman Butterbur",
                    "Bill the Pony",
                    "Grimbeorn",
                    "Beorning",
                    "Harry Goatleaf",
                    "Murin & Drar",
                    "Thrain the Broken (Good)",
                  ].includes(f)
                    ? factionData[f]["primaryAllies"]
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
                            ].includes(x),
                        )
                        .map((a) => (
                          <>
                            <span>
                              <FactionLogo
                                faction={f}
                                className="faction_logo"
                              />
                              {" " + a}
                            </span>
                            <br />
                          </>
                        ))
                    : factionData[f]["primaryAllies"].map((a) => (
                        <>
                          <span>
                            <FactionLogo faction={a} className="faction_logo" />
                            {" " + a}
                          </span>
                          <br />
                        </>
                      ))}
                </div>
              )}
              {factionData[f]["secondaryAllies"].length > 0 && (
                <div className="pt-2 pb-4">
                  <h5>
                    <Badge bg="warning">Convenient</Badge>
                  </h5>
                  {factionData[f]["secondaryAllies"].map((a) => (
                    <>
                      <span>
                        <FactionLogo faction={a} className="faction_logo" />
                        {" " + a}
                      </span>
                      <br />
                    </>
                  ))}
                </div>
              )}
            </>
          );
        })}
      </Offcanvas.Body>
    </Offcanvas>
  );
}
