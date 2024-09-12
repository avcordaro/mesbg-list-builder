import { ChipOwnProps } from "@mui/material/Chip/Chip";

export const allianceColours: Record<string, ChipOwnProps["color"]> = {
  Historical: "success",
  Convenient: "warning",
  Impossible: "error",
  "Legendary Legion": "info",
  "n/a": "default",
};

export type AllianceLevel = keyof typeof allianceColours;
