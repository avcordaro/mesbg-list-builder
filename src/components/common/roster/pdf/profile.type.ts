export type Profile = {
  name: string;
  F: string;
  A: string;
  C: string;
  D: string;
  HF: string;
  HM: string;
  HW: string;
  Mv: string;
  S: string;
  W: string;
  additional_stats: Omit<Profile, "magic_powers">[];
  additional_text: string[];
  heroic_actions: string[];
  special_rules: string[];
  active_or_passive_rules: {
    name: string;
    type: "Active" | "Passive";
    description: string;
  }[];
  magic_powers: { name: string; range: string; cast: string }[];
  wargear: string[];
};
