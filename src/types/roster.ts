import { Warband } from "./warband.ts";

export type Roster = {
  version: string;
  num_units: number;
  points: number;
  bow_count: number;
  leader_warband_num: number | null;
  warbands: Warband[];
};
