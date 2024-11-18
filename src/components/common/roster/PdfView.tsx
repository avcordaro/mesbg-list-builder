import { AlertTitle } from "@mui/material";
import Alert from "@mui/material/Alert";
import Box from "@mui/material/Box";
import Stack from "@mui/material/Stack";
import Typography from "@mui/material/Typography";
import profiles from "../../../assets/data/profile_data.json";
import { useRosterBuildingState } from "../../../state/roster-building";
import { isDefinedUnit, Unit, UnitType } from "../../../types/unit.ts";
import { ArmyComposition } from "./pdf/ArmyComposition.tsx";
import { MagicalPowerList } from "./pdf/MagicalPowers.tsx";
import { QuickReferenceTable } from "./pdf/QuickReferenceTable.tsx";
import { SpecialRuleList } from "./pdf/SpecialRuleList.tsx";
import { StatTrackers } from "./pdf/StatTrackers.tsx";
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

function duplicateUnits(item: Unit, index: number, self: Unit[]) {
  return (
    index ===
    self.findIndex(
      (other) =>
        other.profile_origin === item.profile_origin &&
        other.name === item.name,
    )
  );
}

function duplicateProfiles(item: Profile, index: number, self: Profile[]) {
  return index === self.findIndex((other) => other.name === item.name);
}

function getMightWillAndFate(unit: Unit) {
  if (unit.MWFW && unit.MWFW[0]) {
    const [HM, HW, HF] = unit.MWFW[0][1].split(":");
    return { HM, HW, HF };
  } else {
    return {};
  }
}

function unusedAdditionalStats(
  unit: Unit,
): (stats: Omit<Profile, "magic_powers">) => boolean {
  return (stats) => {
    if (unit.unit_type === "Siege Engine" && stats.name.includes("Captain")) {
      return !!unit.options.find(
        (option) => option.type === "engineer_cpt" && option.opt_quantity > 0,
      );
    }
    return true;
  };
}

export const PdfView = () => {
  const { roster } = useRosterBuildingState();
  const missingProfiles = [];

  const insertMissingProfile = (unit: Unit): undefined => {
    missingProfiles.push(unit.name);
  };

  const units: Profile[] = roster.warbands
    .flatMap((wb) => [wb.hero, ...wb.units])
    .filter(isDefinedUnit)
    .filter(duplicateUnits)
    .sort(byHeroicTier)
    .map((unit): Profile | undefined => {
      const army = profiles[unit.profile_origin];
      if (!army) return insertMissingProfile(unit);

      const profile = army[unit.name];
      if (!profile) return insertMissingProfile(unit);

      const additional_stats =
        profile?.additional_stats?.filter(unusedAdditionalStats(unit)) || [];

      return {
        name: unit.name,
        ...profile,
        ...getMightWillAndFate(unit),
        additional_stats,
      };
    })
    .filter((v) => !!v)
    .filter(duplicateProfiles);

  return (
    <>
      {missingProfiles.length > 0 && (
        <Alert icon={false} severity="error" sx={{ mb: 1 }}>
          <AlertTitle>
            <b>Some selected units are missing profile data</b>
          </AlertTitle>
          <Typography>
            Some of the units selected in your roster have no registered profile
            data. If you see this message, please let us know via{" "}
            <a href="mailto:avcordaro@gmail.com?subject=MESBG List Builder - Bug/Correction">
              avcordaro@gmail.com
            </a>
            .
          </Typography>
          <Typography sx={{ mt: 1 }}>
            The following units have no profile data:
          </Typography>
          <Typography sx={{ mt: 1 }} variant="body2">
            <i>{JSON.stringify(missingProfiles)}</i>
          </Typography>
        </Alert>
      )}
      <Alert severity="info" sx={{ mb: 2 }}>
        Below is a preview of the PDF that is going to be downloaded
      </Alert>
      <Box sx={{ maxHeight: "50svh", width: "210mm" }}>
        <Box sx={{ border: 1, p: 3 }}>
          <Stack gap={4}>
            <QuickReferenceTable profiles={units} />
            <ArmyComposition />
            <UnitProfileList units={units} />
            <SpecialRuleList profiles={units} />
            <MagicalPowerList profiles={units} />
            <StatTrackers />
          </Stack>
        </Box>
      </Box>
    </>
  );
};
