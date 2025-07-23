// src/components/EventList.js
import React from "react";
import EventCard from "./EventCard";

// Now accepts closestEventId as a prop.
function EventList({ events, reminders, onSaveReminder, onDeleteReminder, closestEventId }) {
  return (
    <div className="event-list">
      {events.map((event) => (
        <EventCard
          key={event.id}
          event={event}
          reminder={reminders[event.id]}
          onSaveReminder={onSaveReminder}
          onDeleteReminder={onDeleteReminder}
          // pasa booleano si es el evento mas cercano
          isClosest={event.id === closestEventId}
        />
      ))}
    </div>
  );
}

export default EventList;