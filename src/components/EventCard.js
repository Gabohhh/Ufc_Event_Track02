// src/components/EventCard.js
import React, { useState } from "react";

// Now accepts an isClosest prop.
function EventCard({ event, reminder, onSaveReminder, onDeleteReminder, isClosest }) {
  // If a reminder exists, use its text; otherwise, start with an empty string.
  const [reminderText, setReminderText] = useState(reminder ? reminder.text : "");
  const [isEditing, setIsEditing] = useState(false);

  const handleSave = () => {
    if (reminderText.trim()) {
      onSaveReminder(event.id, reminderText);
      setIsEditing(false);
    }
  };

  const handleDelete = () => {
    onDeleteReminder(event.id);
    setReminderText("");
  };

  const handleEditToggle = () => {
    // When editing, pre-fill with the existing reminder text.
    setReminderText(reminder ? reminder.text : "");
    setIsEditing(!isEditing);
  };

  // NEW: Add a "closest-event" class if isClosest is true.
  const cardClassName = `event-card ${isClosest ? "closest-event" : ""}`;

  return (
    <div className={cardClassName}>
      {isClosest && <div className="closest-badge">NEXT UP</div>}
      <h3>{event.name}</h3>
      <p>Date: {event.date}</p>
      <p>Status: <span className={`status ${event.status.toLowerCase().replace(" ", "-")}`}>{event.status}</span></p>

      <div className="reminder-section">
        {!isEditing && (
          <>
            {reminder ? (
              <div className="reminder-display">
                {/* UPDATED: Display the more descriptive reminder text. */}
                <p><strong>Reminder:</strong> {reminder.text}</p>
                <button onClick={handleEditToggle}>Edit Reminder</button>
                <button onClick={handleDelete} className="delete-btn">Delete</button>
              </div>
            ) : (
              <button onClick={() => setIsEditing(true)}>Add Reminder</button>
            )}
          </>
        )}

        {isEditing && (
          <div className="reminder-form">
            <input
              type="text"
              value={reminderText}
              onChange={(e) => setReminderText(e.target.value)}
              placeholder="e.g., Watch the main card"
            />
            <button onClick={handleSave}>Save</button>
            <button onClick={() => setIsEditing(false)} className="cancel-btn">Cancel</button>
          </div>
        )}
      </div>
    </div>
  );
}

export default EventCard;