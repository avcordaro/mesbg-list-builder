import { Fragment } from "react";
import Badge from "react-bootstrap/Badge";
import factionData from "../../../assets/data/faction_data.json";
import { useStore } from "../../../state/store";
import { Faction } from "../../../types/factions.ts";
import { wanderers } from "../../constants/wanderers";
import { FactionLogo } from "../../images/FactionLogo.tsx";

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
  const isWanderer = wanderers.includes(faction);

  const primaryAllies: Faction[] = factionData[faction]["primaryAllies"]
    // Filter other Wanders if this faction is a wanderer...
    .filter((ally) => isWanderer && !wanderers.includes(ally as Faction));
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
  // const { roster, setRoster, allianceLevel, factions } = useStore();
  const { factions } = useStore();

  // TODO: add this logic back in a form that it works for the new sidebar.
  // useEffect(() => {
  //   //If alliance level changes, and Halls of Thranduil is included in army, there might be some changes needed for Mirkwood Rangers.
  //   if (factionList.includes("Halls of Thranduil")) {
  //     let newRoster = handleMirkwoodRangers(roster, allianceLevel);
  //     setRoster(newRoster);
  //   }
  //   //If alliance level changes, and Variags of Khand is included in army, there might be some changes needed for Khandish Horseman/Charioteers.
  //   if (factionList.includes("Variags of Khand")) {
  //     let newRoster = handleKhandishHorsemanCharioteers(roster, allianceLevel);
  //     setRoster(newRoster);
  //   }
  //   //If alliance level chaneges, and Army of Lake-town is included in army, there might be some changes needed for the Master of Lake-town
  //   if (factionList.includes("Army of Lake-town")) {
  //     let newRoster = handleMasterLaketown(roster, allianceLevel);
  //     setRoster(newRoster);
  //   }
  //   //If alliance level chaneges, and Goblin-town is included in army, there might be some changes needed for the warband sizes
  //   if (factionList.includes("Goblin-town")) {
  //     let newRoster = handleGoblinTown(roster, allianceLevel);
  //     setRoster(newRoster);
  //   }
  //   //If alliance level chaneges, and The Trolls are included in army, there might be some changes needed for Bill's campfire
  //   if (factionList.includes("The Trolls")) {
  //     let newRoster = handleBillCampfire(roster, allianceLevel);
  //     setRoster(newRoster);
  //   }
  //   //The Serpent Horde and Azog's Hunters can have 50% bow limit if alliance level is Historical, otherwise it reverts to 33%.
  //   if (
  //     factionList.includes("The Serpent Horde") ||
  //     factionList.includes("Azog's Hunters")
  //   ) {
  //     let newFactionData = handle50PctBowLimit(factionData, allianceLevel);
  //     setFactionData(newFactionData);
  //   }
  //   // eslint-disable-next-line react-hooks/exhaustive-deps
  // }, [allianceLevel]);

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
