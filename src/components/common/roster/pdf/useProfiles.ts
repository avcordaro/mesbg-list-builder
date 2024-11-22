import hero_constraint_data from "../../../../assets/data/hero_constraint_data.json";
import profile_data from "../../../../assets/data/profile_data.json";
import { useRosterBuildingState } from "../../../../state/roster-building";
import { isDefinedUnit, Unit, UnitType } from "../../../../types/unit.ts";
import { Profile } from "./profile.type.ts";

const sorting: Record<UnitType, number> = {
  "Hero of Legend": 1,
  "Hero of Valour": 2,
  "Hero of Fortitude": 3,
  "Minor Hero": 4,
  "Independent Hero": 5,
  Warrior: 6,
  "Siege Engine": 7,
};

export const useProfiles = () => {
  const { roster } = useRosterBuildingState();
  const missingProfiles = [];

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

  function duplicateProfiles(item: Profile, index: number, self: Profile[]) {
    return index === self.findIndex((other) => other.name === item.name);
  }

  const formatMwfwRange = (input1, input2) => {
    console.log(input1, input2);

    if (typeof input1 === "string" && input1.includes("-")) {
      // Handle case with an existing range string
      const [lower, higher] = input1.split("-").map(Number);
      const newNumber = Number(input2);
      const newLower = Math.min(lower, newNumber);
      const newHigher = Math.max(higher, newNumber);
      return newLower === newHigher
        ? `${newLower}`
        : `${newLower} - ${newHigher}`;
    } else {
      // Handle initial two-number input (string or number)
      const num1 = Number(input1);
      const num2 = Number(input2);
      const lower = Math.min(num1, num2);
      const higher = Math.max(num1, num2);
      return lower === higher ? `${lower}` : `${lower} - ${higher}`;
    }
  };

  function combineProfiles(item: Profile, index: number, self: Profile[]) {
    const firstIndex = self.findIndex((other) => other.name === item.name);
    if (index === firstIndex) return item;

    const firstOccurrence = self[firstIndex];

    const combinedStats = [
      ...firstOccurrence.additional_stats,
      ...item.additional_stats,
    ];
    firstOccurrence.additional_stats = combinedStats.filter(duplicateProfiles);
    firstOccurrence.special_rules = [
      ...new Set([...firstOccurrence.special_rules, ...item.special_rules]),
    ];

    ["HM", "HW", "HF"].forEach((stat) => {
      firstOccurrence[stat] = formatMwfwRange(
        firstOccurrence[stat],
        item[stat],
      );
    });

    return item;
  }

  function getMightWillAndFate(unit: Unit) {
    const specialCases = [
      "[rohan] dernhelm",
      "[far_harad] war_mumak_of_far_harad",
      "[grand_army_of_the_south] war_mumak_of_far_harad",
      "[grand_army_of_the_south] war_mumak_of_harad",
      "[the_serpent_horde] war_mumak_of_harad",
      "[mordor] great_beast_of_gorgoroth",
      "[the_iron_hills] iron_hills_chariot_(captain)",
      "[erebor_reclaimed_(king_thorin)] iron_hills_chariot_(champions_of_erebor)",
    ];
    if (
      specialCases.includes(unit.model_id) ||
      unit.unit_type === "Siege Engine"
    )
      return { HM: "-", HW: "-", HF: "-" };

    if (unit.MWFW && unit.MWFW[0]) {
      const [HM, HW, HF] = unit.MWFW[0][1].split(":");
      return { HM, HW, HF };
    } else {
      return {};
    }
  }

  function unusedAdditionalStats(unit: Unit): (stats: Profile) => boolean {
    return (stats) => {
      if (unit.unit_type === "Siege Engine" && stats.name.includes("Captain")) {
        return !!unit.options.find(
          (option) => option.type === "engineer_cpt" && option.opt_quantity > 0,
        );
      }

      if (
        unit.model_id === "[the_serpent_horde] war_mumak_of_harad" ||
        unit.model_id === "[grand_army_of_the_south] war_mumak_of_harad"
      ) {
        const hasChief = !!unit.options.find(
          (option) => option.type === "mahud_chief" && option.opt_quantity > 0,
        );
        if (stats.name === "Mahud Beastmaster Chieftain") return hasChief;
        if (stats.name === "Haradrim Commander") return !hasChief;
      }

      return true;
    };
  }

  function insertMissingProfile(unit: Unit): undefined {
    missingProfiles.push(unit.name);
  }

  function getMountProfiles(unit: Unit): Profile[] {
    return (
      unit.options
        ?.filter((option) => option.type === "mount" && option.opt_quantity > 0)
        ?.map((mount) => {
          const name = mount.option.includes("Great Eagle")
            ? "Great Eagle"
            : mount.option;
          const mountMwfw = unit.MWFW.find(([mwfName]) =>
            String(mwfName).includes(name),
          ) || ["", "-:-:-:-"];
          const [HM, HW, HF] = mountMwfw[1].split(":");
          return {
            ...profile_data.Mounts[name],
            name: name,
            type: "mount",
            HM,
            HW,
            HF,
          };
        }) || []
    );
  }

  function getAdditionalProfilesFromConstraintsData(unit: Unit): Profile[] {
    const extraConstraints = hero_constraint_data[unit.model_id];
    if (!extraConstraints) return [];

    return extraConstraints
      .flatMap((c) => c.extra_profiles)
      .filter((profile) => {
        if (unit.model_id === "[fangorn] treebeard") {
          return (
            unit.options.find(({ type }) => type === "treebeard_m&p")
              ?.opt_quantity === 1
          );
        }
        if (unit.name === "Azog") {
          if (["The White Warg", "Signal Tower"].includes(profile)) {
            return (
              unit.options.find(({ option }) => option === profile)
                ?.opt_quantity === 1
            );
          }
        }

        return true;
      })
      .flatMap((name: string) => {
        const profile = profile_data[unit.profile_origin][name];
        if (!profile) return insertMissingProfile({ name } as Unit);

        if (name === "Signal Tower") {
          return [
            ...profile.additional_stats.map((stats) => ({
              ...stats,
              name: stats.name,
              HM: 1,
              HW: 1,
              HF: 1,
            })),
            {
              name,
              ...profile,
            },
          ];
        }

        const extraProfileMWFW = unit.MWFW.find(([mwfName]) =>
          String(mwfName).includes(name),
        );
        if (extraProfileMWFW) {
          const [HM, HW, HF] = extraProfileMWFW[1].split(":");
          return [{ ...profile, name, HM, HW, HF }];
        }
        return [{ ...profile, name }];
      })
      .filter((v) => !!v);
  }

  function getInitialWargearMountProfiles(profile: Profile): Profile[] {
    if (!profile.wargear || profile.wargear.length === 0) {
      return [];
    }

    return (
      profile.wargear
        .filter((wargear) => Object.keys(profile_data.Mounts).includes(wargear))
        .map((mount) => ({
          ...profile_data.Mounts[mount],
          name: mount,
          type: "mount",
        })) || []
    );
  }

  function getAdditionalStats(unit: Unit, profile: Profile): Profile[] {
    const additionalStats =
      profile?.additional_stats
        ?.filter(unusedAdditionalStats(unit))
        ?.map((profile) => {
          if (
            unit.unit_type === "Siege Engine" &&
            profile.name.includes("Engineer Captain")
          ) {
            const engineerMWFW = unit.MWFW.find(([name]) =>
              String(name).includes("Engineer Captain"),
            );
            if (engineerMWFW) {
              const [HM, HW, HF] = engineerMWFW[1].split(":");
              return { ...profile, HM, HW, HF };
            }
          }

          if (
            unit.name.includes("War Mumak of ") ||
            unit.name === "Great Beast of Gorgoroth"
          ) {
            const riderMwf = unit.MWFW.find(([name]) =>
              String(name).includes(profile.name),
            ) || ["", "-:-:-:-"];
            const [HM, HW, HF] = riderMwf[1].split(":");
            return { ...profile, HM, HW, HF };
          }

          if (
            unit.name === "Iron Hills Chariot (Captain)" &&
            profile.name === "Iron Hills Captain"
          ) {
            const [HM, HW, HF] = unit.MWFW[0][1].split(":");
            return { ...profile, HM, HW, HF };
          }

          return { ...profile };
        }) || [];

    // Insert Siege Veteran profile on Siege Engine without an engineer_cpt.
    if (unit.unit_type === "Siege Engine") {
      const hasEngineerCpt = unit.options.find(
        (option) => option.type === "engineer_cpt" && option.opt_quantity > 0,
      );
      if (!hasEngineerCpt) {
        const siegeVetStats = profile.additional_stats.find(
          (stat) => stat.name === "Crew",
        );
        const veteranMWFW = unit.MWFW.find(([name]) =>
          String(name).includes("Siege Veteran"),
        );
        if (siegeVetStats && veteranMWFW) {
          const [HM, HW, HF] = veteranMWFW[1].split(":");

          additionalStats.push({
            ...siegeVetStats,
            name: "Siege Veteran",
            HM,
            HW,
            HF,
          });
        }
      }
    }

    additionalStats.push(...getAdditionalProfilesFromConstraintsData(unit));
    additionalStats.push(...getMountProfiles(unit));
    additionalStats.push(...getInitialWargearMountProfiles(profile));

    return additionalStats.filter(duplicateProfiles);
  }

  function getAdditionalSpecialRules(unit: Unit) {
    if (unit.model_id === "[moria] dragon") {
      return unit.options
        .filter(({ opt_quantity }) => opt_quantity)
        .map(({ option }) => option);
    }
    if (unit.name.includes("War Mumak of ")) {
      return unit.options
        .filter(({ opt_quantity }) => opt_quantity)
        .filter(({ type }) => type !== "mahud_chief")
        .map(({ option }) => option);
    }
    if (unit.unit_type === "Siege Engine") {
      const siegeEngineUpgrades = [
        "Flaming Ammunition",
        "Swift Reload",
        "Superior Construction",
        "Severed Heads",
      ];
      return unit.options
        .filter(({ opt_quantity }) => opt_quantity)
        .filter(({ option }) => siegeEngineUpgrades.includes(option))
        .map(({ option }) => option);
    }

    return [];
  }

  function convertToProfileData(unit): Profile[] | undefined {
    const army = profile_data[unit.profile_origin];
    if (!army) return insertMissingProfile(unit);

    const profile = army[unit.name];
    if (!profile) return insertMissingProfile(unit);

    if (unit.name.includes("&") || unit.name === "Sharkey and Worm") {
      return profile.additional_stats.map((stats) => {
        const MWFW = unit.MWFW.find(([hName]) => hName === stats.name);
        const [HM, HW, HF] = MWFW[1].split(":");
        return { ...stats, HM, HW, HF };
      });
    }

    const additional_stats = getAdditionalStats(unit, profile);
    const additional_special_rules = getAdditionalSpecialRules(unit);

    return [
      {
        name: unit.name,
        ...profile,
        ...getMightWillAndFate(unit),
        additional_stats,
        special_rules: [...profile.special_rules, ...additional_special_rules],
      },
    ];
  }

  const profiles: Profile[] = roster.warbands
    .flatMap((wb) => [wb.hero, ...wb.units])
    .filter(isDefinedUnit)
    .sort(byHeroicTier)
    .flatMap(convertToProfileData)
    .filter((v) => !!v)
    .map(combineProfiles)
    .filter(duplicateProfiles);

  return {
    profiles,
    missingProfiles,
  };
};
