import Stack from "react-bootstrap/Stack";
import { useStore } from "../../../../state/store.ts";
import { FactionType } from "../../../../types/factions.ts";
import { FactionPickerDropdown } from "./FactionPickerDropdown.tsx";
import { HeroSelectionList } from "./selection-list/HeroSelectionList.tsx";
import { SiegeEquipmentSelectionList } from "./selection-list/SiegeEquipmentSelectionList.tsx";
import { WarriorSelectionList } from "./selection-list/WarriorSelectionList.tsx";

export function FactionTypeTab({ type }: { type: FactionType }) {
  const { heroSelection, factionSelection } = useStore();
  return (
    <Stack gap={2}>
      <FactionPickerDropdown type={type} />
      {heroSelection ? (
        <HeroSelectionList faction={factionSelection[type]} />
      ) : (
        <>
          <WarriorSelectionList />
          <SiegeEquipmentSelectionList />
        </>
      )}
    </Stack>
  );
}
