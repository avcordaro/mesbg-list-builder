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