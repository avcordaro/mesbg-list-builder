import { AppState } from "./store.ts";

type StoreKey = keyof AppState;
export const keysToPersist: StoreKey[] = [
  "roster",
  "gameMode",
  "gameState",
  "factions",
  "factionType",
  "factionMetaData",
  "factionEnabledSpecialRules",
  "allianceLevel",
  "uniqueModels",
  "rosterBuildingWarnings",
  "armyBonusActive",
  "tabSelection",
  "factionSelection",
];

export const getStateToPersist = (state: AppState): Partial<AppState> =>
  Object.fromEntries(
    Object.entries(state).filter((stateEntry) =>
      keysToPersist.includes(stateEntry[0] as StoreKey),
    ),
  );
