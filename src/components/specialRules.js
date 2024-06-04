import hero_constraint_data from "../data/hero_constraint_data.json";

/* Specific functionality to support special rules or certain units, factions or option types. */

export const handleMirkwoodRangers = (roster, alliance_level) => {
  // Specific logic for Mirkwood Rangers and counting towards bow limit, depending on if the alliance level is Historical or not.
  let newRoster = {...roster};
  newRoster.warbands = newRoster.warbands.map((warband) => {
    let newWarband = {...warband};
    newWarband.units = newWarband.units.map((_unit) => {
      let newUnit = {..._unit};
      if (newUnit.model_id === "[halls_of_thranduil] mirkwood_ranger") {
        newUnit["inc_bow_count"] = alliance_level !== "Historical";
        newUnit["bow_limit"] = alliance_level !== "Historical";
      }
      return newUnit;
    });
    return newWarband;
  });
  return newRoster;
};

export const handleKhandishHorsemanCharioteers = (roster, alliance_level) => {
  // Specific logic for Khandish Horseman/Charioteers and counting towards bow limit, depending on if the alliance level is Historical or not.
  let newRoster = {...roster};
  newRoster.warbands = newRoster.warbands.map((warband) => {
    let newWarband = {...warband};
    newWarband.units = newWarband.units.map((_unit) => {
      let newUnit = {..._unit};
      if (newUnit.model_id === "[variags_of_khand] khandish_charioteer" || newUnit.model_id === "[variags_of_khand] khandish_horseman") {
        newUnit["inc_bow_count"] = alliance_level !== "Historical";
        newUnit["bow_limit"] = alliance_level !== "Historical";
      }
      return newUnit;
    });
    return newWarband;
  });
  return newRoster;
};

export const handleMasterLaketown = (roster, alliance_level) => {
  // Specific logic for Master of Lake-town's heroic tier, depending on if the alliance level is Historical or not.
  let newRoster = {...roster};
  newRoster.warbands = newRoster.warbands.map((warband) => {
    let newWarband = {...warband};
    if (newWarband.hero && newWarband.hero.model_id === "[army_of_lake-town] master_of_lake-town") {
      let newHero = newWarband.hero;
      newHero.warband_size = alliance_level === "Historical" ? 15 : 12;
      newHero.unit_type = alliance_level === "Historical" ? "Hero of Valour" : "Hero of Fortitude";
      newWarband.max_units = alliance_level === "Historical" ? 15 : 12;
      newWarband.hero = newHero;
    }
    return newWarband;
  });
  return newRoster;
};

export const handleGoblinTown = (roster, alliance_level) => {
  // Specific logic for Goblin-town warband sizes, depending on if the alliance level is Historical or not.
  let sizes = {
    "Hero of Legend": 18, "Hero of Valour": 15, "Hero of Fortitude": 12, "Minor Hero": 6,
  };

  let newRoster = {...roster};
  newRoster.warbands = newRoster.warbands.map((warband) => {
    let newWarband = {...warband};
    if (newWarband.hero && newWarband.hero.faction === "Goblin-town") {
      let newHero = newWarband.hero;
      newHero.warband_size = alliance_level === "Historical" ? sizes[newHero.unit_type] + 6 : sizes[newHero.unit_type];
      newWarband.max_units = alliance_level === "Historical" ? sizes[newHero.unit_type] + 6 : sizes[newHero.unit_type];
      newWarband.hero = newHero;
    }
    return newWarband;
  });
  return newRoster;
};

export const handleBillCampfire = (roster, alliance_level) => {
  // Specific logic for Bill the Troll's campfire cost, depending on if the alliance level is Historical or not.
  let newRoster = {...roster};
  newRoster.warbands = newRoster.warbands.map((warband) => {
    let newWarband = {...warband};
    let newHero = {...newWarband.hero};
    if (newHero.model_id === "[the_trolls] bill_the_troll") {
      newHero.options = newHero.options.map((_option) => {
        let newOption = {..._option};
        if (newOption.option === "Campfire") {
          if (newOption.opt_quantity === 1) {
            newRoster["points"] = newRoster["points"] - newHero["pointsTotal"];
            newWarband["points"] = newWarband["points"] - newHero["pointsTotal"];
            newHero["pointsPerUnit"] = newHero["pointsPerUnit"] - newOption["points"];
            newOption["points"] = alliance_level === "Historical" ? 0 : 15;
            newHero["pointsPerUnit"] = newHero["pointsPerUnit"] + newOption["points"];
            newHero["pointsTotal"] = newHero["pointsPerUnit"];
            newWarband["points"] = newWarband["points"] + newHero["pointsTotal"];
            newRoster["points"] = newRoster["points"] + newHero["pointsTotal"];
          } else {
            newOption["points"] = alliance_level === "Historical" ? 0 : 15;
          }
        }
        return newOption;
      });
      newWarband.hero = newHero;
    }
    return newWarband;
  });
  return newRoster;
};

