import Accordion from "react-bootstrap/Accordion";
import Button from "react-bootstrap/Button";
import Stack from "react-bootstrap/Stack";
import siege_equipment from "../../../../../assets/data/siege_equipment.json";
import { useStore } from "../../../../../state/store.ts";
import { UnitProfilePicture } from "../../../../common/images/UnitProfilePicture.tsx";

export const SiegeEquipmentSelectionList = () => {
  const { selectUnit, warriorSelectionFocus, updateBuilderSidebar } =
    useStore();

  const handleClick = (data) => {
    const [warband, unit] = warriorSelectionFocus;
    selectUnit(warband, unit, data);
    updateBuilderSidebar({
      warriorSelection: false,
      heroSelection: false,
    });
  };

  return (
    <Accordion style={{ width: "461px" }} className="mt-3 shadow-sm">
      <Accordion.Item eventKey="0">
        <Accordion.Header>
          <b>Siege Equipment</b>
        </Accordion.Header>
        <Accordion.Body>
          <p className="text-muted">
            Equipment to be used for siege games. The full details can be found
            in the &apos;Sieges&apos; section of the main rulebook and the War
            in Rohan supplement book.
          </p>
          {siege_equipment.map((data) => (
            <Button
              key={data.model_id}
              variant="light"
              style={{ textAlign: "left" }}
              className="border shadow-sm w-100 mb-2"
              onClick={() => handleClick(data)}
            >
              <Stack direction="horizontal" gap={3}>
                <UnitProfilePicture
                  army={data.profile_origin}
                  profile={data.name}
                  style={{ width: "75px", height: "75px" }}
                />
                <p>
                  <b>{data.name}</b>
                  <br />
                  Points: {data.base_points}
                </p>
              </Stack>
            </Button>
          ))}
        </Accordion.Body>
      </Accordion.Item>
    </Accordion>
  );
};
