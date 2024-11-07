import { Slice } from "../../Slice.ts";

export type PreferenceState = {
  useDenseMode: boolean;
  setDenseMode: (value: boolean) => void;
};

const initialState = {
  useDenseMode: false,
};

export const userPreferences: Slice<PreferenceState, PreferenceState> = (
  set,
) => ({
  ...initialState,

  setDenseMode: (value: boolean) =>
    set(() => ({ useDenseMode: value }), undefined, "SET_DENSE_MODE"),
});
