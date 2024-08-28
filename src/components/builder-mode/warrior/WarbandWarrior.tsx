import { FunctionComponent } from "react";
import Badge from "react-bootstrap/Badge";
import Card from "react-bootstrap/Card";
import Stack from "react-bootstrap/Stack";
import { Unit } from "../../../types/unit.ts";
import { MwfBadge } from "../../common/MwfBadge.tsx";
import { UnitProfilePicture } from "../../images/UnitProfilePicture.tsx";
import { WarriorActions } from "./WarriorActions.tsx";
import { WarriorOptionList } from "./WarriorOptionList.tsx";

/* Warband Warrior components display an individual warrior unit in a warband. */
type WarbandWarriorProps = {
  warbandId: string;
  unit: Unit;
};

export const WarbandWarrior: FunctionComponent<WarbandWarriorProps> = (
  props,
) => {
  const unit = props.unit;

  return (
    <Card style={{ width: "820px" }} className="p-2 pb-3 m-1" bg="light">
      <Stack direction="horizontal" gap={3} style={{ alignItems: "start" }}>
        <UnitProfilePicture
          className="mt-1 mb-1"
          style={{
            width: unit.unit_type === "Siege" ? "75px" : "100px",
            height: unit.unit_type === "Siege" ? "75px" : "100px",
          }}
          army={unit.profile_origin}
          profile={unit.name}
        />

        <Stack gap={2}>
          {/* Name & Points */}
          <Stack direction="horizontal" style={{ minHeight: "26px" }} gap={3}>
            <p className="m-0 fw-bolder">{unit.name}</p>
            <p className="m-0 ms-auto" style={{ paddingRight: "10px" }}>
              Points: <b>{unit.pointsTotal}</b>
              {unit.unit_type === "Warrior" &&
                " (per unit: " + unit.pointsPerUnit + ")"}
            </p>
          </Stack>

          {/* Unit type & MWF */}
          {unit.unit_type !== "Warrior" && unit.unit_type !== "Siege" && (
            <Stack direction="horizontal" style={{ minHeight: "28px" }} gap={1}>
              <Badge bg="dark">{unit.unit_type}</Badge>
              <MwfBadge unit={unit} />
            </Stack>
          )}

          {/* Options and increment buttons*/}
          <Stack direction="horizontal" gap={3}>
            <WarriorOptionList {...props} />
            <WarriorActions {...props} />
          </Stack>
        </Stack>
      </Stack>
    </Card>
  );
};
