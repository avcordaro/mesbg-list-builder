import { Fragment } from "react";
import Badge from "react-bootstrap/Badge";
import { wanderers } from "../../../constants/wanderers";
import { useFactionData } from "../../../hooks/faction-data.ts";
import { useStore } from "../../../state/store";
import { Faction } from "../../../types/factions.ts";
import { FactionLogo } from "../../common/images/FactionLogo.tsx";

export const FactionRow = ({ faction }: { faction: Faction }) => (
  <>
    <FactionLogo faction={faction} className="faction_logo" />
    {" " + faction}
    <br />
  </>
);

function AlliesSection({ allies, type }: { allies: Faction[]; type: string }) {
  return (
    <div className="pb-2">
      <h5>
        <Badge bg={type === "Historical" ? "success" : "warning"}>{type}</Badge>
      </h5>
      {allies.map((ally) => (
        <FactionRow key={ally} faction={ally} />
      ))}
    </div>
  );
}

export const FactionAllies = ({ faction }: { faction: Faction }) => {
  const factionData = useFactionData();
  const isWanderer = wanderers.includes(faction);

  const primaryAllies: Faction[] = factionData[faction]["primaryAllies"]
    // Filter other Wanders if this faction is a wanderer...
    .filter((ally) => !isWanderer || !wanderers.includes(ally as Faction));
  const secondaryAllies: Faction[] = factionData[faction]["secondaryAllies"];

  return (
    <>
      <h5>
        <FactionRow faction={faction} />
      </h5>
      <hr />
      {primaryAllies.length > 0 && (
        <AlliesSection allies={primaryAllies} type="Historical" />
      )}
      {secondaryAllies.length > 0 && (
        <AlliesSection allies={secondaryAllies} type="Convenient" />
      )}
    </>
  );
};

export const Alliances = () => {
  const { factions } = useStore();

  return (
    <Fragment>
      <p className="pb-3">
        Historical allies keep their army bonuses, whereas Convenient and
        Impossible allies lose all army bonuses.
      </p>
      {factions.map((faction) => (
        <div key={faction} className="mt-5">
          <FactionAllies faction={faction} />
        </div>
      ))}
    </Fragment>
  );
};
