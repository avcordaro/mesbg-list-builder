import { create } from "zustand";
import { createJSONStorage, devtools, persist } from "zustand/middleware";
import {
  storageNotification,
  StorageNotificationState,
} from "./storage-notification";
import { PreferenceState, userPreferences } from "./user-preferences";

export type UserPrefState = StorageNotificationState & PreferenceState;

export const useUserPreferences = create<
  UserPrefState,
  [["zustand/devtools", unknown], ["zustand/persist", unknown]]
>(
  devtools(
    persist(
      (...args) => ({
        ...storageNotification(...args),
        ...userPreferences(...args),
      }),
      {
        name: "mlb-user-prefs",
        storage: createJSONStorage(() => localStorage),
      },
    ),
  ),
);
