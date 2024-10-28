import { Slice } from "../../Slice.ts";

export type ActiveRosterState = {
  activeRoster: string | null;
  setActiveRoster: (roster: string) => void;
};

const initialState = {
  activeRoster: null,
};

export const activeRoster: Slice<ActiveRosterState, ActiveRosterState> = (
  set,
) => ({
  ...initialState,

  setActiveRoster: (rosterName: string) =>
    set(() => ({ activeRoster: rosterName }), undefined, "SET_ACTIVE_ROSTER"),
});
