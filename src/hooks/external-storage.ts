import rawData from "../assets/data/mesbg_data.json";
import { AlertTypes } from "../components/alerts/alert-types.tsx";
import { useStore } from "../state/store.ts";
import { Roster } from "../types/roster.ts";
import { isDefinedUnit, Option, Unit } from "../types/unit.ts";
import { useJsonValidation } from "./json-validation.ts";

export const useExternalStorage = () => {
  const { roster, triggerAlert, setRoster } = useStore();
  const { validateKeys } = useJsonValidation();

  const copyRosterToClipboard = () => {
    const rosterJSON = JSON.stringify(shrinkRosterJson(roster));
    window.navigator.clipboard.writeText(rosterJSON);
    triggerAlert(AlertTypes.EXPORT_ALERT);
  };

  const handleExportJSON = (filename: string) => {
    if (filename && filename.trim() !== "") {
      const rosterJSON = JSON.stringify(shrinkRosterJson(roster));
      download(rosterJSON, filename, "application/json");
    }
  };

  const handleImportJSON = (jsonString: string) => {
    const uploadedRoster = JSON.parse(jsonString);

    const hasRequiredKeys = validateKeys(uploadedRoster, [
      "version",
      "warbands",
      "warbands[].id",
      "warbands[].num",
      "warbands[].hero",
      "warbands[].units",
      "warbands[].units[].id",
      "warbands[].units[].model_id",
      "warbands[].units[].quantity",
      "warbands[].units[].options",
      "warbands[].units[].options[].option_id",
      "warbands[].units[].options[].opt_quantity",
    ]);

    if (!hasRequiredKeys) {
      throw Error("Imported JSON roster does not have all required keys.");
    }

    const rehydratedRoster = rehydrateRoster(uploadedRoster);
    setRoster(rehydratedRoster as Roster);
  };

  return {
    exportRoster: (fileName: string) => handleExportJSON(fileName),
    copyToClipboard: () => copyRosterToClipboard(),
    importRoster: (jsonString: string) => handleImportJSON(jsonString),
  };
};

function download(content: string, fileName: string, contentType: string) {
  const a = document.createElement("a");
  const file = new Blob([content], { type: contentType });
  a.href = URL.createObjectURL(file);
  a.download = fileName;
  a.click();
  URL.revokeObjectURL(a.href);
}

const mwfOptions = (options: Option[], rawMwf): [string | number, string][] => {
  const mwfOptions = options.filter((option) =>
    ["Might", "Will", "Fate"].includes(option.option),
  );
  if (mwfOptions.length === 0) {
    return rawMwf;
  }

  const getOpt = (o: string) => {
    const stat = mwfOptions.find((option) => option.option === o);
    if (!stat) return 0;
    return stat.opt_quantity - stat.min;
  };

  const am = getOpt("Might");
  const aw = getOpt("Will");
  const af = getOpt("Fate");
  const [m, w, f, wo] = rawMwf[0][1].split(":").map(Number);

  return [["", [m + am, w + aw, f + af, wo].join(":")]];
};

function reloadDataForUnit(unit: Unit): Unit {
  const modelData = rawData.find(
    (model) => model.model_id === unit.model_id,
  ) as Unit;

  const reloadedOptions = unit.options.map((option) => ({
    ...(modelData.options.find(
      ({ option_id }) => option.option_id === option_id,
    ) as Option),
    opt_quantity: option.opt_quantity,
  }));

  return {
    ...modelData,
    id: unit.id,
    quantity: unit.quantity,
    options: reloadedOptions,
    MWFW: mwfOptions(reloadedOptions, modelData.MWFW),
  };
}

function rehydrateRoster(roster: Partial<Roster>) {
  return {
    ...roster,
    leader_warband_id:
      roster.leader_warband_id ||
      roster.warbands.find(({ num }) => num === roster["leader_warband_num"])
        ?.id,
    warbands: roster.warbands.map((warband) => ({
      ...warband,
      hero: warband.hero !== null && reloadDataForUnit(warband.hero),
      units: warband.units.map((unit) => {
        if (unit !== null && (unit as Unit)?.model_id !== null) {
          return reloadDataForUnit(unit as Unit);
        } else {
          return {
            id: unit.id,
            name: null,
          };
        }
      }),
    })),
  };
}

function shrinkRosterJson(roster: Roster) {
  return {
    version: roster.version,
    leader_warband_id: roster.leader_warband_id,
    warbands: roster.warbands.map((warband) => ({
      id: warband.id,
      num: warband.num,
      hero: isDefinedUnit(warband.hero)
        ? {
            id: warband.hero.id,
            model_id: warband.hero.model_id,
            quantity: warband.hero.quantity,
            options: warband.hero.options.map((option) => ({
              option_id: option.option_id,
              opt_quantity: option.opt_quantity,
            })),
          }
        : null,
      units: warband.units.map((unit) =>
        isDefinedUnit(unit)
          ? {
              id: unit.id,
              model_id: unit.model_id,
              quantity: unit.quantity,
              options: unit.options.map((option) => ({
                option_id: option.option_id,
                opt_quantity: option.opt_quantity,
              })),
            }
          : {
              id: unit.id,
              name: unit.name,
            },
      ),
    })),
  };
}
