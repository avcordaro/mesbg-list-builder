import { Faction } from "./factions.ts";

export type FactionData = {
  armyBonus: string;
  bow_limit: number;
  primaryAllies: Faction[];
  secondaryAllies: Faction[];
};
