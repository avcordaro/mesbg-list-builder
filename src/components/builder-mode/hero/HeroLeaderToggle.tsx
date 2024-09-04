import { FunctionComponent } from "react";
import Form from "react-bootstrap/Form";
import Stack from "react-bootstrap/Stack";
import { GiQueenCrown } from "react-icons/gi";
import { useStore } from "../../../state/store.ts";
import { isDefinedUnit, Unit } from "../../../types/unit.ts";

const HEROS_THAT_CAN_LEAD = [
  "Hero of Legend",
  "Hero of Valour",
  "Hero of Fortitude",
  "Minor Hero",
];

export type HeroLeaderToggleProps = {
  warbandId: string;
  hero: Unit;
};

export const HeroLeaderToggle: FunctionComponent<HeroLeaderToggleProps> = ({
  warbandId,
  hero,
}) => {
  const { roster, makeLeader } = useStore();

  if (!isDefinedUnit(hero)) return null;
  if (!HEROS_THAT_CAN_LEAD.includes(hero.unit_type)) return null;

  const handleLeader = () => makeLeader(warbandId);

  const textColor =
    roster.leader_warband_id === warbandId ? "text-success" : "text-secondary";

  return (
    <Stack className="ms-auto" direction="horizontal">
      <span className={"m-0 me-2 " + textColor}>
        <GiQueenCrown />
      </span>
      <Form.Check
        reverse
        className={textColor}
        type="switch"
        id={"switch-" + hero.id + "-leader"}
        label="Leader"
        name="leader"
        checked={roster.leader_warband_id === warbandId}
        onChange={handleLeader}
      />
    </Stack>
  );
};
