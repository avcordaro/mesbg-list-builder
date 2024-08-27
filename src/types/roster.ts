import { Warband } from "./warband.ts";

export type Roster = {
  version: string;
  warbands: Warband[];
  leader_warband_num: number | null;
  num_units: number;
  bow_count: number;
  points: number;
};
