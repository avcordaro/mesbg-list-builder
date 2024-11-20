import Box from "@mui/material/Box";
import Card from "@mui/material/Card";
import Stack from "@mui/material/Stack";
import Typography from "@mui/material/Typography";
import { useTheme } from "@mui/material/styles";
import useMediaQuery from "@mui/material/useMediaQuery";
import { FunctionComponent } from "react";
import { FaSkullCrossbones } from "react-icons/fa";
import { GiQueenCrown } from "react-icons/gi";
import { useGameModeState } from "../../../state/gamemode";
import { UnitProfilePicture } from "../../common/images/UnitProfilePicture.tsx";
import { GameModeHero } from "../types";
import { HeroStatTracker } from "./HeroStatTracker";

type HeroStatsProps = {
  hero_id: string;
  hero_idx: number;
};

const HeroStats: FunctionComponent<HeroStatsProps> = ({
  hero_id,
  hero_idx,
}) => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));

  return (
    <Stack
      direction={isMobile ? "column" : "row"}
      justifyContent="space-around"
    >
      <HeroStatTracker name="Might" hero_id={hero_id} hero_idx={hero_idx} />
      <HeroStatTracker name="Will" hero_id={hero_id} hero_idx={hero_idx} />
      <HeroStatTracker name="Fate" hero_id={hero_id} hero_idx={hero_idx} />
      <HeroStatTracker name="Wounds" hero_id={hero_id} hero_idx={hero_idx} />
    </Stack>
  );
};

type HeroNameProps = {
  hero: GameModeHero;
  alive: boolean;
  index?: number;
};

const HeroName: FunctionComponent<HeroNameProps> = ({ hero, alive, index }) => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));
  return (
    <Stack
      direction={isMobile ? "column" : "row"}
      spacing={3}
      alignItems="center"
    >
      {alive ? (
        <Typography variant="h6" flexGrow={1}>
          <b>{hero.name}</b> {!!index && <>( {index} )</>}
          {hero.leader && (
            <Typography component="span" color="success" sx={{ mx: 1 }}>
              <GiQueenCrown />
            </Typography>
          )}
        </Typography>
      ) : (
        <Typography variant="h6" color="textDisabled" flexGrow={1}>
          <s>
            <b>{hero.name}</b> {!!index && <>( {index} )</>}
          </s>
          {hero.leader && (
            <Typography component="span" color="success" sx={{ mx: 1 }}>
              <GiQueenCrown />
            </Typography>
          )}
          <Box component="span" sx={{ ml: 1 }}>
            <FaSkullCrossbones />
          </Box>
        </Typography>
      )}

      {isMobile && (
        <UnitProfilePicture
          army={hero.profile_origin}
          profile={hero.name}
          opacity={alive ? 100 : 25}
        />
      )}

      {hero.name === "The White Warg" && (
        <Typography
          variant="caption"
          color="textSecondary"
          sx={{ width: "44ch" }}
          textAlign="center"
        >
          (Both Azog and The White Warg must reach zero wounds to count as a
          single casualty)
        </Typography>
      )}

      {["Shadowfax", "Elk", "War Boar"].includes(hero.name) && (
        <Typography
          variant="caption"
          color="textSecondary"
          sx={{ width: "44ch" }}
          textAlign="center"
        >
          (Does not count towards your casualties)
        </Typography>
      )}
    </Stack>
  );
};

export const HeroStatTrackers = () => {
  const { gameState } = useGameModeState();
  const { palette, breakpoints } = useTheme();
  const isMobile = useMediaQuery(breakpoints.down("sm"));

  return (
    <>
      {Object.entries(gameState.heroes)
        .flatMap(([heroId, heroes]) =>
          heroes.map((hero, index) => ({
            heroId,
            hero,
            index,
          })),
        )
        .map(({ heroId, hero, index }, _, self) => {
          const alive = hero["xMWFW"].split(":")[3] !== "0";
          return (
            <Card
              key={`${heroId}_${hero.name}_${index}`}
              elevation={4}
              sx={{
                p: 1,
                border: 1,
                borderColor: palette.grey.A400,
                m: 1,
              }}
            >
              <Stack
                direction="row"
                spacing={2}
                alignItems="center"
                justifyContent="start"
              >
                {!isMobile && (
                  <UnitProfilePicture
                    army={hero.profile_origin}
                    profile={hero.name}
                    opacity={alive ? 100 : 25}
                  />
                )}
                <Stack spacing={1} flexGrow={1}>
                  <HeroName
                    hero={hero}
                    alive={alive}
                    index={
                      hero.name === "Azog's Lieutenant"
                        ? index -
                          self.findIndex((h) => h.hero.name === hero.name) +
                          1
                        : null
                    }
                  />
                  <HeroStats hero_id={heroId} hero_idx={index} />
                </Stack>
              </Stack>
            </Card>
          );
        })}
    </>
  );
};
