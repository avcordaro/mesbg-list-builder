export const allianceColours: Record<string, string> = {
  Historical: "success",
  Convenient: "warning",
  Impossible: "error",
  "Legendary Legion": "info",
  "n/a": "mode",
};

export type AllianceLevel = keyof typeof allianceColours;
