import faction_data from "../../assets/data/faction_data.json";
import { AllianceLevel } from "../../components/constants/alliances.ts";
import { FactionData } from "../../types/faction-data.ts";
import { Faction, Factions, FactionType } from "../../types/factions.ts";
import { Roster } from "../../types/roster.ts";
import {
  handleBillCampfire,
  handleGoblinTown,
  handleKhandishHorsemanCharioteers,
  handleMasterLaketown,
  handleMirkwoodRangers,
} from "../../utils/specialRules.js";

const checkAlliance = (
  a: Faction,
  b: Faction,
  factionData: Record<string, FactionData> = faction_data as Record<
    string,
    FactionData
  >,
): AllianceLevel => {
  if (factionData[a]["primaryAllies"].includes(b)) {
    return "Historical";
  }
  if (factionData[a]["secondaryAllies"].includes(b)) {
    return "Convenient";
  }
  return "Impossible";
};

const getAllianceLevel = (factionList: Faction[]): AllianceLevel => {
  // Create all possible pairs from the list of factions
  const pairs = factionList.flatMap((faction, index) =>
    factionList.slice(index + 1).map((otherFaction) => [faction, otherFaction]),
  );
  // Calculate the alliance level for each pair
  const alliances = pairs.map(([a, b]) => checkAlliance(a, b));

  // The lowest alliance level found between the pairs becomes the overall alliance level of the army roster
  if (alliances.includes("Impossible")) {
    return "Impossible";
  }
  if (alliances.includes("Convenient")) {
    return "Convenient";
  }
  return "Historical";
};

// TODO: Check how this can fit into the warnings.ts
export const calculateAllianceLevel = (
  factionList: Faction[],
  factionType: FactionType | "",
): AllianceLevel => {
  if (factionList.length === 0) {
    return "n/a"; // If no factions currently selected
  }

  if (factionType.includes("LL")) {
    return "Legendary Legion"; // if a Legendary Legion is selected it must be just a Legendary Legion
  }

  if (factionList.length === 1) {
    return "Historical"; // If just one faction selected it can only be Historical
  }

  return getAllianceLevel(factionList);
};

export const checkForSpecialCases = (
  allianceLevel: AllianceLevel,
  factions: Faction[],
  models: string[],
): [AllianceLevel, string[]] => {
  const warnings: string[] = [];
  if (allianceLevel === "Impossible") return ["Impossible", warnings];

  if (
    factions.includes(Factions.The_Dead_of_Dunharrow) &&
    factions.length > 1
  ) {
    const warning = checkDunharrow(allianceLevel, models);
    if (warning) {
      allianceLevel = "Impossible";
      warnings.push(warning);
    }
  }

  if (models.includes("[rivendell] gil-galad")) {
    allianceLevel = checkGilGalad(allianceLevel, factions);
    warnings.push(
      "If Gil-Galad is included in the your force, all alliances become impossible except for Numenor (Historical) " +
        "and Lothlorien, Fangorn and The Misty Mountains (Convenient).",
    );
  }

  return [allianceLevel, warnings];
};

const checkDunharrow = (
  currentAllianceLevel: AllianceLevel,
  modelsInArmy: string[],
): string => {
  const requiredModelToHave = [
    "[minas_tirith] aragorn,_king_elessar",
    "[the_fellowship] aragorn,_strider",
    "[the_rangers] aragorn,_strider",
  ];
  const intersection = requiredModelToHave.filter((requiredModel) =>
    modelsInArmy.includes(requiredModel),
  );
  if (currentAllianceLevel !== "Impossible" && intersection.length === 0) {
    return "A Dead of Dunharrow army list is automatically Impossible Allies with any force that doesn't also include Aragorn.";
  }
  return null;
};

const checkGilGalad = (
  currentAllianceLevel: AllianceLevel,
  faction_list: Faction[],
): AllianceLevel => {
  if (currentAllianceLevel === "Impossible") {
    return currentAllianceLevel;
  }

  const gilGaladFactionData: Record<string, FactionData> = {
    "Gil Galad": {
      primaryAllies: [Factions.Rivendell, Factions.Numenor],
      secondaryAllies: [
        Factions.Lothlorien,
        Factions.Fangorn,
        Factions.The_Misty_Mountains,
      ],
      // the fields below are not important for the calculation.
      armyBonus: "",
      bow_limit: 0,
    },
  };

  const alliances = faction_list.map((faction) =>
    checkAlliance("Gil Galad" as Faction, faction, gilGaladFactionData),
  );

  // The lowest alliance level found between the pairs becomes the overall alliance level of the army roster
  if (alliances.includes("Impossible")) {
    return "Impossible";
  }
  if (alliances.includes("Convenient")) {
    return "Convenient";
  }
  return "Historical";
};

export const makeAllianceSpecificRosterAjustments = (
  factionList: Faction[],
  allianceLevel: AllianceLevel,
  roster: Roster,
): Roster => {
  let updatedRoster = { ...roster };

  // If alliance level changes, and Halls of Thranduil is included in army, there might be some changes needed for Mirkwood Rangers.
  if (factionList.includes(Factions.Halls_of_Thranduil)) {
    updatedRoster = handleMirkwoodRangers(updatedRoster, allianceLevel);
  }
  //If alliance level changes, and Variags of Khand is included in army, there might be some changes needed for Khandish Horseman/Charioteers.
  if (factionList.includes(Factions.Variags_of_Khand)) {
    updatedRoster = handleKhandishHorsemanCharioteers(
      updatedRoster,
      allianceLevel,
    );
  }
  //If alliance level chaneges, and Army of Lake-town is included in army, there might be some changes needed for the Master of Lake-town
  if (factionList.includes(Factions.Army_of_Lake_town)) {
    updatedRoster = handleMasterLaketown(updatedRoster, allianceLevel);
  }
  //If alliance level chaneges, and Goblin-town is included in army, there might be some changes needed for the warband sizes
  if (factionList.includes(Factions.Goblin_town)) {
    updatedRoster = handleGoblinTown(updatedRoster, allianceLevel);
  }
  //If alliance level chaneges, and The Trolls are included in army, there might be some changes needed for Bill's campfire
  if (factionList.includes(Factions.The_Trolls)) {
    updatedRoster = handleBillCampfire(updatedRoster, allianceLevel);
  }

  return updatedRoster;
};
