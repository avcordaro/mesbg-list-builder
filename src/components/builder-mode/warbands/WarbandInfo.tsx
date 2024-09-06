import Badge from "react-bootstrap/Badge";
import Card from "react-bootstrap/Card";
import Stack from "react-bootstrap/Stack";
import { Warband } from "../../../types/warband.ts";
import { WarbandActions } from "./WarbandActions.tsx";

export const WarbandInfo = ({ warband }: { warband: Warband }) => {
  return (
    <Stack direction="horizontal">
      {warband.hero ? (
        <Card.Text className="ms-2" style={{ fontSize: 20 }}>
          <Badge bg="dark">{warband.hero.faction}</Badge>
        </Card.Text>
      ) : (
        <Card.Text className="ms-2" style={{ fontSize: 20 }}>
          <Badge bg="dark">[Faction]</Badge>
        </Card.Text>
      )}
      <Card.Text className="ms-4">
        Warband: <b>{warband.num}</b>
      </Card.Text>
      <Card.Text
        className={
          warband.max_units !== "-" && warband.num_units > warband.max_units
            ? "ms-4 text-warning"
            : "ms-4"
        }
      >
        Units:{" "}
        <b>
          {warband.num_units} / {warband.max_units}
        </b>
      </Card.Text>
      <Card.Text className="ms-4">
        Points: <b>{warband.points}</b>
      </Card.Text>
      <Card.Text className="ms-4">
        Bows: <b>{warband.bow_count}</b>
      </Card.Text>
      <WarbandActions warband={warband} />
    </Stack>
  );
};
