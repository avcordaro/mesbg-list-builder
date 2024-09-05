import { Unit } from "../../../types/unit.ts";
import {
  adjustPotentialArmyWideSpecialRuleOptions,
  handleAzog,
  handleMahudChief,
  handleSiegeEngineCaptainUpdates,
} from "../calculations";

export const assignHero =
  (warbandId: string, heroId: string, hero: Unit) =>
  ({ roster }) => ({
    roster: {
      ...roster,
      warbands: roster.warbands.map((warband) => {
        if (warband.id !== warbandId) return warband;

        return {
          ...warband,
          hero: {
            ...hero,
            id: heroId,
          },
        };
      }),
    },
  });

const getUpdatedHero = (hero: Unit, update: Partial<Unit>): Unit => {
  const updated: Unit = { ...hero, ...update };

  handleSiegeEngineCaptainUpdates(updated);
  handleMahudChief(updated);
  handleAzog(updated);

  return updated;
};

export const updateHero =
  (warbandId: string, heroId: string, hero: Partial<Unit>) =>
  ({ roster }) => {
    return {
      roster: {
        ...roster,
        warbands: roster.warbands.map((warband) => {
          if (warband.id !== warbandId) return warband;
          if (warband.hero.id !== heroId) {
            console.warn("The heros id did not match with warband hero", {
              warbandHeroId: warband.hero.id,
              heroId,
            });
          }

          const fullyUpdatedHero = getUpdatedHero(warband.hero, hero);
          return {
            ...warband,
            max_units: fullyUpdatedHero.warband_size,
            hero: fullyUpdatedHero,
          };
        }),
      },
    };
  };

export const deleteHero =
  (warbandId: string, heroId: string) =>
  ({ roster }) => {
    const deletedHero = roster.warbands.find(({ id }) => warbandId === id).hero;
    if (deletedHero.id !== heroId) {
      console.warn("The heros id did not match with warband hero", {
        warbandHeroId: deletedHero,
        heroId,
      });
    }

    adjustPotentialArmyWideSpecialRuleOptions(roster.warbands, deletedHero);
    return {
      roster: {
        ...roster,
        warbands: roster.warbands.map((warband) => {
          if (warband.id !== warbandId) return warband;

          return {
            ...warband,
            hero: null,
          };
        }),
      },
    };
  };

export const updateLeadingHero =
  (warbandId: string) =>
  ({ roster }) => {
    const leader = roster.leader_warband_id !== warbandId ? warbandId : null;
    return {
      roster: {
        ...roster,
        leader_warband_id: leader,
      },
    };
  };
