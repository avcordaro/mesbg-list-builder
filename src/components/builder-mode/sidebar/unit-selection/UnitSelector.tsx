import Button from "react-bootstrap/Button";
import Tab from "react-bootstrap/Tab";
import Tabs from "react-bootstrap/Tabs";
import { ImCross } from "react-icons/im";
import { useMesbgData } from "../../../../hooks/mesbg-data.ts";
import { useStore } from "../../../../state/store.ts";
import { FactionType } from "../../../../types/factions.ts";
import { FactionTypeTab } from "./FactionTypeTab.tsx";

const CloseUnitSelectorButton = () => {
  const { updateBuilderSidebar } = useStore();

  return (
    <Button
      variant="light"
      className="ms-2 border"
      style={{ float: "right" }}
      onClick={() =>
        updateBuilderSidebar({
          warriorSelection: false,
        })
      }
    >
      <ImCross />
    </Button>
  );
};

export const UnitSelector = () => {
  const { updateBuilderSidebar, tabSelection, factionType, heroSelection } =
    useStore();
  const { factionsGroupedByType } = useMesbgData();

  const setTabSelection = (tab) => {
    updateBuilderSidebar({
      tabSelection: tab,
    });
  };

  return (
    <>
      <CloseUnitSelectorButton />
      <Tabs activeKey={tabSelection} fill onSelect={setTabSelection}>
        {Object.keys(factionsGroupedByType).map((type: FactionType) => (
          <Tab
            key={type}
            title={type}
            eventKey={type}
            disabled={
              !heroSelection || (factionType !== "" && factionType !== type)
            }
          >
            <FactionTypeTab type={type} />
          </Tab>
        ))}
      </Tabs>
    </>
  );
};
