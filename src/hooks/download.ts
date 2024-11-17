import { saveAs } from "file-saver";
import { HTMLOptions, jsPDF } from "jspdf";
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

  const downloadPDF = () => {
    const pdf = new jsPDF("p", "mm", "a4"); // 'p' for portrait, 'mm' for millimeters, 'a4' for size

    const pdfOptions: HTMLOptions = {
      margin: 10,
      width: 190, // (A4 is 210mm wide with margins)
      html2canvas: {
        scale: 0.325, // Scale down the content so it fits on the pages
      },
      autoPaging: "slice",
    };

    // Array of HTML elements you want to include in the PDF
    const elements = [
      document.getElementById("pdf-quick-ref"),
      document.getElementById("pdf-army"),
      document.getElementById("pdf-profiles"),
      document.getElementById("pdf-rules"),
      document.getElementById("pdf-magic"),
      document.getElementById("pdf-stat-trackers"),
    ];

    const addPage = (htmlElement: HTMLElement) => {
      const noOfPages = pdf.internal.pages.length - 1;
      const y = (pdf.internal.pageSize.height - 20) * noOfPages; // sub margins
      pdf.addPage();
      return pdf.html(htmlElement, {
        y: y,
        ...pdfOptions,
      });
    };

    return pdf
      .html(elements[0], pdfOptions)
      .then(() => addPage(elements[1]))
      .then(() => addPage(elements[2]))
      .then(() => addPage(elements[3]))
      .then(() => addPage(elements[4]))
      .then(() => addPage(elements[5]))
      .then(() => pdf.save("mesbg-list-builder"));
  };

  return {
    downloadProfileCards,
    downloadPDF,
    isDownloading,
  };
};
