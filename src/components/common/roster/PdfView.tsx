import Box from "@mui/material/Box";
import Stack from "@mui/material/Stack";
import profiles from "../../../assets/data/profile_data.json";
import { useRosterBuildingState } from "../../../state/roster-building";
import { isDefinedUnit, Unit, UnitType } from "../../../types/unit.ts";
import { ArmyComposition } from "./pdf/ArmyComposition.tsx";
import { MagicalPowerList } from "./pdf/MagicalPowers.tsx";
import { QuickReferenceTable } from "./pdf/QuickReferenceTable.tsx";
import { SpecialRuleList } from "./pdf/SpecialRuleList.tsx";
import { UnitProfileList } from "./pdf/UnitProfileList.tsx";
import { Profile } from "./pdf/profile.type.ts";

const sorting: Record<UnitType, number> = {
  "Hero of Legend": 1,
  "Hero of Valour": 2,
  "Hero of Fortitude": 3,
  "Minor Hero": 4,
  "Independent Hero": 5,
  Warrior: 6,
  "Siege Engine": 7,
};

function byHeroicTier(a: Unit, b: Unit) {
  if (a.unit_type.includes("Hero") && a.unique) {
    if (b.unit_type.includes("Hero") && b.unique) {
      return sorting[a.unit_type] - sorting[b.unit_type];
    }
    return -1;
  }

  if (a.unit_type === "Warrior" && b.unit_type === "Warrior") {
    return a.name.localeCompare(b.name);
  }

  return sorting[a.unit_type] - sorting[b.unit_type];
}

function duplicates(item: Unit, index: number, self: Unit[]) {
  return (
    index ===
    self.findIndex(
      (other) =>
        other.profile_origin === item.profile_origin &&
        other.name === item.name,
    )
  );
}

function getMightWillAndFate(unit: Unit) {
  if (unit.MWFW && unit.MWFW[0]) {
    const [HM, HW, HF] = unit.MWFW[0][1].split(":");
    return { HM, HW, HF };
  } else {
    return {};
  }
}

export const PdfView = () => {
  const { roster } = useRosterBuildingState();
  const units: Profile[] = roster.warbands
    .flatMap((wb) => [wb.hero, ...wb.units])
    .filter(isDefinedUnit)
    .filter(duplicates)
    .sort(byHeroicTier)
    .map((unit) => {
      const army = profiles[unit.profile_origin];
      if (!army) return null;

      const profile = army[unit.name];
      if (!profile) return null;
      return {
        name: unit.name,
        ...profile,
        ...getMightWillAndFate(unit),
      };
    })
    .filter((v) => !!v);

  return (
    <Box sx={{ position: "absolute", left: "-100vw" }}>
      <Stack gap={1} sx={{ mb: 2, maxWidth: "180mm" }}>
        <QuickReferenceTable profiles={units} />
        <ArmyComposition />
        <UnitProfileList units={units} />
        <SpecialRuleList profiles={units} />
        <MagicalPowerList profiles={units} />
      </Stack>
    </Box>
  );
};
