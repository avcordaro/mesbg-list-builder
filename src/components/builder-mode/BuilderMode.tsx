import { useStore } from "../../state/store.ts";
import { SelectionMenu } from "./selection/SelectionMenu";
import { Warbands } from "./warbands/Warbands.tsx";

// TODO: Update the builder mode components to use typescript.
export const BuilderMode = () => {
  const {
    factionSelection,
    tabSelection,
    warriorSelection,
    heroSelection,
    warriorSelectionFocus,
    updateBuilderSidebar,
    roster,
  } = useStore();

  const setFactionSelection = (fs) => {
    updateBuilderSidebar({
      factionSelection: fs,
    });
  };

  const setTabSelection = (tab) => {
    updateBuilderSidebar({
      tabSelection: tab,
    });
  };

  const setDisplaySelection = (b: boolean) => {
    updateBuilderSidebar({
      warriorSelection: b,
    });
  };

  const warbandFocus = roster.warbands.find(
    ({ id }) => id === warriorSelectionFocus[0],
  );

  console.log(warriorSelectionFocus);

  return (
    <>
      <SelectionMenu
        displaySelection={warriorSelection}
        setDisplaySelection={setDisplaySelection}
        tabSelection={tabSelection}
        setTabSelection={setTabSelection}
        factionSelection={factionSelection}
        setFactionSelection={setFactionSelection}
        heroSelection={heroSelection}
        newWarriorFocus={warriorSelectionFocus[1]}
        warbandNumFocus={warbandFocus?.num - 1}
      />
      <Warbands />
    </>
  );
};
