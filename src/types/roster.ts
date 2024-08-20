import { Warband } from "./warband.ts";

export type Roster = {
  version: string;
  num_units: number;
  points: number;
  bow_count: number;
  warbands: Warband[];
};
