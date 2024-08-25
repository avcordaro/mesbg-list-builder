import { Faction } from "../../types/factions.ts";

export type GameModeHero = {
  name: string;
  profile_origin: Faction;
  MWFW: string;
  xMWFW: string;
  leader: boolean;
};
