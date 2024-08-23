import { Faction } from "../../types/factions.ts";

export type GameModeHero = {
  name: string;
  profile_origin: Faction;
  MWFW: string;
  xMWFW: string;
  leader: boolean;
};

export type GameModeState = {
  heroes: Record<string, GameModeHero[]>;
  casualties: number;
  heroCasualties: number;
};
