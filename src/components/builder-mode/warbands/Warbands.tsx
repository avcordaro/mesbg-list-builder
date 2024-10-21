import { DragDropContext, DragStart, DropResult } from "@hello-pangea/dnd";
import AddIcon from "@mui/icons-material/Add";
import Button from "@mui/material/Button";
import Stack from "@mui/material/Stack";
import { useStore } from "../../../state/store.js";
import { moveItem, moveItemBetweenLists } from "../../../utils/array.ts";
import { Warband } from "./Warband.tsx";

/* Displays the list of all warbands, and also defines how each warband card looks. */

export const Warbands = () => {
  const {
    roster,
    addWarband,
    updateBuilderSidebar,
    setDraggedUnit,
    clearDraggedUnit,
    reorderUnits,
  } = useStore();

  const handleNewWarband = () => {
    addWarband();
    updateBuilderSidebar({
      warriorSelection: false,
    });
  };

  const onDragStart = (x: DragStart) => {
    const draggedUnit = roster.warbands
      .flatMap((w) => w.units)
      .find((u) => u.id === x.draggableId);
    if (draggedUnit) setDraggedUnit(draggedUnit);
  };

  const updateRoster = (result: DropResult) => {
    if (!result.destination) {
      clearDraggedUnit();
      return;
    }

    // todo: implement state update...
    if (result.source.droppableId === result.destination.droppableId) {
      if (result.source.index !== result.destination.index) {
        const warband = roster.warbands.find(
          (warband) => warband.id === result.source.droppableId,
        );
        if (warband) {
          const reorderedWarband = moveItem(
            warband.units,
            result.source.index,
            result.destination.index,
          );
          reorderUnits(warband.id, reorderedWarband);
        }
      }
    } else {
      const sourceWarband = roster.warbands.find(
        (warband) => warband.id === result.source.droppableId,
      );
      const destinationWarband = roster.warbands.find(
        (warband) => warband.id === result.destination.droppableId,
      );
      if (sourceWarband && destinationWarband) {
        const [reorderedSource, reorderedDestination] = moveItemBetweenLists(
          sourceWarband.units,
          result.source.index,
          destinationWarband.units,
          result.destination.index,
        );
        reorderUnits(sourceWarband.id, reorderedSource);
        reorderUnits(destinationWarband.id, reorderedDestination);
      }
    }

    clearDraggedUnit();
  };

  return (
    <Stack spacing={1} sx={{ pb: 16 }}>
      <DragDropContext onDragEnd={updateRoster} onDragStart={onDragStart}>
        {roster.warbands.map((warband) => (
          <Warband key={warband.id} warband={warband} />
        ))}
      </DragDropContext>
      <Button
        onClick={() => handleNewWarband()}
        endIcon={<AddIcon />}
        variant="contained"
      >
        Add Warband
      </Button>
    </Stack>
  );
};
