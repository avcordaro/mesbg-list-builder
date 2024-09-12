import ContentCopyIcon from "@mui/icons-material/ContentCopy";
import { Button, Stack } from "@mui/material";
import { useState } from "react";
import { useFactionData } from "../../../hooks/faction-data.ts";
import { useStore } from "../../../state/store.ts";
import { isDefinedUnit } from "../../../types/unit.ts";

export function RosterTextView({ showArmyBonus }: { showArmyBonus: boolean }) {
  const {
    roster,
    allianceLevel,
    armyBonusActive: hasArmyBonus,
    factions: factionList,
  } = useStore();
  const [copyLabel, setCopyLabel] = useState("Copy");
  const factionData = useFactionData();

  const getTextView = () => {
    let tableString = "";
    tableString += `| Total Points: ${roster.points} | Total Units: ${roster.num_units} | Break Point: ${Math.round(0.5 * roster.num_units * 100) / 100} | `;
    tableString += `\n\nAlliance Level: ${allianceLevel}\n\n`;
    roster.warbands.map((warband) => {
      tableString += "----------------------------------------\n";
      tableString += `Warband ${warband.num} (${warband.points} points)\n`;
      if (warband.hero != null) {
        if (roster["leader_warband_num"] === warband.num) {
          tableString += `  ${warband.hero.name} *LEADER* (${warband.hero.pointsTotal} points)\n`;
        } else {
          tableString += `  ${warband.hero.name} (${warband.hero.pointsTotal} points)\n`;
        }
        warband.hero.options.map((option) => {
          if (option.opt_quantity > 0) {
            tableString += `    - ${option.max > 1 ? option.opt_quantity + " " + option.option : option.option}\n`;
          }
          return null;
        });
      }
      warband.units.filter(isDefinedUnit).map((unit) => {
        if (unit.name != null) {
          tableString += `  ${unit.quantity}x ${unit.name} (${unit.pointsTotal} points)\n`;
          unit.options.map((option) => {
            if (option.opt_quantity > 0) {
              tableString += `    - ${option.max > 1 ? option.opt_quantity + " " + option.option : option.option}\n`;
            }
            return null;
          });
        }
        return null;
      });
      return null;
    });
    tableString += "----------------------------------------\n";
    if (showArmyBonus) {
      tableString += "\n===== Army Bonuses =====\n\n";

      if (hasArmyBonus) {
        factionList.map((f) => {
          tableString += `--- ${f} ---\n\n`;
          tableString +=
            factionData[f]["armyBonus"]
              .replaceAll("<b>", "")
              .replaceAll("</b>", "")
              .replaceAll("<br/>", "\n") + "\n\n";
          return null;
        });
      } else {
        tableString += "No bonuses.";
      }
    }
    return tableString;
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(getTextView());
    setCopyLabel("Copied!");
    window.setTimeout(() => setCopyLabel("Copy"), 3000);
  };

  return (
    <Stack direction="row" spacing={1}>
      <pre style={{ whiteSpace: "pre-wrap" }}>{getTextView()}</pre>
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
