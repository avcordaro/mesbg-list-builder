import ContentCopyIcon from "@mui/icons-material/ContentCopy";
import { Button, Stack } from "@mui/material";
import { useState } from "react";
import { useFactionData } from "../../../hooks/faction-data.ts";
import { useRosterBuildingState } from "../../../state/roster-building";
import { isDefinedUnit, Unit } from "../../../types/unit.ts";

export function RosterTextView({ showArmyBonus }: { showArmyBonus: boolean }) {
  const {
    roster,
    allianceLevel,
    armyBonusActive: hasArmyBonus,
    factions: factionList,
  } = useRosterBuildingState();
  const [copyLabel, setCopyLabel] = useState("Copy");
  const factionData = useFactionData();

  const heroToText = (hero: Unit, isLeader: boolean) => {
    if (!isDefinedUnit(hero)) return "";

    const name = isLeader
      ? `  ${hero.name} *LEADER* (${hero.pointsTotal} points)`
      : `  ${hero.name} (${hero.pointsTotal} points)`;

    const options = hero.options
      .map((option) => {
        if (option.opt_quantity === 0) return null;
        return `    ~ ${option.max > 1 ? option.opt_quantity + " " + option.option : option.option}  `;
      })
      .filter((o) => !!o);

    if (options.length === 0) return `${name}  `;
    return `${name}  \n${options.join("  \n")}`;
  };

  const unitsToText = (units: Unit[]) => {
    return units
      .map((unit) => {
        const name = `  ${unit.quantity}x ${unit.name} (${unit.pointsTotal} points)`;
        const options = unit.options
          .map((option) => {
            if (option.opt_quantity === 0) return null;
            return `    ~ ${option.max > 1 ? option.opt_quantity + " " + option.option : option.option}  `;
          })
          .filter((o) => !!o);
        if (options.length === 0) return `${name}  `;
        return `${name}  \n${options.join("  \n")}`;
      })
      .join("\n");
  };

  const armyBonus = () => {
    if (!showArmyBonus) return "";
    return `----------------------------------------  
    ===== Army Bonuses =====
    
    ${
      !hasArmyBonus
        ? `No Bonuses`
        : factionList
            .map((f) => {
              return `--- ${f} ---
          
          ${factionData[f]["armyBonus"]
            .replaceAll("<b>", "")
            .replaceAll("</b>", "")
            .replaceAll("<br/>", "\n")}
           
          `;
            })
            .join("  ")
    }
    `;
  };

  const admission = () => {
    return `---------------------------------------- 
    Created with MESBG List Builder (https://avcordaro.github.io/mesbg-list-builder)`;
  };

  const createTextView = () => {
    return `
    | Total Points: ${roster.points} | Total Units: ${roster.num_units} | Break Point: ${Math.round(0.5 * roster.num_units * 100) / 100} |
    
    Alliance Level: ${allianceLevel}
    
    ${roster.warbands
      .map((warband) => {
        return `----------------------------------------  
      Warband ${warband.num} (${warband.points} points)  
      ${heroToText(warband.hero, warband.id === roster.leader_warband_id)}
      ${unitsToText(warband.units.filter(isDefinedUnit))}  
      `;
      })
      .join("  \n")}
      ${armyBonus()}
      ${admission()}
    `;
  };

  const trimMultiline = (input: string) => {
    return input.replace(/^[ \t]+/gm, "");
  };

  const rosterText = trimMultiline(createTextView());

  const handleCopy = () => {
    navigator.clipboard.writeText(rosterText);
    setCopyLabel("Copied!");
    window.setTimeout(() => setCopyLabel("Copy"), 3000);
  };

  return (
    <Stack direction="row" spacing={1}>
      <pre style={{ whiteSpace: "pre-wrap" }}>{rosterText}</pre>
      <Button
        variant="outlined"
        color="inherit"
        onClick={handleCopy}
        sx={{ height: "2rem", p: 3 }}
      >
        <ContentCopyIcon /> {copyLabel}
      </Button>
    </Stack>
  );
}
