import Stack from "@mui/material/Stack";
import Typography from "@mui/material/Typography";
import { FunctionComponent } from "react";
import { GiQueenCrown } from "react-icons/gi";
import { useStore } from "../../../state/store.ts";
import { isDefinedUnit, Unit } from "../../../types/unit.ts";
import { CustomSwitch as Switch } from "../../common/switch/CustomSwitch.tsx";

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
    roster.leader_warband_id === warbandId ? "success" : "default";

  return (
    <Stack direction="row" justifyContent="center" alignItems="center">
      <Typography color={textColor}>
        <GiQueenCrown />
      </Typography>
      <Switch
        id={"switch-" + hero.id + "-leader"}
        name="leader"
        checked={roster.leader_warband_id === warbandId}
        color={textColor}
        onChange={handleLeader}
      />
    </Stack>
  );
};
