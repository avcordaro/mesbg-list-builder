import { Draggable, Droppable } from "@hello-pangea/dnd";
import AddIcon from "@mui/icons-material/Add";
import { Collapse } from "@mui/material";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import Card from "@mui/material/Card";
import Stack from "@mui/material/Stack";
import { useTheme } from "@mui/material/styles";
import { FunctionComponent, useEffect, useState } from "react";
import { useMesbgData } from "../../../hooks/mesbg-data.ts";
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
  const { addUnit, updateBuilderSidebar, draggedUnit } = useStore();
  const { getEligibleWarbandUnitsForHero } = useMesbgData();
  const [collapsed, setCollapsed] = useState(false);
  const [dropzoneEnabled, setDropzoneEnabled] = useState(true);
  const theme = useTheme();

  useEffect(() => {
    if (
      !draggedUnit ||
      !isDefinedUnit(draggedUnit) ||
      draggedUnit.unit_type === "Siege"
    ) {
      setDropzoneEnabled(true);
      return;
    }

    if (!isDefinedUnit(warband.hero)) {
      setDropzoneEnabled(true);
      return;
    }

    setDropzoneEnabled(
      getEligibleWarbandUnitsForHero(warband.hero, false)
        .map((unit) => unit.model_id)
        .includes(draggedUnit.model_id),
    );
  }, [draggedUnit, warband.hero, getEligibleWarbandUnitsForHero]);

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
      variant="elevation"
      elevation={3}
      data-scroll-id={warband.id}
      sx={{
        backgroundColor: theme.palette.grey.A700,
        p: 1,
      }}
    >
      <Stack spacing={1}>
        <WarbandInfo
          warband={warband}
          collapse={setCollapsed}
          collapsed={collapsed}
        />

        <Box data-scroll-id={warband.hero?.id}>
          {!isDefinedUnit(warband.hero) ? (
            <ChooseHeroButton warbandId={warband.id} />
          ) : (
            <WarbandHero
              warbandId={warband.id}
              unit={warband.hero}
              collapsed={collapsed}
            />
          )}
        </Box>

        <Droppable droppableId={warband.id} isDropDisabled={!dropzoneEnabled}>
          {(provided, snapshot) => (
            <Stack
              ref={provided.innerRef}
              {...provided.droppableProps}
              spacing={1}
              sx={
                snapshot.isDraggingOver
                  ? {
                      backgroundColor: "#FFFFFF33",
                      border: "1px dashed white",
                      p: 1,
                      transition: "padding 0.3s ease",
                    }
                  : {
                      transition: "padding 0.3s ease",
                    }
              }
            >
              {warband.units
                // Filters 'choose a warrior buttons if the warband is collapsed
                .filter((unit) => !collapsed || isDefinedUnit(unit))
                .map((unit, index) => (
                  <Draggable key={unit.id} draggableId={unit.id} index={index}>
                    {(provided, snapshot) => (
                      <Box
                        ref={provided.innerRef}
                        {...provided.draggableProps}
                        {...provided.dragHandleProps}
                        data-scroll-id={unit.id}
                      >
                        <Box
                          sx={
                            snapshot.isDragging
                              ? {
                                  transform: "rotate(1.5deg)",
                                  boxShadow: "1rem 1rem 1rem #000000FF",
                                  transition:
                                    "transform 0.3s ease, boxShadow 0.3s ease",
                                }
                              : {
                                  transition:
                                    "transform 0.3s ease, boxShadow 0.3s ease",
                                }
                          }
                        >
                          {!isDefinedUnit(unit) ? (
                            <ChooseWarriorButton
                              warbandId={warband.id}
                              unit={unit}
                            />
                          ) : (
                            <WarbandWarrior
                              warbandId={warband.id}
                              unit={unit}
                              collapsed={collapsed}
                            />
                          )}
                        </Box>
                      </Box>
                    )}
                  </Draggable>
                ))}
              {provided.placeholder}
            </Stack>
          )}
        </Droppable>

        <Collapse in={!collapsed}>
          {isHeroWhoLeads(warband.hero) && (
            <Button
              onClick={() => handleNewWarrior()}
              variant="contained"
              color="primary"
              fullWidth
              endIcon={<AddIcon />}
            >
              Add Unit
            </Button>
          )}
        </Collapse>
      </Stack>
    </Card>
  );
};
