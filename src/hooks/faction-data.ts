import { useEffect, useState } from "react";
import factionDataRaw from "../assets/data/faction_data.json";
import { useRosterBuildingState } from "../state/roster-building";

export const useFactionData = () => {
  const { allianceLevel } = useRosterBuildingState();
  const [factionData, setFactionData] = useState(factionDataRaw);

  useEffect(() => {
    const bow_limit = allianceLevel === "Historical" ? 0.5 : 0.33;
    setFactionData({
      ...factionData,
      ["The Serpent Horde"]: {
        ...factionData["The Serpent Horde"],
        bow_limit,
      },
      ["Azog's Hunters"]: {
        ...factionData["Azog's Hunters"],
        bow_limit,
      },
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [allianceLevel]);

  return factionData;
};
