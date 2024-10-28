import { Slice } from "../../Slice.ts";

export type SavedRosterState = {
  lastOpenedRoster: string;
  rosters: string[];

  saveNewRoster: (name: string) => void;
  deleteRoster: (name: string) => void;
  setLastOpenedRoster: (name: string) => void;
};

const initialState = {
  lastOpenedRoster: "default",
  rosters: ["default"],
};

export const savedRosters: Slice<SavedRosterState, SavedRosterState> = (
  set,
) => ({
  ...initialState,

  saveNewRoster: (rosterName: string) =>
    set(
      ({ rosters }) => ({ rosters: [...rosters, rosterName] }),
      undefined,
      "SAVE_ROSTER",
    ),
  deleteRoster: (rosterName: string) =>
    set(
      ({ rosters }) => ({
        rosters: rosters.filter((roster) => roster !== rosterName),
      }),
      undefined,
      "SAVE_ROSTER",
    ),
  setLastOpenedRoster: (rosterName: string) =>
    set(
      () => ({ lastOpenedRoster: rosterName }),
      undefined,
      "SET_LAST_OPENED_ROSTER",
    ),
});
