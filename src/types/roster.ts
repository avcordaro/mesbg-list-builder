import { Warband } from "./warband.ts";

export type Roster = {
  version: string;
  warbands: Warband[];
  leader_warband_id: string | null;
  num_units: number;
  bow_count: number;
  might_total: number;
  points: number;
};
