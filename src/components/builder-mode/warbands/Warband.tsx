import { FunctionComponent } from "react";
import Button from "react-bootstrap/Button";
import Card from "react-bootstrap/Card";
import { FaPlus } from "react-icons/fa";
import { useStore } from "../../../state/store.ts";
import { isDefinedUnit } from "../../../types/unit.ts";
import { Warband as WarbandType } from "../../../types/warband.ts";
import { ChooseHeroButton } from "../hero/ChooseHeroButton.tsx";
import { WarbandHero } from "../hero/WarbandHero.jsx";
import { ChooseWarriorButton } from "../warrior/ChooseWarriorButton.tsx";
import { WarbandWarrior } from "../warrior/WarbandWarrior.tsx";
import { WarbandInfo } from "./WarbandInfo.tsx";

type WarbandProps = {
  warband: WarbandType;
};

export const Warband: FunctionComponent<WarbandProps> = ({ warband }) => {
  const { addUnit, updateBuilderSidebar } = useStore();

  const handleNewWarrior = () => {
    addUnit(warband.id);
    updateBuilderSidebar({
      heroSelection: false,
      warriorSelection: false,
    });
  };

  return (
    <Card
      key={warband.id}
      style={{ width: "850px" }}
      className="p-2 shadow"
      bg="secondary"
      text="light"
    >
      <WarbandInfo warband={warband} />
      {warband.hero == null ? (
        <ChooseHeroButton warbandId={warband.id} />
      ) : (
        <WarbandHero warbandNum={warband.num} unitData={warband.hero} />
      )}
      {warband.units.length > 0 &&
        warband.units.map((unit) =>
          !isDefinedUnit(unit) ? (
            <ChooseWarriorButton
              key={unit.id}
              unit={unit}
              warbandId={warband.id}
            />
          ) : (
            <WarbandWarrior key={unit.id} warbandId={warband.id} unit={unit} />
          ),
        )}
      {warband.hero != null &&
        !["Independent Hero", "Independent Hero*", "Siege Engine"].includes(
          warband.hero.unit_type,
        ) &&
        warband.hero.model_id !==
          "[erebor_reclaimed_(king_thorin)] iron_hills_chariot_(champions_of_erebor)" &&
        warband.hero.model_id !== "[desolator_of_the_north] smaug" && (
          <Button
            onClick={() => handleNewWarrior()}
            variant="info"
            className="m-1"
            style={{ width: "820px" }}
          >
            Add Unit <FaPlus />
          </Button>
        )}
    </Card>
  );
};
