import Alert from "@mui/material/Alert";
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

const ForgeinHeroList: FunctionComponent<HeroSelectionListProps> = ({
  filter,
  faction,
}) => {
  const { getHeroesRaw } = useMesbgData();
  const { uniqueModels, factionType } = useRosterBuildingState();

  const foreignHeroes = getHeroesRaw()
    .filter((hero) => !(hero.unique && uniqueModels.includes(hero.model_id)))
    .filter((hero) => !factionType || hero.faction_type === factionType)
    .filter((unit) => unit.name.toLowerCase().includes(filter?.toLowerCase()));

  return (
    <>
      {foreignHeroes.length > 0 ? (
        <>
          <Alert severity="warning">
            You are looking at heroes outside of {faction}!
          </Alert>
          {foreignHeroes.map((hero) => (
            <>
              <UnitSelectionButton
                key={uuid()}
                unitData={hero}
                foreign={true}
              />
            </>
          ))}
        </>
      ) : (
        <Alert severity="warning">
          There are no heroes listed with a name including &quot;{filter}&quot;
        </Alert>
      )}
    </>
  );
};

export const HeroSelectionList: FunctionComponent<HeroSelectionListProps> = ({
  faction,
  filter,
}) => {
  const { getHeroesFromFaction } = useMesbgData();
  const { uniqueModels, factionType } = useRosterBuildingState();

  const filteredHeroes = getHeroesFromFaction(faction)
    .filter((hero) => !(hero.unique && uniqueModels.includes(hero.model_id)))
    .filter((unit) => unit.name.toLowerCase().includes(filter?.toLowerCase()));

  return (
    <>
      {filteredHeroes.length > 0 &&
        filteredHeroes.map((hero) => (
          <UnitSelectionButton key={uuid()} unitData={hero} />
        ))}
      {filteredHeroes.length === 0 && !factionType.includes("LL") && (
        <ForgeinHeroList faction={faction} filter={filter} />
      )}
      {filteredHeroes.length === 0 && factionType.includes("LL") && (
        <Alert severity="warning">
          There are no heroes listed in {faction} with a name including &quot;
          {filter}&quot;
        </Alert>
      )}
    </>
  );
};
