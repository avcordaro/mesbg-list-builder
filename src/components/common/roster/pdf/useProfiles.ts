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

  function getMightWillAndFate(unit: Unit) {
    const specialCases = ["[rohan] dernhelm"];
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

  function getAdditionalStats(unit: Unit, profile: Profile) {
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

          return { ...profile };
        }) || [];

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

    const extraConstraints = hero_constraint_data[unit.model_id];
    if (extraConstraints) {
      const extraProfiles = extraConstraints
        .flatMap((c) => c.extra_profiles)
        .filter(() => {
          if (unit.model_id === "[fangorn] treebeard") {
            return (
              unit.options.find(({ type }) => type === "treebeard_m&p")
                ?.opt_quantity === 1
            );
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

      additionalStats.push(...extraProfiles);
    }

    const mountProfiles =
      unit.options
        ?.filter((option) => option.type === "mount" && option.opt_quantity > 0)
        ?.map((mount) => {
          const name = mount.option;
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
        }) || [];
    additionalStats.push(...mountProfiles);

    if (profile.wargear && profile.wargear.length > 0) {
      const defaultMountProfiles =
        profile.wargear
          .filter((wargear) =>
            Object.keys(profile_data.Mounts).includes(wargear),
          )
          .map((mount) => ({
            ...profile_data.Mounts[mount],
            name: mount,
            type: "mount",
          })) || [];
      additionalStats.push(...defaultMountProfiles);
    }

    return additionalStats.filter(duplicateProfiles);
  }

  const profiles: Profile[] = roster.warbands
    .flatMap((wb) => [wb.hero, ...wb.units])
    .filter(isDefinedUnit)
    .sort(byHeroicTier)
    .flatMap((unit): Profile[] | undefined => {
      const army = profile_data[unit.profile_origin];
      if (!army) return insertMissingProfile(unit);

      const profile = army[unit.name];
      if (!profile) return insertMissingProfile(unit);

      if (unit.name.includes("&")) {
        return profile.additional_stats.map((stats) => {
          const MWFW = unit.MWFW.find(([hName]) => hName === stats.name);
          const [HM, HW, HF] = MWFW[1].split(":");
          return { ...stats, HM, HW, HF };
        });
      }

      const additional_stats = getAdditionalStats(unit, profile);

      return [
        {
          name: unit.name,
          ...profile,
          ...getMightWillAndFate(unit),
          additional_stats,
        },
      ];
    })
    .filter((v) => !!v)
    .map((profile, index, self) => {
      const firstIndex = self.findIndex((other) => other.name === profile.name);
      if (index === firstIndex) return profile;

      const firstOccurrence = self[firstIndex];
      const combined = [
        ...firstOccurrence.additional_stats,
        ...profile.additional_stats,
      ];
      firstOccurrence.additional_stats = combined.filter(duplicateProfiles);
      return profile;
    })
    .filter(duplicateProfiles);

  return {
    profiles,
    missingProfiles,
  };
};
