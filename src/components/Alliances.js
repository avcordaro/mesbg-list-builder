import Offcanvas from "react-bootstrap/Offcanvas";
import Badge from "react-bootstrap/Badge";
import {useEffect} from "react";
import {
  handle50PctBowLimit,
  handleBillCampfire, handleGoblinTown, handleMasterLaketown, handleMirkwoodRangers
} from "./specialRules";

const checkAlliance = (army_A, army_B, faction_data) => {
  // Checks the alliance level between two given armies
  if (faction_data[army_A]['primaryAllies'].includes(army_B)) {
    return 'Historical'
  } else if (faction_data[army_A]['secondaryAllies'].includes(army_B)) {
    return 'Convenient'
  }
  return 'Impossible'
};

export const calculateAllianceLevel = (_factionList, _factionType, faction_data) => {
  // Calculates overall alliance level for current army roster selection
  if (_factionType.includes('LL')) {
    return 'Legendary Legion';
  } else if (_factionList.length === 0) {
    // If no factions currently selected
    return 'n/a';
  } else if (_factionList.length === 1) {
    // If just one faction selected
    return 'Historical';
  } else {
    // Create all possible pairs from the list of factions
    let faction_pairs = _factionList.flatMap((v, i) => _factionList.slice(i + 1).map(w => [v, w]));
    // Calculate the alliance level for each pair
    let pairs_alliances = faction_pairs.map(pair => checkAlliance(pair[0], pair[1], faction_data));
    // The lowest alliance level found between the pairs becomes the overall alliance level of the army roster
    if (pairs_alliances.includes('Impossible')) {
      return 'Impossible';
    } else if (pairs_alliances.includes('Convenient')) {
      return 'Convenient';
    } else {
      return 'Historical';
    }
  }
}

/* Displays an Offcanvas component showing the possible alliances for the current army selection. */

export function Alliances({
                            roster,
                            setRoster,
                            allianceLevel,
                            showAlliances,
                            setShowAlliances,
                            factionList,
                            factionData,
                            setFactionData
                          }) {

  useEffect(() => {
    //If alliance level changes, and Halls of Thranduil is included in army, there might be some changes needed for Mirkwood Rangers.
    if (factionList.includes("Halls of Thranduil")) {
      let newRoster = handleMirkwoodRangers(roster, allianceLevel);
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
    if (factionList.includes("The Serpent Horde") || factionList.includes("Azog's Hunters")) {
      let newFactionData = handle50PctBowLimit(factionData, allianceLevel);
      setFactionData(newFactionData);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [allianceLevel]);

  return (<Offcanvas show={showAlliances} onHide={() => setShowAlliances(false)}>
    <Offcanvas.Header closeButton>
      <Offcanvas.Title>Alliances</Offcanvas.Title>
    </Offcanvas.Header>
    <Offcanvas.Body>
      <p className="pb-3">
        Historical allies keep their army bonuses, whereas Convenient and Impossible allies lose
        all army bonuses.
      </p>
      {factionList.map((f) => {
        return (<>
          <h5>
            <img
              className="faction_logo"
              src={(() => {
                try {
                  return require("../images/faction_logos/" + f + ".png");
                } catch (e) {
                  return require("../images/default.png");
                }
              })()}
              alt=""
            />
            <b>{" " + f}</b>
          </h5>
          <hr/>
          {factionData[f]["primaryAllies"].length > 0 && (<div className="pt-2">
            <h5>
              <Badge bg="success">Historical</Badge>
            </h5>
            {["Tom Bombadil", "Goldberry", "Barliman Butterbur", "Bill the Pony", "Grimbeorn", "Beorning", "Harry Goatleaf", "Murin & Drar", "Thrain the Broken (Good)"].includes(f) ? factionData[f]["primaryAllies"].filter((x) => !["Tom Bombadil", "Goldberry", "Barliman Butterbur", "Bill the Pony", "Grimbeorn", "Beorning", "Harry Goatleaf", "Murin & Drar", "Thrain the Broken (Good)"].includes(x)).map((a) => (<>
                        <span>
                          <img
                            className="faction_logo"
                            src={(() => {
                              try {
                                return require("../images/faction_logos/" + a + ".png");
                              } catch (e) {
                                return require("../images/default.png");
                              }
                            })()}
                            alt=""
                          />
                          {" " + a}
                        </span>
              <br/>
            </>)) : factionData[f]["primaryAllies"].map((a) => (<>
                        <span>
                          <img
                            className="faction_logo"
                            src={(() => {
                              try {
                                return require("../images/faction_logos/" + a + ".png");
                              } catch (e) {
                                return require("../images/default.png");
                              }
                            })()}
                            alt=""
                          />
                          {" " + a}
                        </span>
              <br/>
            </>))}
          </div>)}
          {factionData[f]["secondaryAllies"].length > 0 && (<div className="pt-2 pb-4">
            <h5>
              <Badge bg="warning">Convenient</Badge>
            </h5>
            {factionData[f]["secondaryAllies"].map((a) => (<>
                      <span>
                        <img
                          className="faction_logo"
                          src={(() => {
                            try {
                              return require("../images/faction_logos/" + a + ".png");
                            } catch (e) {
                              return require("../images/default.png");
                            }
                          })()}
                          alt=""
                        />
                        {" " + a}
                      </span>
              <br/>
            </>))}
          </div>)}
        </>);
      })}
    </Offcanvas.Body>
  </Offcanvas>);
}
