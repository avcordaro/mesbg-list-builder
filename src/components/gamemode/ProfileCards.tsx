import { Button, ImageList, ImageListItem } from "@mui/material";
import { useTheme } from "@mui/material/styles";
import useMediaQuery from "@mui/material/useMediaQuery";
import { useState } from "react";
import hero_constraint_data from "../../assets/data/hero_constraint_data.json";
import { useStore } from "../../state/store.ts";
import { isDefinedUnit, Unit } from "../../types/unit.ts";
import { UnitProfileCard } from "../common/images/UnitProfileCard.tsx";

export const ProfileCards = () => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("lg"));
  const roster = useStore((store) => store.roster);
  const [showProfileCards, setShowProfileCards] = useState(false);
  const [bigCard, setBigCard] = useState(null);

  const getExtraProfilesForHero = (hero: Unit) => {
    if (!isDefinedUnit(hero)) return [];

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
      if (!isDefinedUnit(hero)) return [];
      const heroProfile = { profile: hero.name, army: hero.profile_origin };
      const extraProfiles = getExtraProfilesForHero(hero);
      const unitProfiles = units
        .filter((unit) => !isDefinedUnit(unit) || unit.unit_type !== "Siege")
        .map((unit: Unit) => ({
          profile: unit.name,
          army: unit.profile_origin,
        }));

      return [heroProfile, ...extraProfiles, ...unitProfiles];
    });

  const uniqueProfiles = allProfiles.filter(
    (item, index, self) =>
      index === self.findIndex((t) => t.profile === item.profile),
  );

  return (
    <>
      {!showProfileCards ? (
        <>
          <Button
            variant="contained"
            color="inherit"
            onClick={() => setShowProfileCards(true)}
            sx={{
              m: "0 0.5rem 2rem",
            }}
          >
            Show all profile cards
          </Button>
        </>
      ) : (
        <ImageList cols={isMobile ? 1 : 2}>
          {uniqueProfiles.map(({ profile, army }) => (
            <ImageListItem
              key={profile}
              cols={isMobile ? 1 : bigCard === profile ? 2 : 1}
              onClick={() => {
                setBigCard((prev: string) =>
                  prev !== profile ? profile : null,
                );
              }}
            >
              <UnitProfileCard profile={profile} army={army} />
            </ImageListItem>
          ))}
        </ImageList>
      )}
    </>
  );
};
