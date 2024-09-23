import { FunctionComponent } from "react";
import { v4 as uuid } from "uuid";
import { useMesbgData } from "../../../../hooks/mesbg-data.ts";
import { UnitSelectionButton } from "./UnitSelectionButton.tsx";

export const WarriorSelectionList: FunctionComponent = () => {
  const { getEligibleWarbandUnits } = useMesbgData();

  return (
    <>
      {getEligibleWarbandUnits().map((row) => (
        <UnitSelectionButton key={uuid()} unitData={row} />
      ))}
    </>
  );
};
