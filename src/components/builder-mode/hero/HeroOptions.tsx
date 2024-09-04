import { FunctionComponent } from "react";
import Form from "react-bootstrap/Form";
import Stack from "react-bootstrap/Stack";
import { v4 as uuid } from "uuid";
import { Unit } from "../../../types/unit.ts";
import { OptionHero } from "./OptionHero";

type HeroOptionsProps = {
  warbandId: string;
  unit: Unit;
};

export const HeroOptions: FunctionComponent<HeroOptionsProps> = ({
  unit,
  warbandId,
}) => {
  return (
    <Stack direction="horizontal" gap={3}>
      {unit.options[0].option !== "None" && (
        <Form>
          {unit.options.map((option) => (
            <OptionHero
              key={uuid()}
              warbandId={warbandId}
              unit={unit}
              option={option}
            />
          ))}
        </Form>
      )}
    </Stack>
  );
};
