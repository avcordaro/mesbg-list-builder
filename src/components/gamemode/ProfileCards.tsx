import { Fragment } from "react";
import hero_constraint_data from "../../assets/data/hero_constraint_data.json";
import { useStore } from "../../state/store.ts";
import { Unit } from "../../types/unit.ts";
import { UnitProfileCard } from "../images/UnitProfileCard.tsx";

export const ProfileCards = () => {
  const roster = useStore((store) => store.roster);

  const getExtraProfilesForHero = (hero: Unit) => {
    if (hero.unit_type === "Siege Engine") {
      return [];
    }
    const extraProfiles =
      hero_constraint_data[hero.model_id][0]["extra_profiles"];
    return extraProfiles.map((profile) => ({
      profile,
      army: hero.profile_origin,
    }));
  };

  const allProfiles: { profile: string; army: string }[] =
    roster.warbands.flatMap(({ hero, units }) => {
      if (!hero) return [];
      const heroProfile = { profile: hero.name, army: hero.profile_origin };
      const extraProfiles = getExtraProfilesForHero(hero);
      const unitProfiles = units
        .filter((unit) => !unit.name || unit.unit_type !== "Siege")
        .map((unit) => ({ profile: unit.name, army: unit.profile_origin }));

      return [heroProfile, ...extraProfiles, ...unitProfiles];
    });

  const uniqueProfiles = allProfiles.filter(
    (item, index, self) =>
      index === self.findIndex((t) => t.profile === item.profile),
  );

  return uniqueProfiles.map(({ profile, army }) => (
    <Fragment key={profile}>
      <UnitProfileCard
        className="profile_card border border-secondary my-3 shadow"
        profile={profile}
        army={army}
      />
    </Fragment>
  ));
};
