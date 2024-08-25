import { v4 as uuid } from "uuid";
import hero_constraint_data from "../../../assets/data/hero_constraint_data.json";
import { FreshUnit, isDefinedUnit, Unit } from "../../../types/unit.ts";
import { Warband } from "../../../types/warband.ts";
import { findAndRemoveItem } from "../../../utils/array.ts";
import { AppState } from "../../store.ts";

export const addWarband =
  () =>
  ({ roster }: AppState) => {
    roster.warbands.push({
      id: uuid(),
      num: roster.warbands.length + 1,
      points: 0,
      num_units: 0,
      max_units: "-",
      bow_count: 0,
      hero: null,
      units: [],
    });
    return {
      roster,
    };
  };

const hasSpecialArmyOption = (hero: Unit): boolean =>
  hero_constraint_data[hero.model_id] &&
  hero_constraint_data[hero.model_id][0]["special_army_option"] !== "";

const getSpecialArmyOption = (hero: Unit): string =>
  hero_constraint_data[hero.model_id][0]["special_army_option"];

const adjustPotentialArmyWideSpecialRule = (
  warbands: Warband[],
  hero: Unit | FreshUnit,
) => {
  if (!isDefinedUnit(hero)) return; // Hero was not defined, nothing needs to be updated in this section.
  if (!hasSpecialArmyOption(hero)) return; // Hero does not have army-wide special rules that need adjustment.

  const option = getSpecialArmyOption(hero);

  console.log("Deleting army-wide option: ", option);
  // todo: Remove option from all remaining units that have it + adjust points in roster.
};

export const deleteWarband =
  (warbandId: string) =>
  ({ roster }: AppState) => {
    const deletedWarband = findAndRemoveItem(
      roster.warbands,
      (warband) => warband.id === warbandId,
    );

    if (!deletedWarband) {
      // Nothing was deleted here... not sure how though!
      console.warn("Deleted warband resulted in 'null'?!");
      return { roster };
    }

    const deletedModels = [
      isDefinedUnit(deletedWarband.hero) ? deletedWarband.hero.model_id : null,
      ...deletedWarband.units
        .filter(isDefinedUnit)
        .map((unit) => unit.model_id),
    ].filter((v) => !!v);

    // todo: Adjust rating & bow-limit
    adjustPotentialArmyWideSpecialRule(roster.warbands, deletedWarband.hero);

    console.log({ roster, deletedWarband, deletedModels });

    // update warband numbers
    roster.warbands = roster.warbands.map((warband, index) => ({
      ...warband,
      num: index + 1,
    }));

    return { roster };
  };
