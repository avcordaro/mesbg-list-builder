import { Unit } from "./unit.ts";

export type Warband = {
  id: string;
  num: number;
  points: number;
  num_units: number;
  max_units: number | "-";
  bow_count: number;
  hero: Unit;
  units: Unit[];
};
