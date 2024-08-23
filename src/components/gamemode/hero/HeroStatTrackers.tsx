import { FunctionComponent } from "react";
import Card from "react-bootstrap/Card";
import Stack from "react-bootstrap/Stack";
import { FaSkullCrossbones } from "react-icons/fa";
import { GiQueenCrown } from "react-icons/gi";
import { useStore } from "../../../state/store";
import { UnitProfilePicture } from "../../images/UnitProfilePicture.tsx";
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
  <Stack className="my-2" direction="horizontal" gap={3}>
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
  <Stack direction="horizontal" style={{ minHeight: "26px" }} gap={3}>
    {alive ? (
      <p className="m-0 mt-2">
        <b>{hero.name}</b>
      </p>
    ) : (
      <p className="text-muted text-decoration-line-through m-0 mt-2">
        <b>{hero.name}</b>
        <FaSkullCrossbones className="ms-2" />
      </p>
    )}

    {hero.name === "The White Warg" && (
      <h6 className="text-muted m-0 mt-2 ms-auto" style={{ width: "350px" }}>
        (Both Azog and The White Warg must reach zero wounds to count as a
        single casualty)
      </h6>
    )}

    {hero["leader"] && (
      <h6 className="m-0 ms-auto mt-2 text-success">
        <GiQueenCrown /> Leader
      </h6>
    )}
  </Stack>
);

export const HeroStatTrackers = () => {
  const { gameState } = useStore();

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
              style={{ width: "700px" }}
              className="m-2 pe-4"
              bg="light"
              key={`${heroId}_${hero.name}`}
            >
              <Stack
                direction="horizontal"
                gap={3}
                style={{ alignItems: "start" }}
              >
                <UnitProfilePicture
                  army={hero.profile_origin}
                  profile={hero.name}
                  className={alive ? "profile m-2" : "opacity-50 profile m-2"}
                />
                <Stack gap={2}>
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
