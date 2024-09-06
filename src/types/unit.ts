import { Faction, FactionType } from "./factions.ts";

export type Unit = {
  id: string;
  base_points: number;
  bow_limit: boolean;
  default_bow: boolean;
  faction: Faction;
  faction_type: FactionType;
  inc_bow_count: boolean;
  model_id: string;
  name: string;
  options: Option[];
  pointsPerUnit: number;
  pointsTotal: number;
  profile_origin: Faction;
  quantity: number;
  siege_crew: number;
  unique: boolean;
  unit_type: UnitType;
  warband_size: number;
  MWFW: [string | number, string][];
};

export type FreshUnit = Pick<Unit, "id" | "name">;

export const isDefinedUnit = (unit: FreshUnit): unit is Unit => !!unit?.name;

export type UnitType =
  | "Warrior"
  | "Hero of Legend"
  | "Hero of Valour"
  | "Hero of Fortitude"
  | "Minor Hero"
  | "Independent Hero"
  | "Siege Engine"
  | string;

export type Option = {
  max: number;
  min: number;
  opt_quantity: number;
  option: string;
  option_id: string;
  points: number;
  type:
    | "mount"
    | "bow"
    | "add_crew"
    | "engineer_cpt"
    | "special_army_upgrade"
    | "special_warband_upgrade"
    | "treebeard_m&p"
    | "mahud_chief"
    | null;
};
