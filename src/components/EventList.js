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
          // Pass a boolean to EventCard if it's the closest one.
          isClosest={event.id === closestEventId}
        />
      ))}
    </div>
  );
}

export default EventList;