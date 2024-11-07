import { FunctionComponent } from "react";
import { v4 as uuid } from "uuid";
import { useMesbgData } from "../../../../hooks/mesbg-data.ts";
import { UnitSelectionButton } from "./UnitSelectionButton.tsx";

type WarriorSelectionListProps = {
  filter: string;
};

export const WarriorSelectionList: FunctionComponent<
  WarriorSelectionListProps
> = ({ filter }) => {
  const { getEligibleWarbandUnits } = useMesbgData();

  return (
    <>
      {getEligibleWarbandUnits()
        .filter((unit) =>
          unit.name.toLowerCase().includes(filter?.toLowerCase()),
        )
        .map((row) => (
          <UnitSelectionButton key={uuid()} unitData={row} />
        ))}
    </>
  );
};
