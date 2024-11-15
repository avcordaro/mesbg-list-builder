import deepEqual from "fast-deep-equal";
import { temporal, TemporalState } from "zundo";
import { create, StoreApi, useStore } from "zustand";

import { createJSONStorage, devtools, persist } from "zustand/middleware";
import { builderSlice, BuilderState } from "./builder-selection";
import { dragAndDropSlice, DragAndDropState } from "./drag-and-drop";
import { rosterSlice, RosterState } from "./roster";

export type RosterBuildingState = RosterState & BuilderState & DragAndDropState;

export const useRosterBuildingState = create<
  RosterBuildingState,
  [
    ["zustand/devtools", unknown],
    ["zustand/persist", unknown],
    ["temporal", StoreApi<TemporalState<Partial<RosterBuildingState>>>],
  ]
>(
  devtools(
    persist(
      temporal(
        (...args) => ({
          ...rosterSlice(...args),
          ...builderSlice(...args),
          ...dragAndDropSlice(...args),
        }),
        {
          partialize: (state) => ({
            roster: state.roster,
            factions: state.factions,
            factionType: state.factionType,
            factionMetaData: state.factionMetaData,
            factionEnabledSpecialRules: state.factionEnabledSpecialRules,
            allianceLevel: state.allianceLevel,
            armyBonusActive: state.armyBonusActive,
            uniqueModels: state.uniqueModels,
            rosterBuildingWarnings: state.rosterBuildingWarnings,
          }),
          equality: (pastState, currentState) =>
            deepEqual(pastState, currentState),
          limit: 20,
        },
      ),
      {
        name: "mlb-builder-default",
        storage: createJSONStorage(() => localStorage),
      },
    ),
  ),
);

export const useTemporalRosterBuildingState = <T>(
  selector: (state: TemporalState<RosterBuildingState>) => T,
) => useStore(useRosterBuildingState.temporal, selector);
