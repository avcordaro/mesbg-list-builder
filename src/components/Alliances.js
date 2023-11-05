import Offcanvas from "react-bootstrap/Offcanvas";
import Badge from "react-bootstrap/Badge";
import faction_data from "../faction_data.json";

export function Alliances({ showAlliances, setShowAlliances, factionList }) {
  return (
    <Offcanvas show={showAlliances} onHide={() => setShowAlliances(false)}>
      <Offcanvas.Header closeButton>
        <Offcanvas.Title>Alliances</Offcanvas.Title>
      </Offcanvas.Header>
      <Offcanvas.Body>
        <p className="pb-3">
          Historical allies keep their army bonuses, whereas Convenient and Impossible allies lose all army bonuses.
        </p>
        {factionList.map((f) => {
          return (
            <>
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
                />
                <b>{" " + f}</b>
              </h5>
              <hr />
              {faction_data[f]["primaryAllies"].length > 0 && (
                <div className="pt-2">
                  <h5>
                    <Badge bg="success">Historical</Badge>
                  </h5>
                  {faction_data[f]["primaryAllies"].map((a) => (
                    <>
                      <span>
                        <img
                          className="faction_logo"
                          src={(() => {
                            try {
                              return require("../images/faction_logos/" +
                                a +
                                ".png");
                            } catch (e) {
                              return require("../images/default.png");
                            }
                          })()}
                        />
                        {" " + a}
                      </span>
                      <br />
                    </>
                  ))}
                </div>
              )}
              {faction_data[f]["secondaryAllies"].length > 0 && (
                <div className="pt-2 pb-4">
                  <h5>
                    <Badge bg="warning">Convenient</Badge>
                  </h5>
                  {faction_data[f]["secondaryAllies"].map((a) => (
                    <>
                      <span>
                        <img
                          className="faction_logo"
                          src={(() => {
                            try {
                              return require("../images/faction_logos/" +
                                a +
                                ".png");
                            } catch (e) {
                              return require("../images/default.png");
                            }
                          })()}
                        />
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
