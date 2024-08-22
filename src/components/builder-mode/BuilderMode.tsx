import { useState } from "react";
import { SelectionMenu } from "./SelectionMenu";
import { Warbands } from "./Warbands";

// TODO: Update the builder mode components to use typescript.
export const BuilderMode = () => {
  const [factionSelection, setFactionSelection] = useState({
    "Good Army": "Minas Tirith",
    "Evil Army": "Mordor",
    "Good LL": "The Return of the King",
    "Evil LL": "The Host of the Dragon Emperor",
  });

  const [tabSelection, setTabSelection] = useState("Good Army");
  const [heroSelection, setHeroSelection] = useState(false);
  const [warbandNumFocus, setWarbandNumFocus] = useState(0);
  const [newWarriorFocus, setNewWarriorFocus] = useState("");

  const [specialArmyOptions, setSpecialArmyOptions] = useState([]);
  const [displaySelection, setDisplaySelection] = useState(false);

  return (
    <>
      <SelectionMenu
        displaySelection={displaySelection}
        setDisplaySelection={setDisplaySelection}
        tabSelection={tabSelection}
        setTabSelection={setTabSelection}
        factionSelection={factionSelection}
        setFactionSelection={setFactionSelection}
        heroSelection={heroSelection}
        newWarriorFocus={newWarriorFocus}
        warbandNumFocus={warbandNumFocus}
        specialArmyOptions={specialArmyOptions}
        setSpecialArmyOptions={setSpecialArmyOptions}
      />
      <Warbands
        setHeroSelection={setHeroSelection}
        setDisplaySelection={setDisplaySelection}
        setWarbandNumFocus={setWarbandNumFocus}
        specialArmyOptions={specialArmyOptions}
        setSpecialArmyOptions={setSpecialArmyOptions}
        setNewWarriorFocus={setNewWarriorFocus}
        setTabSelection={setTabSelection}
        factionSelection={factionSelection}
        setFactionSelection={setFactionSelection}
      />
    </>
  );
};
