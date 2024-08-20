import { v4 as uuid } from "uuid";
import { Unit } from "./unit.ts";

export type Warband = {
  id: typeof uuid;
  num: number;
  points: number;
  num_units: number;
  max_units: number | "-";
  bow_count: number;
  hero: Unit;
  units: Unit[];
};
