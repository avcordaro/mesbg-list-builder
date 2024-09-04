import { FunctionComponent } from "react";
import Badge from "react-bootstrap/Badge";
import Card from "react-bootstrap/Card";
import Stack from "react-bootstrap/Stack";
import { Unit } from "../../../types/unit.ts";
import { MwfBadge } from "../../common/might-will-fate/MwfBadge.tsx";
import { UnitProfilePicture } from "../../images/UnitProfilePicture.tsx";
import { HeroActions } from "./HeroActions.js";
import { HeroLeaderToggle } from "./HeroLeaderToggle";
import { HeroOptions } from "./HeroOptions.js";

type WarbandHeroProps = {
  warbandId: string;
  unit: Unit;
};

export const WarbandHero: FunctionComponent<WarbandHeroProps> = ({
  warbandId,
  unit,
}) => (
  <Card style={{ width: "820px" }} className="p-2 pb-3 m-1" bg="light">
    <Stack direction="horizontal" gap={3} style={{ alignItems: "start" }}>
      <UnitProfilePicture
        army={unit.profile_origin}
        profile={unit.name}
        className="profile mt-1 mb-1"
      />
      <Stack gap={2}>
        <Stack direction="horizontal" style={{ minHeight: "26px" }} gap={3}>
          <p className="m-0">
            <b>{unit.name}</b>
          </p>
          <HeroLeaderToggle warbandId={warbandId} hero={unit} />
          <p
            className={
              [
                "Hero of Legend",
                "Hero of Valour",
                "Hero of Fortitude",
                "Minor Hero",
              ].includes(unit.unit_type)
                ? "m-0 ms-2"
                : "m-0 ms-auto"
            }
            style={{ paddingRight: "10px" }}
          >
            Points: <b>{unit.pointsTotal}</b>
          </p>
        </Stack>
        <Stack direction="horizontal" style={{ minHeight: "28px" }} gap={1}>
          <Badge bg="dark">{unit.unit_type}</Badge>
          <MwfBadge unit={unit} />
        </Stack>
        <HeroOptions warbandId={warbandId} unit={unit} />
        <HeroActions warbandId={warbandId} unit={unit} />
      </Stack>
    </Stack>
  </Card>
);
