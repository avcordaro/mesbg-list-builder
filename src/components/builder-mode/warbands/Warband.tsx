import { FunctionComponent } from "react";
import Button from "react-bootstrap/Button";
import Card from "react-bootstrap/Card";
import { FaPlus } from "react-icons/fa";
import { useStore } from "../../../state/store.ts";
import { isDefinedUnit, Unit } from "../../../types/unit.ts";
import { Warband as WarbandType } from "../../../types/warband.ts";
import { ChooseHeroButton } from "../hero/ChooseHeroButton.tsx";
import { WarbandHero } from "../hero/WarbandHero.tsx";
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

  const isHeroWhoLeads = (hero: Unit): boolean => {
    if (!isDefinedUnit(hero)) return false;

    if (
      ["Independent Hero", "Independent Hero*", "Siege Engine"].includes(
        hero.unit_type,
      )
    )
      return false;

    if (
      [
        "[erebor_reclaimed_(king_thorin)] iron_hills_chariot_(champions_of_erebor)",
        "[desolator_of_the_north] smaug",
      ].includes(hero.model_id)
    )
      return false;

    return true;
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
        <WarbandHero warbandId={warband.id} unit={warband.hero} />
      )}

      {warband.units.map((unit) =>
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

      {isHeroWhoLeads(warband.hero) && (
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
