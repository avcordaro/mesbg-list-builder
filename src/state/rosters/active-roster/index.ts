import { Slice } from "../../Slice.ts";

export type ActiveRosterState = {
  activeRoster: string | null;
  setActiveRoster: (roster: string) => void;

  storageNoticeActive: boolean;
  dismissStorageNotice: () => void;
};

const initialState = {
  activeRoster: null,
  storageNoticeActive: true,
};

export const activeRoster: Slice<ActiveRosterState, ActiveRosterState> = (
  set,
) => ({
  ...initialState,

  setActiveRoster: (rosterName: string) =>
    set(() => ({ activeRoster: rosterName }), undefined, "SET_ACTIVE_ROSTER"),

  dismissStorageNotice: () =>
    set(
      () => ({ storageNoticeActive: false }),
      undefined,
      "DISMISS_STORAGE_WARNING",
    ),
});
