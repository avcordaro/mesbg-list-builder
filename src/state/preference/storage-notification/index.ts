import { Slice } from "../../Slice.ts";

export type StorageNotificationState = {
  storageNoticeActive: number;
  dismissStorageNotice: () => void;
};

const initialState = {
  storageNoticeActive: 0,
};

export const storageNotification: Slice<
  StorageNotificationState,
  StorageNotificationState
> = (set) => ({
  ...initialState,

  dismissStorageNotice: () =>
    set(
      () => ({ storageNoticeActive: Date.now() }),
      undefined,
      "DISMISS_STORAGE_WARNING",
    ),
});
