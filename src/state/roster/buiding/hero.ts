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
    console.log({ warbandId, heroId, hero, roster });
    return {};
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
