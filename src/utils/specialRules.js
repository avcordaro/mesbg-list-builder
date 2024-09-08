/* Specific functionality to support special rules or certain units, factions or option types. */

export const handleMirkwoodRangers = (roster, alliance_level) => {
  // Specific logic for Mirkwood Rangers and counting towards bow limit, depending on if the alliance level is Historical or not.
  let newRoster = { ...roster };
  newRoster.warbands = newRoster.warbands.map((warband) => {
    let newWarband = { ...warband };
    newWarband.units = newWarband.units.map((_unit) => {
      let newUnit = { ..._unit };
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

export const handleRivendellKnights = (newRoster, uniqueModels) => {
  // If Elrond is selected for Rivendell, all Rivendell Knights in the army no longer count towards the Bow Limit.
  const includesElrond = uniqueModels.includes("[rivendell] elrond");
  newRoster.warbands = newRoster.warbands.map((warband) => {
    let newWarband = { ...warband };
    newWarband.units = newWarband.units.map((_unit) => {
      let newUnit = { ..._unit };
      if (newUnit.model_id === "[rivendell] rivendell_knight") {
        newUnit["inc_bow_count"] = !includesElrond;
        newUnit["bow_limit"] = !includesElrond;
      }
      return newUnit;
    });
    return newWarband;
  });
  return newRoster;
};

export const handleKhandishHorsemanCharioteers = (roster, alliance_level) => {
  // Specific logic for Khandish Horseman/Charioteers and counting towards bow limit, depending on if the alliance level is Historical or not.
  let newRoster = { ...roster };
  newRoster.warbands = newRoster.warbands.map((warband) => {
    let newWarband = { ...warband };
    newWarband.units = newWarband.units.map((_unit) => {
      let newUnit = { ..._unit };
      if (
        newUnit.model_id === "[variags_of_khand] khandish_charioteer" ||
        newUnit.model_id === "[variags_of_khand] khandish_horseman"
      ) {
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
  let newRoster = { ...roster };
  newRoster.warbands = newRoster.warbands.map((warband) => {
    let newWarband = { ...warband };
    if (
      newWarband.hero &&
      newWarband.hero.model_id === "[army_of_lake-town] master_of_lake-town"
    ) {
      let newHero = newWarband.hero;
      newHero.warband_size = alliance_level === "Historical" ? 15 : 12;
      newHero.unit_type =
        alliance_level === "Historical"
          ? "Hero of Valour"
          : "Hero of Fortitude";
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
    "Hero of Legend": 18,
    "Hero of Valour": 15,
    "Hero of Fortitude": 12,
    "Minor Hero": 6,
  };

  let newRoster = { ...roster };
  newRoster.warbands = newRoster.warbands.map((warband) => {
    let newWarband = { ...warband };
    if (newWarband.hero && newWarband.hero.faction === "Goblin-town") {
      let newHero = newWarband.hero;
      newHero.warband_size =
        alliance_level === "Historical"
          ? sizes[newHero.unit_type] + 6
          : sizes[newHero.unit_type];
      newWarband.max_units =
        alliance_level === "Historical"
          ? sizes[newHero.unit_type] + 6
          : sizes[newHero.unit_type];
      newWarband.hero = newHero;
    }
    return newWarband;
  });
  return newRoster;
};

export const handleBillCampfire = (roster, alliance_level) => {
  // Specific logic for Bill the Troll's campfire cost, depending on if the alliance level is Historical or not.
  let newRoster = { ...roster };
  newRoster.warbands = newRoster.warbands.map((warband) => {
    let newWarband = { ...warband };
    let newHero = { ...newWarband.hero };
    if (newHero.model_id === "[the_trolls] bill_the_troll") {
      newHero.options = newHero.options.map((_option) => {
        let newOption = { ..._option };
        if (newOption.option === "Campfire") {
          if (newOption.opt_quantity === 1) {
            newRoster["points"] = newRoster["points"] - newHero["pointsTotal"];
            newWarband["points"] =
              newWarband["points"] - newHero["pointsTotal"];
            newHero["pointsPerUnit"] =
              newHero["pointsPerUnit"] - newOption["points"];
            newOption["points"] = alliance_level === "Historical" ? 0 : 15;
            newHero["pointsPerUnit"] =
              newHero["pointsPerUnit"] + newOption["points"];
            newHero["pointsTotal"] = newHero["pointsPerUnit"];
            newWarband["points"] =
              newWarband["points"] + newHero["pointsTotal"];
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
