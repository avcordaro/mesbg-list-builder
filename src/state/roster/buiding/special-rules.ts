import hero_constraint_data from "../../../assets/data/hero_constraint_data.json";
import { Unit } from "../../../types/unit.ts";

export const hasSpecialArmyOption = (hero: Unit): boolean =>
  hero_constraint_data[hero.model_id] &&
  hero_constraint_data[hero.model_id][0]["special_army_option"] !== "";

export const getSpecialArmyOption = (hero: Unit): string =>
  hasSpecialArmyOption(hero)
    ? hero_constraint_data[hero.model_id][0]["special_army_option"]
    : null;
