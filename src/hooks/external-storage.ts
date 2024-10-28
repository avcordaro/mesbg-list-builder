import { v4 as uuid } from "uuid";
import rawData from "../assets/data/mesbg_data.json";
import { AlertTypes } from "../components/alerts/alert-types.tsx";
import { useAppState } from "../state/app";
import { useRosterBuildingState } from "../state/roster-building";
import {
  handleAzog,
  handleMahudChief,
  handleMultiWoundMounts,
  handleSiegeEngineCaptainUpdates,
  handleTreebeard,
} from "../state/roster-building/roster/calculations";
import { Roster } from "../types/roster.ts";
import { isDefinedUnit, Option, Unit } from "../types/unit.ts";
import { useJsonValidation } from "./json-validation.ts";

export const useExternalStorage = () => {
  const { roster, setRoster, updateBuilderSidebar, factionSelection } =
    useRosterBuildingState();
  const { triggerAlert } = useAppState();
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
    ]);

    const allModelsCorrect = uploadedRoster.warbands
      .flatMap((warband) => warband.units)
      .every((unit) => {
        if (unit.name === null) return true;
        return validateKeys(unit, [
          "model_id",
          "quantity",
          "options",
          "options[].option_id",
          "options[].opt_quantity",
        ]);
      });

    if (!hasRequiredKeys || !allModelsCorrect) {
      throw Error("Imported JSON roster does not have all required keys.");
    }

    const rehydratedRoster = rehydrateRoster(uploadedRoster);
    const { faction, faction_type } = rehydratedRoster.warbands.find(
      (warband) => isDefinedUnit(warband.hero),
    )?.hero || { faction: "Minas Tirith", faction_type: "Good Army" };
    setRoster(rehydratedRoster as Roster);
    updateBuilderSidebar({
      factionSelection: {
        ...factionSelection,
        [faction_type]: faction,
      },
      tabSelection: faction_type,
    });
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

const mwfwOptions = (
  options: Option[],
  rawMwf,
): [string | number, string][] => {
  const mwfOptions = options.filter((option) =>
    ["Might", "Will", "Fate", "Tough Hide"].includes(option.option),
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
  const awo = getOpt("Tough Hide");
  const [m, w, f, wo] = rawMwf[0][1].split(":").map(Number);

  return [["", [m + am, w + aw, f + af, wo + (awo ? 2 : 0)].join(":")]];
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

  const reloadedUnit = {
    ...modelData,
    id: unit.id,
    quantity: unit.quantity,
    options: reloadedOptions,
    MWFW: mwfwOptions(reloadedOptions, modelData.MWFW),
  };

  // Functions update the reloaded unit to add 'the white warg' or
  // 'merry & pippin' to the imported state.
  handleSiegeEngineCaptainUpdates(reloadedUnit);
  handleMahudChief(reloadedUnit);
  handleAzog(reloadedUnit);
  handleTreebeard(reloadedUnit);
  handleMultiWoundMounts(reloadedUnit);

  return reloadedUnit;
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
        if (unit && (unit as Unit).model_id)
          return reloadDataForUnit(unit as Unit);
        else {
          return {
            id: unit?.id || uuid(),
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
