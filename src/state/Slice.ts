import { StateCreator } from "zustand";

export type Slice<S, SR> = StateCreator<
  S,
  | [["zustand/devtools", unknown]]
  | [["zustand/devtools", unknown], ["zustand/persist", unknown]],
  [],
  SR
>;
