import { Unit } from "../../../types/unit.ts";

export const selectUnit =
  (warbandId: string, unitId: string, unit: Unit) =>
  ({ roster }) => {
    console.log({ warbandId, unitId, unit, roster });
    return {};
  };

export const updateUnit =
  (warbandId: string, heroId: string, hero: Unit) =>
  ({ roster }) => {
    console.log({ warbandId, heroId, hero, roster });
    return {};
  };

export const duplicateUnit =
  (warbandId: string, unitId: string) =>
  ({ roster }) => {
    console.log({ warbandId, unitId, roster });
    return {};
  };

export const deleteUnit =
  (warbandId: string, unitId: string) =>
  ({ roster }) => {
    console.log({ warbandId, unitId, roster });
    return {};
  };
