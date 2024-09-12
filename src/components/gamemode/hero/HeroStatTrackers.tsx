import Box from "@mui/material/Box";
import Card from "@mui/material/Card";
import Stack from "@mui/material/Stack";
import Typography from "@mui/material/Typography";
import { useTheme } from "@mui/material/styles";
import { FunctionComponent } from "react";
import { FaSkullCrossbones } from "react-icons/fa";
import { GiQueenCrown } from "react-icons/gi";
import { useStore } from "../../../state/store";
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
}) => (
  <Stack direction="row" justifyContent="space-around">
    <HeroStatTracker name="Might" hero_id={hero_id} hero_idx={hero_idx} />
    <HeroStatTracker name="Will" hero_id={hero_id} hero_idx={hero_idx} />
    <HeroStatTracker name="Fate" hero_id={hero_id} hero_idx={hero_idx} />
    <HeroStatTracker name="Wounds" hero_id={hero_id} hero_idx={hero_idx} />
  </Stack>
);

type HeroNameProps = {
  hero: GameModeHero;
  alive: boolean;
};

const HeroName: FunctionComponent<HeroNameProps> = ({ hero, alive }) => (
  <Stack direction="row" spacing={3}>
    {alive ? (
      <Typography variant="h6" flexGrow={1}>
        <b>{hero.name}</b>
      </Typography>
    ) : (
      <Typography variant="h6" color="textDisabled" flexGrow={1}>
        <s>
          <b>{hero.name}</b>
        </s>
        <Box component="span" sx={{ ml: 1 }}>
          <FaSkullCrossbones />
        </Box>
      </Typography>
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

    {hero.leader && (
      <Typography color="success">
        <GiQueenCrown /> Leader
      </Typography>
    )}
  </Stack>
);

export const HeroStatTrackers = () => {
  const { gameState } = useStore();
  const { palette } = useTheme();

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
        .map(({ heroId, hero, index }) => {
          const alive = hero["xMWFW"].split(":")[3] !== "0";
          return (
            <Card
              key={`${heroId}_${hero.name}`}
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
                <UnitProfilePicture
                  army={hero.profile_origin}
                  profile={hero.name}
                  opacity={alive ? 100 : 25}
                />
                <Stack spacing={1} flexGrow={1}>
                  <HeroName hero={hero} alive={alive} />
                  <HeroStats hero_id={heroId} hero_idx={index} />
                </Stack>
              </Stack>
            </Card>
          );
        })}
    </>
  );
};
