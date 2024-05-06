import React, {useEffect, useState} from "react";
import {GameModeInfo} from "./GameModeInfo";
import {GameModeHero} from "./GameModeHero";
import {TbRefresh} from "react-icons/tb";
import Button from "react-bootstrap/Button";
import Stack from "react-bootstrap/Stack";
import {FaChevronLeft, FaChevronRight, FaSkullCrossbones} from "react-icons/fa";
import {GiCrackedShield} from "react-icons/gi";
import hero_constraint_data from "../data/hero_constraint_data.json";

export function GameModeCasualties ({roster, casualtyCount, setCasualtyCount, heroCasualtyCount, gameHeroes}) {

  const handleIncrement = () => {
    setCasualtyCount(casualtyCount + 1);
  }

  const handleDecrement = () => {
    if (casualtyCount > 0) {
      setCasualtyCount(casualtyCount - 1);
    }
  }

  return (
    <Stack direction="horizontal" gap={3} className="ms-3">
      <Stack direction="horizontal">
        <h5 className="m-0">Casualties: </h5>
        <Button className="ms-2" variant="secondary" size="sm" onClick={handleDecrement} disabled={casualtyCount === 0}><FaChevronLeft /></Button>
        <h5 className="m-0" style={{width: "40px", textAlign: "center"}}><b>{casualtyCount + heroCasualtyCount}</b></h5>
        <Button variant="secondary" size="sm" onClick={handleIncrement} disabled={casualtyCount >= (roster.num_units - Object.values(gameHeroes).reduce((val, x) => val + x.length, 0))}><FaChevronRight /></Button>
      </Stack>
      {(Math.floor(0.5 * roster.num_units) + 1 - (casualtyCount + heroCasualtyCount)) <= 0 ?
        <h5 className="m-0 ms-5 text-danger">You are Broken <GiCrackedShield /></h5>
        :
        <h5 className="m-0 ms-5">Until Broken: <b>{Math.max(Math.floor(0.5 * roster.num_units) + 1 - (casualtyCount + heroCasualtyCount), 0)}</b></h5>
      }
      {(Math.ceil(0.75 * roster.num_units) - (casualtyCount + heroCasualtyCount)) <= 0 ?
        <h5 className="m-0 text-danger">You are Defeated <FaSkullCrossbones /></h5>
        :
        <h5 className="m-0">Until Defeated: <b>{Math.max(Math.ceil(0.75 * roster.num_units) - (casualtyCount + heroCasualtyCount), 0)}</b></h5>
      }
    </Stack>
  );
}

export function GameModeProfiles ({roster}) {

  const getProfileCards = () => {
    let profileCards = [];
    roster.warbands.map((_warband) => {
      if (_warband.hero) {
        profileCards.push([_warband.hero.profile_origin, _warband.hero.name].join("|"));
        if (_warband.hero.unit_type !== "Siege Engine" && hero_constraint_data[_warband.hero.model_id][0]["extra_profiles"].length > 0) {
          hero_constraint_data[_warband.hero.model_id][0]["extra_profiles"].map((_profile) => {
            profileCards.push([_warband.hero.profile_origin, _profile].join("|"));
            return null;
          });
        }
      }
      _warband.units.map((_unit) => {
        if (_unit.name != null) {
          profileCards.push([_unit.profile_origin, _unit.name].join("|"));
        }
        return null;
      });
      return null;
    });
    let profileCardsSet = new Set(profileCards)
    return [...profileCardsSet];
  }

  return (
    <div>
      {getProfileCards().map((card) => (
        <img
          className="profile_card border border-secondary my-3 shadow"
          src={(() => {
            try {
              return require("../images/" + card.split("|")[0] + "/cards/" + card.split("|")[1] + ".jpg");
            } catch (e) {
              return require("../images/default_card.jpg");
            }
          })()}
          alt=""
        />
      ))}
    </div>
  );
}

export function GameMode({roster, factionList, allianceLevel, allianceColours}) {

  const [gameHeroes, setGameHeroes] = useState({});
  const [casualtyCount, setCasualtyCount] = useState(0);
  const [heroCasualtyCount, setHeroCasualtyCount] = useState(0);

  useEffect(() => {
    handleReset();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleReset = () => {
    let newGameHeroes = {}
    roster.warbands.map((_warband) => {
      let hero = _warband.hero
      if (hero && hero['MWFW'].length > 0) {
        if (hero['MWFW'].length > 1) {
          newGameHeroes[hero['id']] = hero['MWFW'].map((x) => (
            {
              "name": x[0],
              "profile_origin": hero['profile_origin'],
              "MWFW": x[1],
              "xMWFW": x[1]
            }
          ));
        } else {
          newGameHeroes[hero['id']] = [{
            "name": hero['MWFW'][0][0] || hero['name'],
            "profile_origin": hero['profile_origin'],
            "MWFW": hero['MWFW'][0][1],
            "xMWFW": hero['MWFW'][0][1]
          }]
        }
      }
      _warband.units.map((_unit) => {
        if (_unit.name != null && _unit['MWFW'].length > 0) {
          if (_unit['MWFW'].length > 1) {
            newGameHeroes[_unit['id']] = _unit['MWFW'].map((x) => (
              {
                "name": x[0],
                "profile_origin": _unit['profile_origin'],
                "MWFW": x[1],
                "xMWFW": x[1]
              }
            ));
          } else {
            newGameHeroes[_unit['id']] = [{
              "name": _unit['MWFW'][0][0] || _unit['name'],
              "profile_origin": _unit['profile_origin'],
              "MWFW": _unit['MWFW'][0][1],
              "xMWFW": _unit['MWFW'][0][1]
            }]
          }
        }
        return null
      });
      return null
    });
    setGameHeroes(newGameHeroes);
    setCasualtyCount(0);
    setHeroCasualtyCount(0);
  }

  return (
    <div>
      <GameModeInfo
        factionList={factionList}
        allianceLevel={allianceLevel}
        allianceColours={allianceColours}
        roster={roster}
        casualtyCount={casualtyCount}
        heroCasualtyCount={heroCasualtyCount}
      />
      <div style={{marginLeft: "535px", minWidth: "720px"}}>
        <Stack direction="horizontal" style={{minWidth: "800px"}}>
          <Button className="m-2" onClick={handleReset}><TbRefresh/> Reset All</Button>
          <GameModeCasualties roster={roster} casualtyCount={casualtyCount}
                              setCasualtyCount={setCasualtyCount}
                              heroCasualtyCount={heroCasualtyCount} gameHeroes={gameHeroes}/>
        </Stack>
        <h6 className="m-0 ms-2 mt-3 text-muted">Note: Heroes will be automatically added as a
          casualty when they reach zero wounds below.</h6>
        <hr className="mb-5" style={{width: "720px"}}/>
        {Object.keys(gameHeroes).map((hero_id) => (
          <GameModeHero gameHeroes={gameHeroes} setGameHeroes={setGameHeroes} hero_id={hero_id}
                        heroCasualtyCount={heroCasualtyCount}
                        setHeroCasualtyCount={setHeroCasualtyCount}/>
        ))}
        <hr className="mt-5 mb-3" style={{width: "720px"}}/>
        <GameModeProfiles roster={roster}/>
      </div>
    </div>
  );
}
