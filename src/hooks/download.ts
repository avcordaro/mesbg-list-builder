import { saveAs } from "file-saver";
import JSZip from "jszip";
import { useState } from "react";
import hero_constraint_data from "../assets/data/hero_constraint_data.json";
import { useRosterBuildingState } from "../state/roster-building";
import { isDefinedUnit } from "../types/unit.ts";

export const useDownload = () => {
  const [isDownloading, setDownloading] = useState(false);
  const { roster } = useRosterBuildingState();

  const downloadProfileCards = async () => {
    setDownloading(true);
    const profileCards = [];
    roster.warbands.map((_warband) => {
      if (_warband.hero) {
        profileCards.push(
          [_warband.hero.profile_origin, _warband.hero.name].join("|"),
        );
        if (
          _warband.hero.unit_type !== "Siege Engine" &&
          hero_constraint_data[_warband.hero.model_id][0]["extra_profiles"]
            .length > 0
        ) {
          hero_constraint_data[_warband.hero.model_id][0]["extra_profiles"].map(
            (_profile) => {
              profileCards.push(
                [_warband.hero.profile_origin, _profile].join("|"),
              );
              return null;
            },
          );
        }
      }
      _warband.units.filter(isDefinedUnit).map((_unit) => {
        if (_unit.name != null && _unit.unit_type !== "Siege") {
          profileCards.push([_unit.profile_origin, _unit.name].join("|"));
        }
        return null;
      });
      return null;
    });
    const profileCardsSet = new Set(profileCards);
    const finalProfileCards = [...profileCardsSet];

    const zip = new JSZip();
    for (const card of finalProfileCards) {
      const blob = await fetch(
        "assets/images/profiles/" +
          card.split("|")[0] +
          /cards/ +
          card.split("|")[1] +
          ".jpg",
      ).then((res) => res.blob());
      zip.file(card.split("|")[1] + ".jpg", blob, { binary: true });
    }
    zip.generateAsync({ type: "blob" }).then((blob) => {
      const ts = new Date();
      saveAs(
        blob,
        "MESBG-Army-Profiles-" + ts.toISOString().substring(0, 19) + ".zip",
      );
    });
    setDownloading(false);
  };

  return {
    downloadProfileCards,
    isDownloading,
  };
};
