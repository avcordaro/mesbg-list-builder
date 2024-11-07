import { DragDropContext, DragStart, DropResult } from "@hello-pangea/dnd";
import AddIcon from "@mui/icons-material/Add";
import Button from "@mui/material/Button";
import Stack from "@mui/material/Stack";
import { useTheme } from "@mui/material/styles";
import useMediaQuery from "@mui/material/useMediaQuery";
import { createRef, useEffect, useRef } from "react";
import { useScrollToTop } from "../../../hooks/scroll-to.ts";
import { useRosterBuildingState } from "../../../state/roster-building";
import { moveItem, moveItemBetweenLists } from "../../../utils/array.ts";
import { Warband, WarbandActions } from "./Warband.tsx";

/* Displays the list of all warbands, and also defines how each warband card looks. */

export const Warbands = () => {
  const {
    roster,
    addWarband,
    updateBuilderSidebar,
    setDraggedUnit,
    clearDraggedUnit,
    reorderUnits,
    warriorSelection,
  } = useRosterBuildingState();
  const scrollToTop = useScrollToTop("sidebar");
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("lg"));

  const refs = useRef(roster.warbands.map(() => createRef<WarbandActions>()));

  useEffect(() => {
    // Adjust the refs array when the warbands get updated.
    refs.current = roster.warbands.map(
      (_, i) => refs.current[i] || createRef<WarbandActions>(),
    );
  }, [roster.warbands]);

  const handleNewWarband = () => {
    const createdWarbandId = addWarband();
    updateBuilderSidebar({
      warriorSelection: true,
      heroSelection: true,
      warriorSelectionFocus: [createdWarbandId, null],
    });
    setTimeout(scrollToTop, null);
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

  const collapseAll = (collapsed: boolean) => {
    refs.current.forEach((ref) => {
      ref.current.collapseAll(collapsed);
    });
  };

  return isMobile && warriorSelection ? (
    <></>
  ) : (
    <Stack spacing={1} sx={{ pb: 16 }}>
      <DragDropContext onDragEnd={updateRoster} onDragStart={onDragStart}>
        {roster.warbands.map((warband, index) => (
          <Warband
            key={warband.id}
            warband={warband}
            ref={refs.current[index]}
            collapseAll={collapseAll}
          />
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
