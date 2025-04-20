
import { format } from "date-fns";
import { DragDropContext, Droppable, Draggable, DropResult } from 'react-beautiful-dnd';
import { Event } from "@/types";
import { useForm } from "react-hook-form";
import { eventSchema } from "@/schemas/eventSchema";
import { zodResolver } from "@hookform/resolvers/zod";

interface EventsListProps {
  events: Event[];
  setEvents: (events: Event[]) => void;
  onEventSelect: (event: Event) => void;
}

const EventsList = ({ events, setEvents, onEventSelect }: EventsListProps) => {
  const form = useForm({
    resolver: zodResolver(eventSchema),
  });

  const onDragEnd = (result: DropResult) => {
    if (!result.destination) return;

    const startIndex = result.source.index;
    const endIndex = result.destination.index;

    const reorderedEvents = Array.from(events);
    const [movedEvent] = reorderedEvents.splice(startIndex, 1);
    reorderedEvents.splice(endIndex, 0, movedEvent);

    setEvents(reorderedEvents);
  };

  return (
    <DragDropContext onDragEnd={onDragEnd}>
      <Droppable droppableId="events">
        {(provided) => (
          <ul {...provided.droppableProps} ref={provided.innerRef} className="space-y-4">
            {events.map((event, index) => (
              <Draggable key={event.id} draggableId={event.id} index={index}>
                {(provided) => (
                  <li
                    ref={provided.innerRef}
                    {...provided.draggableProps}
                    {...provided.dragHandleProps}
                    className="bg-white rounded-md shadow-sm p-4 border"
                    onClick={() => onEventSelect(event)}
                  >
                    <h3 className="text-lg font-semibold">{event.title}</h3>
                    <p className="text-sm text-muted-foreground">{event.description}</p>
                    <p className="text-xs">
                      {format(new Date(event.start), "PPP")} - {format(new Date(event.end), "PPP")}
                    </p>
                  </li>
                )}
              </Draggable>
            ))}
            {provided.placeholder}
          </ul>
        )}
      </Droppable>
      {events.length === 0 && (
        <div className="text-center text-muted-foreground">
          Nessun evento programmato.
        </div>
      )}
    </DragDropContext>
  );
};

export default EventsList;
