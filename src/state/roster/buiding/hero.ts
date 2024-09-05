import { Unit } from "../../../types/unit.ts";

export const assignHero =
  (warbandId: string, heroId: string, hero: Unit) =>
  ({ roster }) => {
    console.log({ warbandId, heroId, hero, roster });
    return {};
  };

export const updateHero =
  (warbandId: string, heroId: string, hero: Partial<Unit>) =>
  ({ roster }) => {
    // TODO: Handle option (de)selection for the following cases:
    // - "treebeard_m&p"
    // - engineer_cpt
    // --- Extra upgrades (shield & bow)
    // --- Increased warband size
    // - mahud_chief
    // - [azog's_legion] azog (With Signal Tower)
    // - Azog with White Warg

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
          return {
            ...warband,
            hero: {
              ...warband.hero,
              ...hero,
            },
          };
        }),
      },
    };
  };

export const deleteHero =
  (warbandId: string, heroId: string) =>
  ({ roster }) => {
    console.log({ warbandId, heroId, roster });
    return {};
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
