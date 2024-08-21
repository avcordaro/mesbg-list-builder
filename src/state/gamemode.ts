import { GameModeHero } from "../components/gamemode/types.ts";
import { Roster } from "../types/roster.ts";

export function getHeroesForGameMode(
  roster: Roster,
): Record<string, GameModeHero[]> {
  const newGameHeroes = {};
  roster.warbands.map((_warband) => {
    const hero = _warband.hero;
    if (hero && hero["MWFW"].length > 0) {
      if (hero["MWFW"].length > 1) {
        newGameHeroes[hero["id"]] = hero["MWFW"].map((x) => ({
          name: x[0],
          profile_origin: hero["profile_origin"],
          MWFW: x[1],
          xMWFW: x[1],
          leader: roster["leader_warband_num"] === _warband["num"],
        }));
      } else {
        newGameHeroes[hero["id"]] = [
          {
            name: hero["MWFW"][0][0] || hero["name"],
            profile_origin: hero["profile_origin"],
            MWFW: hero["MWFW"][0][1],
            xMWFW: hero["MWFW"][0][1],
            leader: roster["leader_warband_num"] === _warband["num"],
          },
        ];
      }
    }
    _warband.units.map((_unit) => {
      if (_unit.name != null && _unit["MWFW"].length > 0) {
        if (_unit["MWFW"].length > 1) {
          newGameHeroes[_unit["id"]] = _unit["MWFW"].map((x) => ({
            name: x[0],
            profile_origin: _unit["profile_origin"],
            MWFW: x[1],
            xMWFW: x[1],
          }));
        } else {
          newGameHeroes[_unit["id"]] = [
            {
              name: _unit["MWFW"][0][0] || _unit["name"],
              profile_origin: _unit["profile_origin"],
              MWFW: _unit["MWFW"][0][1],
              xMWFW: _unit["MWFW"][0][1],
            },
          ];
        }
      }
      return null;
    });
    return null;
  });

  return newGameHeroes;
}
