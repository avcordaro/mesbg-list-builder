import { Faction, Factions, FactionType } from "../../types/factions.ts";
import { Warband } from "../../types/warband.ts";
import { getSpecialArmyOption } from "./buiding/special-rules.ts";

export function getFactionType(warbands: Warband[]): FactionType | "" {
  if (warbands && warbands.length <= 0) {
    return ""; // no warbands equals no info
  }

  const factionTypes: FactionType[] = warbands
    .map(({ hero }) => hero?.faction_type)
    .filter((faction) => !!faction);
  if (factionTypes.every((factionType) => factionType === factionTypes[0])) {
    return factionTypes[0] || "";
  }

  return "";
}

function hasHeroInWandererArmyList({ hero }: Warband) {
  if (!hero) return false;
  const wandererFactions = [
    Factions.Wanders_in_the_Wild_Good,
    Factions.Wanders_in_the_Wild_Evil,
  ];
  return wandererFactions.includes(hero.faction);
}

function handleWanderersSpecialCase(
  currentFactions: Faction[],
  warbands: Warband[],
) {
  if (
    !(
      currentFactions.includes(Factions.Wanders_in_the_Wild_Good) ||
      currentFactions.includes(Factions.Wanders_in_the_Wild_Evil)
    )
  ) {
    return currentFactions;
  }

  const wanderers = warbands
    .filter(hasHeroInWandererArmyList)
    .map((warband) => warband.hero?.name);

  return [
    ...currentFactions.filter(
      (e) =>
        e !== Factions.Wanders_in_the_Wild_Good &&
        e !== Factions.Wanders_in_the_Wild_Evil,
    ),
    ...wanderers,
  ];
}

export function getFactionList(warbands: Warband[]): Faction[] {
  if (warbands && warbands.length <= 0) {
    return []; // no warbands equals no info
  }

  const factions: Faction[] = warbands
    .map(({ hero }) => hero?.faction)
    .filter((faction) => !!faction);
  const uniqueFactions = [...new Set(factions)];

  return handleWanderersSpecialCase(uniqueFactions, warbands) as Faction[];
}

export function getFactionSpecialRules(warbands: Warband[]): string[] {
  return warbands
    .flatMap((warband) => [
      getSpecialArmyOption(warband.hero),
      ...warband.units.map(getSpecialArmyOption),
    ])
    .filter((v) => !!v);
}
