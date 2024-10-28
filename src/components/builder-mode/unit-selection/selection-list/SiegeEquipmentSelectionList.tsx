import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import { AccordionDetails, AccordionSummary, Button } from "@mui/material";
import Accordion from "@mui/material/Accordion";
import Box from "@mui/material/Box";
import Stack from "@mui/material/Stack";
import Typography from "@mui/material/Typography";
import siege_equipment from "../../../../assets/data/siege_equipment.json";
import { useRosterBuildingState } from "../../../../state/roster-building";
import { UnitProfilePicture } from "../../../common/images/UnitProfilePicture.tsx";

export const SiegeEquipmentSelectionList = () => {
  const { selectUnit, warriorSelectionFocus, updateBuilderSidebar } =
    useRosterBuildingState();

  const handleClick = (data) => {
    const [warband, unit] = warriorSelectionFocus;
    selectUnit(warband, unit, data);
    updateBuilderSidebar({
      warriorSelection: false,
      heroSelection: false,
    });
  };

  return (
    <Accordion>
      <AccordionSummary
        expandIcon={<ExpandMoreIcon />}
        aria-controls="siege-equipment-options"
        id="siege-equipment-header"
      >
        <b>Siege Equipment</b>
      </AccordionSummary>
      <AccordionDetails>
        <Typography variant="caption" component="p" sx={{ mb: 2 }}>
          Equipment to be used for siege games. The full details can be found in
          the &apos;Sieges&apos; section of the main rulebook and the War in
          Rohan supplement book.
        </Typography>
        {siege_equipment.map((data) => (
          <Button
            key={data.model_id}
            variant="outlined"
            color="inherit"
            onClick={() => handleClick(data)}
            fullWidth
            sx={{
              mt: 1,
            }}
          >
            <Stack
              direction="row"
              spacing={3}
              justifyContent="start"
              alignItems="center"
              sx={{ width: "100%" }}
            >
              <UnitProfilePicture
                army={data.profile_origin}
                profile={data.name}
                size="smaller"
              />
              <Box flexGrow={1} textAlign="start">
                <Typography variant="h6" component="div" fontSize={16}>
                  <b>{data.name}</b>
                </Typography>
                <Typography variant="subtitle2" component="div">
                  Points: {data.base_points}
                </Typography>
              </Box>
            </Stack>
          </Button>
        ))}
      </AccordionDetails>
    </Accordion>
  );
};
