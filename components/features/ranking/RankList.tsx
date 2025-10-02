"use client";

import {
  DndContext,
  closestCenter,
  PointerSensor,
  useSensor,
  useSensors,
  DragEndEvent,
} from "@dnd-kit/core";
import {
  arrayMove,
  SortableContext,
  useSortable,
  verticalListSortingStrategy,
} from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { DriverRow, Driver } from "./DriverRow";
import { GripVertical } from "lucide-react";

function SortableItem({ id, index, driver }: { id: string; index: number; driver: Driver }) {
  const { attributes, listeners, setNodeRef, transform, transition } = useSortable({ id });
  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  } as React.CSSProperties;
  return (
    <div ref={setNodeRef} style={style}>
      <DriverRow
        index={index}
        driver={driver}
        dragHandle={
          <button
            aria-label="Drag"
            className="inline-flex h-8 w-8 items-center justify-center rounded-md text-muted-foreground hover:bg-muted/50"
            {...attributes}
            {...listeners}
          >
            <GripVertical className="h-4 w-4" />
          </button>
        }
      />
    </div>
  );
}

export interface RankListProps {
  drivers: Driver[];
  onChange(drivers: Driver[]): void;
}

export function RankList({ drivers, onChange }: RankListProps) {
  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: { distance: 6 },
    })
  );

  function handleDragEnd(event: DragEndEvent) {
    const { active, over } = event;
    if (!over || active.id === over.id) return;
    const oldIndex = drivers.findIndex((d) => d.driverId === active.id);
    const newIndex = drivers.findIndex((d) => d.driverId === over.id);
    const newOrder = arrayMove(drivers, oldIndex, newIndex);
    onChange(newOrder);
  }

  return (
    <DndContext sensors={sensors} collisionDetection={closestCenter} onDragEnd={handleDragEnd}>
      <SortableContext items={drivers.map((d) => d.driverId)} strategy={verticalListSortingStrategy}>
        <div className="space-y-2">
          {drivers.map((driver, index) => (
            <SortableItem key={driver.driverId} id={driver.driverId} index={index} driver={driver} />
          ))}
        </div>
      </SortableContext>
    </DndContext>
  );
}
