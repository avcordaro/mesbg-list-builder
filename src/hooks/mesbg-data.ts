import heroConstraintData from "../assets/data/hero_constraint_data.json";
import rawData from "../assets/data/mesbg_data.json";
import { useStore } from "../state/store.ts";
import { Faction, FactionType } from "../types/factions.ts";
import { isDefinedUnit, Unit } from "../types/unit.ts";

export const useMesbgData = () => {
  const { warriorSelectionFocus, roster, uniqueModels } = useStore();

  const factionsGroupedByType: Record<
    FactionType,
    Set<Faction>
  > = rawData.reduce(
    (a, { faction_type, faction }) => {
      if (!a[faction_type]) a[faction_type] = new Set();
      a[faction_type].add(faction);
      return a;
    },
    {
      "Good Army": undefined,
      "Evil Army": undefined,
      "Good LL": undefined,
      "Evil LL": undefined,
    } as Record<FactionType, Set<Faction>>,
  );

  const getFactionsOfType = (type: FactionType) =>
    Array.from(factionsGroupedByType[type]);

  const getHeroesFromFaction = (faction: Faction): Unit[] => {
    return rawData.filter(
      (data) =>
        data.faction === faction &&
        !["Independent Hero*", "Warrior"].includes(data.unit_type),
    ) as Unit[];
  };

  function getEligibleWarbandUnitsForHero(
    warbandHero: Unit,
    checkUnique: boolean = true,
  ) {
    const heroData = heroConstraintData[warbandHero.model_id];
    if (!heroData || !heroData[0]) return [];
    const validUnits = heroData[0]["valid_warband_units"];

    return rawData.filter(
      (data) =>
        validUnits.includes(data.model_id) &&
        (!checkUnique ||
          !(data.unique && uniqueModels.includes(data.model_id))),
    ) as Unit[];
  }

  const getEligibleWarbandUnits = (): Unit[] => {
    const [focusedWarband] = warriorSelectionFocus;
    const warbandHero: Unit | null = roster.warbands.find(
      ({ id }) => focusedWarband === id,
    )?.hero;

    if (!isDefinedUnit(warbandHero)) return [];
    return getEligibleWarbandUnitsForHero(warbandHero);
  };

  return {
    factionsGroupedByType,
    getFactionsOfType,
    getHeroesFromFaction,
    getEligibleWarbandUnits,
    getEligibleWarbandUnitsForHero,
  };
};
