import { FunctionComponent } from "react";
import { v4 as uuid } from "uuid";
import { useMesbgData } from "../../../../hooks/mesbg-data.ts";
import { useRosterBuildingState } from "../../../../state/roster-building";
import { Faction } from "../../../../types/factions.ts";
import { UnitSelectionButton } from "./UnitSelectionButton.tsx";

type HeroSelectionListProps = {
  faction: Faction;
  filter: string;
};

export const HeroSelectionList: FunctionComponent<HeroSelectionListProps> = ({
  faction,
  filter,
}) => {
  const { getHeroesFromFaction } = useMesbgData();
  const { uniqueModels } = useRosterBuildingState();

  return (
    <>
      {getHeroesFromFaction(faction)
        .filter(
          (hero) => !(hero.unique && uniqueModels.includes(hero.model_id)),
        )
        .filter((unit) =>
          unit.name.toLowerCase().includes(filter?.toLowerCase()),
        )
        .map((hero) => (
          <UnitSelectionButton key={uuid()} unitData={hero} />
        ))}
    </>
  );
};