export const handleRivendellElrond = (newRoster, elrondRemoved) => {
  // If Elrond is selected for Rivendell, all Rivendell Knights in the army no longer count towards the Bow Limit.
  newRoster.warbands = newRoster.warbands.map((warband) => {
    let newWarband = {...warband};
    newWarband.units = newWarband.units.map((_unit) => {
      let newUnit = {..._unit};
      if (newUnit.model_id === '[rivendell] rivendell_knight') {
        if (elrondRemoved) {
          newWarband["bow_count"] = newWarband["bow_count"] + (1 * newUnit["quantity"]);
          newRoster["bow_count"] = newRoster["bow_count"] + (1 * newUnit["quantity"]);
          newUnit["inc_bow_count"] = true;
          newUnit["bow_limit"] = true;
        } else {
          newWarband["bow_count"] = newWarband["bow_count"] - (1 * newUnit["quantity"]);
          newRoster["bow_count"] = newRoster["bow_count"] - (1 * newUnit["quantity"]);
          newUnit["inc_bow_count"] = false;
          newUnit["bow_limit"] = false;
        }
      }
      return newUnit;
    });
    return newWarband;
  });
  return newRoster
};

export const handleSpecialArmyOption = (newRoster, warbandNum) => {
  /* If a Hero is removed that provided a special army option, that option much be turned off for all eligible units
  in the current army roster, and points updated. */
  let specialArmyOption = hero_constraint_data[newRoster.warbands[warbandNum - 1].hero.model_id][0]['special_army_option'];
  newRoster.warbands = newRoster.warbands.map((warband) => {
    let newWarband = {...warband};
    newWarband.units = newWarband.units.map((_unit) => {
      let newUnit = {..._unit};
      if (newUnit.name != null) {
        newUnit.options = newUnit.options.map((_option) => {
          let newOption = {..._option};
          if (newOption.type === "special_army_upgrade" && newOption.opt_quantity === 1 && newOption.option === specialArmyOption) {
            newRoster['points'] = newRoster['points'] - newUnit['pointsTotal']
            newWarband['points'] = newWarband['points'] - newUnit['pointsTotal'];
            newUnit['pointsPerUnit'] = newUnit['pointsPerUnit'] - newOption.points
            newUnit['pointsTotal'] = newUnit['pointsPerUnit'] * newUnit['quantity']
            newWarband['points'] = newWarband['points'] + newUnit['pointsTotal'];
            newRoster['points'] = newRoster['points'] + newUnit['pointsTotal']
            newOption['opt_quantity'] = 0
          }
          return newOption
        })
      }
      return newUnit
    })
    return newWarband;
  })
  return newRoster;
};

export const handleSpecialWarbandOption = (newRoster, warbandNum) => {
  /* If a Hero is removed that provided a special warband option, that option much be turned off for all eligible units
  in the current army roster, and points updated. */
  newRoster.warbands = newRoster.warbands.map((warband) => {
    let newWarband = {...warband};
    if (newWarband['num'] === warbandNum) {
      newWarband.units = newWarband.units.map((_unit) => {
        let newUnit = {..._unit};
        if (newUnit.name != null) {
          newUnit.options = newUnit.options.map((_option) => {
            let newOption = {..._option};
            if (newOption.type === "special_warband_upgrade" && newOption.opt_quantity === 1) {
              newRoster['points'] = newRoster['points'] - newUnit['pointsTotal']
              newWarband['points'] = newWarband['points'] - newUnit['pointsTotal'];
              newUnit['pointsPerUnit'] = newUnit['pointsPerUnit'] - newOption.points
              newUnit['pointsTotal'] = newUnit['pointsPerUnit'] * newUnit['quantity']
              newWarband['points'] = newWarband['points'] + newUnit['pointsTotal'];
              newRoster['points'] = newRoster['points'] + newUnit['pointsTotal']
              newOption['opt_quantity'] = 0
            }
            return newOption
          })
        }
        return newUnit
      })
    }
    return newWarband;
  })
  return newRoster;
};

