import React, { useState } from "react";
import Card from "react-bootstrap/Card";
import Stack from "react-bootstrap/Stack";
import Button from "react-bootstrap/Button";
import {
  FaChevronLeft,
  FaChevronRight,
  FaSkullCrossbones,
} from "react-icons/fa";
import { GiQueenCrown } from "react-icons/gi";
import { handleAzogWhiteWarg } from "./specialRules.js";
import { UnitProfilePicture } from "./UnitProfilePicture.tsx";

export function GameModeMWFCounter({
  name,
  gameHeroes,
  setGameHeroes,
  hero_id,
  hero_idx,
  val_idx,
  heroCasualtyCount,
  setHeroCasualtyCount,
}) {
  // eslint-disable-next-line
  const [initialValue, setInitiaValue] = useState(
    parseInt(gameHeroes[hero_id][hero_idx]["MWFW"].split(":")[val_idx]),
  );

  const getValue = () => {
    return parseInt(gameHeroes[hero_id][hero_idx]["xMWFW"].split(":")[val_idx]);
  };

  const handleIncrement = () => {
    if (getValue() !== initialValue) {
      let newGameHeroes = { ...gameHeroes };
      let vals = newGameHeroes[hero_id][hero_idx]["xMWFW"].split(":");
      if (parseInt(vals[val_idx]) === 0 && name === "Wounds") {
        if (
          newGameHeroes[hero_id].length > 1 &&
          (newGameHeroes[hero_id][hero_idx]["name"] === "Azog" ||
            newGameHeroes[hero_id][hero_idx]["name"] === "The White Warg")
        ) {
          setHeroCasualtyCount(
            heroCasualtyCount -
              handleAzogWhiteWarg(newGameHeroes, hero_id, hero_idx),
          );
        } else {
          setHeroCasualtyCount(heroCasualtyCount - 1);
        }
      }
      vals[val_idx] = String(parseInt(vals[val_idx]) + 1);
      newGameHeroes[hero_id][hero_idx]["xMWFW"] = vals.join(":");
      setGameHeroes(newGameHeroes);
    }
  };

  const handleDecrement = () => {
    if (getValue() > 0) {
      let newGameHeroes = { ...gameHeroes };
      let vals = newGameHeroes[hero_id][hero_idx]["xMWFW"].split(":");
      if (parseInt(vals[val_idx]) === 1 && name === "Wounds") {
        if (
          newGameHeroes[hero_id].length > 1 &&
          (newGameHeroes[hero_id][hero_idx]["name"] === "Azog" ||
            newGameHeroes[hero_id][hero_idx]["name"] === "The White Warg")
        ) {
          setHeroCasualtyCount(
            heroCasualtyCount +
              handleAzogWhiteWarg(newGameHeroes, hero_id, hero_idx),
          );
        } else {
          setHeroCasualtyCount(heroCasualtyCount + 1);
        }
      }
      vals[val_idx] = String(parseInt(vals[val_idx]) - 1);
      newGameHeroes[hero_id][hero_idx]["xMWFW"] = vals.join(":");
      setGameHeroes(newGameHeroes);
    }
  };

  return (
    <Stack style={{ alignItems: "center" }}>
      <h6>{name}</h6>
      <Stack direction="horizontal" style={{ alignSelf: "center" }}>
        <Button
          variant="secondary"
          size="sm"
          onClick={handleDecrement}
          disabled={
            parseInt(
              gameHeroes[hero_id][hero_idx]["xMWFW"].split(":")[val_idx],
            ) === 0
          }
        >
          <FaChevronLeft />
        </Button>
        <b
          className={getValue() === 0 ? "text-danger" : ""}
          style={{ width: "35px", textAlign: "center" }}
        >
          {getValue()}
        </b>
        <Button
          variant="secondary"
          size="sm"
          onClick={handleIncrement}
          disabled={
            parseInt(
              gameHeroes[hero_id][hero_idx]["xMWFW"].split(":")[val_idx],
            ) === initialValue
          }
        >
          <FaChevronRight />
        </Button>
      </Stack>
    </Stack>
  );
}

export function GameModeHero({
  gameHeroes,
  setGameHeroes,
  hero_id,
  heroCasualtyCount,
  setHeroCasualtyCount,
}) {
  return (
    <>
      {gameHeroes[hero_id].map((hero, index) => (
        <Card style={{ width: "700px" }} className="m-2 pe-4" bg={"light"}>
          <Stack direction="horizontal" gap={3} style={{ alignItems: "start" }}>
            <UnitProfilePicture
              army={hero.profile_origin}
              profile={hero.name}
              className={
                hero["xMWFW"].split(":")[3] === "0"
                  ? "opacity-50 profile m-2"
                  : "profile m-2"
              }
            />
            <Stack gap={2}>
              <Stack
                direction="horizontal"
                style={{ minHeight: "26px" }}
                gap={3}
              >
                <p
                  className={
                    hero["xMWFW"].split(":")[3] === "0"
                      ? "text-muted text-decoration-line-through m-0 mt-2"
                      : "m-0 mt-2"
                  }
                >
                  <b>{hero.name}</b>
                  {hero["xMWFW"].split(":")[3] === "0" && (
                    <FaSkullCrossbones className="ms-2" />
                  )}
                </p>
                {hero.name === "The White Warg" && (
                  <h6
                    className="text-muted m-0 mt-2 ms-auto"
                    style={{ width: "350px" }}
                  >
                    (Both Azog and The White Warg must reach zero wounds to
                    count as a single casualty)
                  </h6>
                )}
                {hero["leader"] && (
                  <h6 className="m-0 ms-auto mt-2 text-success">
                    <GiQueenCrown /> Leader
                  </h6>
                )}
              </Stack>
              <Stack className="my-2" direction="horizontal" gap={3}>
                <GameModeMWFCounter
                  name="Might"
                  gameHeroes={gameHeroes}
                  setGameHeroes={setGameHeroes}
                  hero_id={hero_id}
                  hero_idx={index}
                  val_idx={0}
                  heroCasualtyCount={heroCasualtyCount}
                  setHeroCasualtyCount={setHeroCasualtyCount}
                />
                <GameModeMWFCounter
                  name="Will"
                  gameHeroes={gameHeroes}
                  setGameHeroes={setGameHeroes}
                  hero_id={hero_id}
                  hero_idx={index}
                  val_idx={1}
                  heroCasualtyCount={heroCasualtyCount}
                  setHeroCasualtyCount={setHeroCasualtyCount}
                />
                <GameModeMWFCounter
                  name="Fate"
                  gameHeroes={gameHeroes}
                  setGameHeroes={setGameHeroes}
                  hero_id={hero_id}
                  hero_idx={index}
                  val_idx={2}
                  heroCasualtyCount={heroCasualtyCount}
                  setHeroCasualtyCount={setHeroCasualtyCount}
                />
                <GameModeMWFCounter
                  name="Wounds"
                  gameHeroes={gameHeroes}
                  setGameHeroes={setGameHeroes}
                  hero_id={hero_id}
                  hero_idx={index}
                  val_idx={3}
                  heroCasualtyCount={heroCasualtyCount}
                  setHeroCasualtyCount={setHeroCasualtyCount}
                />
              </Stack>
            </Stack>
          </Stack>
        </Card>
      ))}
    </>
  );
}
