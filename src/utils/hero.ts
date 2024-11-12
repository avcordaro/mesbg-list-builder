import { isDefinedUnit, Unit } from "../types/unit.ts";

export const isHeroWhoLeads = (hero: Unit): boolean => {
  if (!isDefinedUnit(hero)) return false;

  if (
    ["Independent Hero", "Independent Hero*", "Siege Engine"].includes(
      hero.unit_type,
    )
  )
    return false;

  if (
    [
      "[erebor_reclaimed_(king_thorin)] iron_hills_chariot_(champions_of_erebor)",
      "[desolator_of_the_north] smaug",
    ].includes(hero.model_id)
  )
    return false;

  return true;
};