export const handle50PctBowLimit = (faction_data, alliance_level) => {
  /* If a Hero is removed that provided a special warband option, that option much be turned off for all eligible units
  in the current army roster, and points updated. */
    let new_faction_data = {...faction_data};
    new_faction_data["The Serpent Horde"].bow_limit = alliance_level === "Historical" ? 0.5 : 0.33;
    new_faction_data["Azog's Hunters"].bow_limit = alliance_level === "Historical" ? 0.5 : 0.33;
    return new_faction_data;
};

export const checkSiegeEngineCounts = (siegeEngines, heroicTiers, _warnings) => {
  Object.keys(heroicTiers).map((faction) => {
    if (siegeEngines[faction] > 0) {
      let heroForts = heroicTiers[faction].reduce((n, v) => (["Hero of Fortitude", "Hero of Valour", "Hero of Legend"].includes(v) ? n + 1 : n), 0);
      if (siegeEngines[faction] > heroForts) {
        _warnings.push(`Too many Siege Engines for ${faction}. An army, or allied contingent, may only include one Siege Engine for each Hero with a Heroic Tier of Hero of Fortitude or above that is taken from the same Army List as the Siege Engine. (Changes from Official Errata/FAQs)`)
      }
    }
    return null
  })
  return _warnings
}

export const checkAlliedHeroes = (_allianceLevel, heroicTiers, _warnings) => {
  if (Object.keys(heroicTiers).length > 1) {
    Object.keys(heroicTiers).map((faction) => {
      if (faction.includes("Wanderers in the Wild")) {
        return null
      }
      if (_allianceLevel === "Historical") {
        let heroForts = heroicTiers[faction].reduce((n, v) => (["Hero of Fortitude", "Hero of Valour", "Hero of Legend"].includes(v) ? n + 1 : n), 0);
        if (heroForts === 0) {
          _warnings.push(`${faction} - For a Historical Alliance, each allied force must contain at least one Hero with a Heroic Tier of Hero of Fortitude or higher. (Changes from Official Errata/FAQs).`)
        }
      } else {
        let heroValours = heroicTiers[faction].reduce((n, v) => (["Hero of Valour", "Hero of Legend"].includes(v) ? n + 1 : n), 0);
        if (heroValours === 0) {
          _warnings.push(`${faction} - For a Convenient Alliance, or an alliance containing Impossible Allies, each allied force must contain at least one Hero with a Heroic Tier of Hero of Valour or higher. (Changes from Official Errata/FAQs).`)
        }
      }
      return null
    })
  }
  return _warnings
}

export const checkDunharrow = (_allianceLevel, _uniqueModels, _warnings) => {
  let intersection = ["[minas_tirith] aragorn,_king_elessar", "[the_fellowship] aragorn,_strider", "[the_rangers] aragorn,_strider"].filter(x => _uniqueModels.includes(x));
  let msg = "A Dead of Dunharrow army list is automatically Impossible Allies with any force that doesn't also include Aragorn.";
  if (_allianceLevel !== "Impossible" && intersection.length === 0) {
    _warnings.push(msg)
    return ["Impossible", _warnings]
  }
  return [_allianceLevel, _warnings]
}

export const checkGilGalad = (_allianceLevel, faction_list) => {
  if (_allianceLevel === "Impossible") {
    return _allianceLevel
  }
  const allies = {
    "Rivendell": "Historical",
    "Numenor": "Historical",
    "Lothlorien": "Convenient",
    "Fangorn": "Convenient",
    "The Misty Mountains": "Convenient"
  }
  let levels = faction_list.map((f) => allies[f] ? allies[f] : "Impossible")
  if (levels.includes("Impossible")) {
    return "Impossible"
  } else if (levels.includes("Convenient")) {
    return "Convenient"
  }
  return "Historical"
}

export const handleAzogWhiteWarg = (newGameHeroes, hero_id, hero_idx) => {
  let mapping = {0: "Azog", 1: "The White Warg"}
  let azogWounds = newGameHeroes[hero_id][0]['xMWFW'].split(":")[3]
  let wargWounds = newGameHeroes[hero_id][1]['xMWFW'].split(":")[3]
  if (mapping[hero_idx] == "Azog" && wargWounds === "0") {
    return 1
  }
  if (mapping[hero_idx] == "The White Warg" && azogWounds === "0") {
    return 1
  }
  return 0
}